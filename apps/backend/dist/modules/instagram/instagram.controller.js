"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramController = exports.InstagramController = void 0;
const instagram_service_js_1 = require("./instagram.service.js");
const env_js_1 = require("../../config/env.js");
const response_js_1 = require("../../utils/response.js");
class InstagramController {
    async getOAuthUrl(req, res, next) {
        try {
            const url = instagram_service_js_1.instagramService.getOAuthUrl(req.user._id);
            (0, response_js_1.sendSuccess)(res, { url });
        }
        catch (error) {
            next(error);
        }
    }
    async handleOAuthCallback(req, res) {
        const redirect = new URL('/dashboard/accounts', process.env.CLIENT_URL || 'http://localhost:3000');
        try {
            if (req.query.error || req.query.error_message) {
                throw new Error(req.query.error_message || req.query.error || 'Instagram authorization was cancelled');
            }
            if (!req.query.code || !req.query.state) {
                throw new Error('Instagram authorization did not return a code');
            }
            await instagram_service_js_1.instagramService.connectFromOAuth(req.query.code, req.query.state);
            redirect.searchParams.set('instagram', 'connected');
        }
        catch (error) {
            redirect.searchParams.set('instagram', 'error');
            redirect.searchParams.set('message', error.message || 'Failed to connect Instagram account');
        }
        res.redirect(redirect.toString());
    }
    async verifyWebhook(req, res) {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        if (mode === 'subscribe' && token && token === env_js_1.env.facebook.webhookVerifyToken && challenge) {
            res.status(200).send(challenge);
            return;
        }
        res.status(403).send('Webhook verification failed');
    }
    async handleWebhook(req, res, next) {
        try {
            const result = await instagram_service_js_1.instagramService.processWebhookPayload(req.body);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async connectAccount(req, res, next) {
        try {
            const account = req.body.accessToken
                ? await instagram_service_js_1.instagramService.connectAccount(req.user._id, req.body)
                : await instagram_service_js_1.instagramService.connectConfiguredAccount(req.user._id);
            (0, response_js_1.sendCreated)(res, { account });
        }
        catch (error) {
            next(error);
        }
    }
    async getMedia(req, res, next) {
        try {
            const posts = await instagram_service_js_1.instagramService.getMedia(req.params.accountId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { posts });
        }
        catch (error) {
            next(error);
        }
    }
    async getAccounts(_req, res, next) {
        try {
            const accounts = await instagram_service_js_1.instagramService.getAccounts(_req.user._id);
            (0, response_js_1.sendSuccess)(res, { accounts });
        }
        catch (error) {
            next(error);
        }
    }
    async getAccount(req, res, next) {
        try {
            const account = await instagram_service_js_1.instagramService.getAccountById(req.params.accountId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { account });
        }
        catch (error) {
            next(error);
        }
    }
    async updateAccount(req, res, next) {
        try {
            const account = await instagram_service_js_1.instagramService.updateAccount(req.params.accountId, req.user._id, req.body);
            (0, response_js_1.sendSuccess)(res, { account });
        }
        catch (error) {
            next(error);
        }
    }
    async disconnectAccount(req, res, next) {
        try {
            await instagram_service_js_1.instagramService.disconnectAccount(req.params.accountId, req.user._id);
            (0, response_js_1.sendNoContent)(res);
        }
        catch (error) {
            next(error);
        }
    }
    async processComment(req, res, next) {
        try {
            const result = await instagram_service_js_1.instagramService.processComment(req.user._id, req.body);
            (0, response_js_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
    async pollComments(_req, res, next) {
        try {
            const result = await instagram_service_js_1.instagramService.pollActiveCampaignComments();
            (0, response_js_1.sendSuccess)(res, result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.InstagramController = InstagramController;
exports.instagramController = new InstagramController();
//# sourceMappingURL=instagram.controller.js.map