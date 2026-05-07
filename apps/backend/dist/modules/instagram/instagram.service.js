"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramService = exports.InstagramService = void 0;
const database_1 = require("@instareplyer/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const campaign_service_js_1 = require("../campaigns/campaign.service.js");
const env_js_1 = require("../../config/env.js");
const errors_js_1 = require("../../utils/errors.js");
const logger_js_1 = __importDefault(require("../../utils/logger.js"));
const GRAPH_API_VERSION = 'v25.0';
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const FACEBOOK_DIALOG_URL = `https://www.facebook.com/${GRAPH_API_VERSION}`;
class InstagramService {
    lastMessageAt = 0;
    pollTimer;
    isPolling = false;
    getOAuthUrl(userId) {
        const clientId = env_js_1.env.facebook.appId || env_js_1.env.instagram.clientId;
        if (!clientId) {
            throw new errors_js_1.BadRequestError('FACEBOOK_APP_ID or INSTAGRAM_CLIENT_ID must be set in .env.local');
        }
        const state = jsonwebtoken_1.default.sign({ userId, purpose: 'instagram_oauth' }, env_js_1.env.jwt.accessSecret, { expiresIn: '10m' });
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: this.getRedirectUri(),
            state,
            response_type: 'code',
            scope: [
                'pages_show_list',
                'pages_read_engagement',
                'instagram_basic',
                'instagram_manage_comments',
                'instagram_manage_messages',
                'business_management',
            ].join(','),
        });
        return `${FACEBOOK_DIALOG_URL}/dialog/oauth?${params}`;
    }
    async connectFromOAuth(code, state) {
        const payload = this.verifyOAuthState(state);
        const token = await this.exchangeCodeForAccessToken(code);
        const longLivedToken = await this.exchangeForLongLivedToken(token.access_token).catch(() => token);
        const page = await this.findInstagramPage(longLivedToken.access_token);
        const instagramAccount = page.instagram_business_account;
        if (!instagramAccount) {
            throw new errors_js_1.BadRequestError('No Instagram Business or Creator account linked to your Facebook Pages was found.');
        }
        return this.connectAccount(payload.userId, {
            accessToken: page.access_token,
            instagramUserId: instagramAccount.id,
            username: instagramAccount.username,
            profilePicture: instagramAccount.profile_picture_url,
        });
    }
    async connectAccount(userId, data) {
        const account = await database_1.InstagramAccountModel.findOneAndUpdate({ userId, instagramUserId: data.instagramUserId }, {
            $set: {
                username: data.username,
                profilePicture: data.profilePicture,
                accessToken: data.accessToken,
                tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        }, { new: true, upsert: true, runValidators: true });
        return this.sanitizeAccount(account);
    }
    async connectConfiguredAccount(userId) {
        if (!env_js_1.env.facebook.pageAccessToken || !env_js_1.env.instagram.businessId) {
            throw new errors_js_1.BadRequestError('PAGE_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ID must be set in .env.local');
        }
        const profile = await this.fetchInstagramProfile(env_js_1.env.instagram.businessId, env_js_1.env.facebook.pageAccessToken);
        return this.connectAccount(userId, {
            accessToken: env_js_1.env.facebook.pageAccessToken,
            instagramUserId: env_js_1.env.instagram.businessId,
            username: profile.username || env_js_1.env.instagram.businessId,
            profilePicture: profile.profile_picture_url,
        });
    }
    async getMedia(accountId, userId) {
        const account = await database_1.InstagramAccountModel.findOne({ _id: accountId, userId }).select('+accessToken');
        if (!account) {
            throw new errors_js_1.NotFoundError('Instagram account not found');
        }
        const params = new URLSearchParams({
            fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
            access_token: account.accessToken,
            limit: '50',
        });
        const response = await fetch(`${FACEBOOK_GRAPH_URL}/${account.instagramUserId}/media?${params}`);
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(data.error?.message || 'Unable to fetch Instagram media');
        }
        return (data.data || []).map((media) => ({
            postId: media.id,
            postUrl: media.permalink,
            mediaType: this.mapMediaType(media.media_type),
            mediaUrl: media.media_url,
            thumbnail: media.thumbnail_url || media.media_url,
            caption: media.caption,
        }));
    }
    async getAccounts(userId) {
        const accounts = await database_1.InstagramAccountModel.find({ userId }).sort({ createdAt: -1 });
        return accounts.map((account) => this.sanitizeAccount(account));
    }
    async getAccountById(accountId, userId) {
        const account = await database_1.InstagramAccountModel.findOne({ _id: accountId, userId });
        if (!account) {
            throw new errors_js_1.NotFoundError('Instagram account not found');
        }
        return this.sanitizeAccount(account);
    }
    async updateAccount(accountId, userId, data) {
        const account = await database_1.InstagramAccountModel.findOneAndUpdate({ _id: accountId, userId }, { $set: data }, { new: true, runValidators: true });
        if (!account) {
            throw new errors_js_1.NotFoundError('Instagram account not found');
        }
        return this.sanitizeAccount(account);
    }
    async disconnectAccount(accountId, userId) {
        const account = await database_1.InstagramAccountModel.findOneAndDelete({ _id: accountId, userId });
        if (!account) {
            throw new errors_js_1.NotFoundError('Instagram account not found');
        }
    }
    async processComment(userId, data) {
        return campaign_service_js_1.campaignService.processCommentForActiveCampaign(data, async (commentId, message, accessToken, instagramUserId) => {
            await this.waitForMessageSlot();
            await this.sendPrivateReply(commentId, message, accessToken, instagramUserId);
        }, userId);
    }
    async processWebhookPayload(payload) {
        const events = this.extractCommentEvents(payload);
        const result = {
            received: events.length,
            processed: 0,
            matched: 0,
            sent: 0,
            ignored: 0,
            errors: [],
        };
        for (const event of events) {
            try {
                const outcome = await campaign_service_js_1.campaignService.processCommentForActiveCampaign(event, async (commentId, message, accessToken, instagramUserId) => {
                    await this.waitForMessageSlot();
                    await this.sendPrivateReply(commentId, message, accessToken, instagramUserId);
                });
                result.processed += 1;
                if (outcome.matched)
                    result.matched += 1;
                if (outcome.sent)
                    result.sent += 1;
            }
            catch (error) {
                if (error instanceof errors_js_1.NotFoundError) {
                    result.ignored += 1;
                }
                else {
                    result.errors.push(error.message || 'Failed to process Instagram comment');
                }
            }
        }
        return result;
    }
    startCommentPolling() {
        if (this.pollTimer || !env_js_1.env.facebook.pageAccessToken) {
            if (!env_js_1.env.facebook.pageAccessToken) {
                logger_js_1.default.warn('Instagram comment polling disabled: PAGE_ACCESS_TOKEN is not set');
            }
            return;
        }
        this.pollTimer = setInterval(() => {
            this.pollActiveCampaignComments().catch((error) => {
                logger_js_1.default.error(`Instagram comment polling failed: ${error.message}`);
            });
        }, 30_000);
        setTimeout(() => {
            this.pollActiveCampaignComments().catch((error) => {
                logger_js_1.default.error(`Initial Instagram comment poll failed: ${error.message}`);
            });
        }, 5_000);
        logger_js_1.default.info('Instagram comment polling started');
    }
    stopCommentPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = undefined;
        }
    }
    async pollActiveCampaignComments() {
        if (this.isPolling) {
            return { campaigns: 0, posts: 0, comments: 0, matched: 0, sent: 0, skipped: true, errors: [] };
        }
        if (!env_js_1.env.facebook.pageAccessToken) {
            throw new errors_js_1.BadRequestError('PAGE_ACCESS_TOKEN must be set in .env.local');
        }
        this.isPolling = true;
        const result = {
            campaigns: 0,
            posts: 0,
            comments: 0,
            matched: 0,
            sent: 0,
            skipped: false,
            errors: [],
        };
        try {
            const campaigns = await database_1.CampaignModel.find({ status: 'active' }).select('posts');
            result.campaigns = campaigns.length;
            const postIds = new Set();
            for (const campaign of campaigns) {
                for (const post of campaign.posts || []) {
                    postIds.add(post.postId);
                }
            }
            for (const postId of postIds) {
                result.posts += 1;
                const comments = await this.fetchRecentComments(postId);
                result.comments += comments.length;
                for (const comment of comments.reverse()) {
                    try {
                        const outcome = await campaign_service_js_1.campaignService.processCommentForActiveCampaign({ postId, commentId: comment.id, text: comment.text }, async (commentId, message, accessToken, instagramUserId) => {
                            await this.waitForMessageSlot();
                            await this.sendPrivateReply(commentId, message, accessToken, instagramUserId);
                        });
                        if (outcome.matched)
                            result.matched += 1;
                        if (outcome.sent)
                            result.sent += 1;
                    }
                    catch (error) {
                        if (!(error instanceof errors_js_1.NotFoundError)) {
                            result.errors.push(`Post ${postId}, comment ${comment.id}: ${error.message}`);
                        }
                    }
                }
            }
            if (result.comments > 0 || result.errors.length > 0) {
                logger_js_1.default.info(`Instagram poll: campaigns=${result.campaigns}, posts=${result.posts}, comments=${result.comments}, matched=${result.matched}, sent=${result.sent}, errors=${result.errors.length}`);
            }
            return result;
        }
        finally {
            this.isPolling = false;
        }
    }
    async waitForMessageSlot() {
        const elapsed = Date.now() - this.lastMessageAt;
        if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }
        this.lastMessageAt = Date.now();
    }
    extractCommentEvents(payload) {
        const events = [];
        for (const entry of payload.entry || []) {
            for (const change of entry.changes || []) {
                if (change.field !== 'comments')
                    continue;
                const commentId = change.value?.id || change.value?.comment_id;
                const postId = change.value?.media?.id || change.value?.media_id || change.value?.post_id;
                const text = change.value?.text || change.value?.message;
                if (commentId && postId && typeof text === 'string') {
                    events.push({ commentId, postId, text });
                }
            }
        }
        return events;
    }
    async fetchRecentComments(postId) {
        const params = new URLSearchParams({
            fields: 'id,text,timestamp,username',
            access_token: env_js_1.env.facebook.pageAccessToken || '',
            limit: '25',
        });
        const response = await fetch(`${FACEBOOK_GRAPH_URL}/${postId}/comments?${params}`);
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(this.formatGraphError(data.error, 'Unable to fetch Instagram comments'));
        }
        return data.data || [];
    }
    async sendPrivateReply(commentId, message, accessToken, instagramUserId) {
        const token = env_js_1.env.facebook.pageAccessToken || accessToken;
        if (!token) {
            throw new errors_js_1.BadRequestError('PAGE_ACCESS_TOKEN must be set in .env.local');
        }
        if (!instagramUserId) {
            throw new errors_js_1.BadRequestError('INSTAGRAM_BUSINESS_ID or connected Instagram account ID is required');
        }
        const response = await fetch(`${FACEBOOK_GRAPH_URL}/${instagramUserId}/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient: { comment_id: commentId },
                message: { text: message },
            }),
        });
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(this.formatGraphError(data.error, 'Unable to send Instagram private reply'));
        }
    }
    formatGraphError(error, fallback) {
        if (!error)
            return fallback;
        const parts = [error.message || fallback];
        if (error.code !== undefined)
            parts.push(`code=${error.code}`);
        if (error.error_subcode !== undefined)
            parts.push(`subcode=${error.error_subcode}`);
        if (error.fbtrace_id)
            parts.push(`trace=${error.fbtrace_id}`);
        return parts.join(' ');
    }
    async fetchInstagramProfile(instagramUserId, accessToken) {
        const params = new URLSearchParams({
            fields: 'id,username,profile_picture_url',
            access_token: accessToken,
        });
        const response = await fetch(`${FACEBOOK_GRAPH_URL}/${instagramUserId}?${params}`);
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(data.error?.message || 'Unable to verify Instagram account');
        }
        return data;
    }
    getRedirectUri() {
        return env_js_1.env.instagram.redirectUri || `${env_js_1.env.apiUrl}/api/instagram/oauth/callback`;
    }
    verifyOAuthState(state) {
        try {
            const payload = jsonwebtoken_1.default.verify(state, env_js_1.env.jwt.accessSecret);
            if (payload.purpose !== 'instagram_oauth' || !payload.userId) {
                throw new Error('Invalid OAuth state');
            }
            return { userId: payload.userId, purpose: 'instagram_oauth' };
        }
        catch {
            throw new errors_js_1.BadRequestError('Instagram authorization expired. Please try connecting again.');
        }
    }
    async exchangeCodeForAccessToken(code) {
        const clientId = env_js_1.env.facebook.appId || env_js_1.env.instagram.clientId;
        const clientSecret = env_js_1.env.facebook.appSecret || env_js_1.env.instagram.clientSecret;
        if (!clientId || !clientSecret) {
            throw new errors_js_1.BadRequestError('Facebook app credentials must be set in .env.local');
        }
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: this.getRedirectUri(),
            code,
        });
        return this.facebookGet(`/oauth/access_token?${params}`);
    }
    async exchangeForLongLivedToken(accessToken) {
        const clientId = env_js_1.env.facebook.appId || env_js_1.env.instagram.clientId;
        const clientSecret = env_js_1.env.facebook.appSecret || env_js_1.env.instagram.clientSecret;
        if (!clientId || !clientSecret) {
            throw new errors_js_1.BadRequestError('Facebook app credentials must be set in .env.local');
        }
        const params = new URLSearchParams({
            grant_type: 'fb_exchange_token',
            client_id: clientId,
            client_secret: clientSecret,
            fb_exchange_token: accessToken,
        });
        return this.facebookGet(`/oauth/access_token?${params}`);
    }
    async findInstagramPage(userAccessToken) {
        const params = new URLSearchParams({
            fields: 'id,name,access_token,instagram_business_account{id,username,profile_picture_url}',
            access_token: userAccessToken,
            limit: '100',
        });
        const response = await this.facebookGet(`/me/accounts?${params}`);
        const pages = response.data || [];
        const page = env_js_1.env.facebook.pageId
            ? pages.find((item) => item.id === env_js_1.env.facebook.pageId && item.instagram_business_account)
            : pages.find((item) => item.instagram_business_account);
        if (!page?.instagram_business_account?.id || !page.access_token) {
            throw new errors_js_1.BadRequestError('No Instagram Business or Creator account linked to your Facebook Pages was found.');
        }
        return page;
    }
    async facebookGet(path) {
        const response = await fetch(`${FACEBOOK_GRAPH_URL}${path}`);
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(data.error?.message || 'Facebook authorization failed');
        }
        return data;
    }
    mapMediaType(mediaType) {
        if (mediaType === 'VIDEO' || mediaType === 'REELS')
            return 'video';
        if (mediaType === 'CAROUSEL_ALBUM')
            return 'carousel';
        return 'image';
    }
    sanitizeAccount(account) {
        const obj = typeof account.toObject === 'function' ? account.toObject() : account;
        return {
            ...obj,
            _id: String(obj._id),
            userId: String(obj.userId),
            accessToken: '',
        };
    }
}
exports.InstagramService = InstagramService;
exports.instagramService = new InstagramService();
//# sourceMappingURL=instagram.service.js.map