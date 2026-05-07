"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingController = exports.BillingController = void 0;
const billing_service_js_1 = require("./billing.service.js");
const response_js_1 = require("../../utils/response.js");
class BillingController {
    async overview(req, res, next) {
        try {
            const billing = await billing_service_js_1.billingService.getOverview(req.user._id);
            (0, response_js_1.sendSuccess)(res, { billing });
        }
        catch (error) {
            next(error);
        }
    }
    async checkout(req, res, next) {
        try {
            const session = await billing_service_js_1.billingService.createCheckoutSession(req.user._id, req.body.plan);
            (0, response_js_1.sendSuccess)(res, session);
        }
        catch (error) {
            next(error);
        }
    }
    async portal(req, res, next) {
        try {
            const session = await billing_service_js_1.billingService.createPortalSession(req.user._id);
            (0, response_js_1.sendSuccess)(res, session);
        }
        catch (error) {
            next(error);
        }
    }
    async syncCheckout(req, res, next) {
        try {
            await billing_service_js_1.billingService.syncCheckoutSession(req.body.sessionId);
            (0, response_js_1.sendSuccess)(res, { synced: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BillingController = BillingController;
exports.billingController = new BillingController();
//# sourceMappingURL=billing.controller.js.map