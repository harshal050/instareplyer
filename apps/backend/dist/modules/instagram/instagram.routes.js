"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const instagram_controller_js_1 = require("./instagram.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const instagram_validation_js_1 = require("./instagram.validation.js");
const router = (0, express_1.Router)();
router.get('/oauth/callback', instagram_controller_js_1.instagramController.handleOAuthCallback.bind(instagram_controller_js_1.instagramController));
router.get('/webhook', instagram_controller_js_1.instagramController.verifyWebhook.bind(instagram_controller_js_1.instagramController));
router.post('/webhook', instagram_controller_js_1.instagramController.handleWebhook.bind(instagram_controller_js_1.instagramController));
// All routes below require authentication
router.use(auth_middleware_js_1.authenticate);
router.get('/oauth/url', instagram_controller_js_1.instagramController.getOAuthUrl.bind(instagram_controller_js_1.instagramController));
// Connect Instagram account
router.post('/connect', (0, validation_middleware_js_1.validateBody)(instagram_validation_js_1.connectInstagramSchema.partial()), instagram_controller_js_1.instagramController.connectAccount.bind(instagram_controller_js_1.instagramController));
router.post('/process-comment', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({
    postId: zod_1.z.string().min(1),
    commentId: zod_1.z.string().min(1),
    text: zod_1.z.string(),
})), instagram_controller_js_1.instagramController.processComment.bind(instagram_controller_js_1.instagramController));
router.post('/poll-comments', instagram_controller_js_1.instagramController.pollComments.bind(instagram_controller_js_1.instagramController));
// Get all connected accounts
router.get('/', instagram_controller_js_1.instagramController.getAccounts.bind(instagram_controller_js_1.instagramController));
// Get specific account
router.get('/:accountId', instagram_controller_js_1.instagramController.getAccount.bind(instagram_controller_js_1.instagramController));
// Get posts and reels for campaign selection
router.get('/:accountId/media', instagram_controller_js_1.instagramController.getMedia.bind(instagram_controller_js_1.instagramController));
// Update account
router.patch('/:accountId', (0, validation_middleware_js_1.validateBody)(instagram_validation_js_1.updateInstagramAccountSchema), instagram_controller_js_1.instagramController.updateAccount.bind(instagram_controller_js_1.instagramController));
// Disconnect account
router.delete('/:accountId', instagram_controller_js_1.instagramController.disconnectAccount.bind(instagram_controller_js_1.instagramController));
exports.default = router;
//# sourceMappingURL=instagram.routes.js.map