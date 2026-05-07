"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const billing_controller_js_1 = require("./billing.controller.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.authenticate);
router.get('/', billing_controller_js_1.billingController.overview.bind(billing_controller_js_1.billingController));
router.post('/checkout', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({ plan: zod_1.z.enum(['starter', 'pro', 'enterprise']) })), billing_controller_js_1.billingController.checkout.bind(billing_controller_js_1.billingController));
router.post('/portal', billing_controller_js_1.billingController.portal.bind(billing_controller_js_1.billingController));
router.post('/sync-checkout', (0, validation_middleware_js_1.validateBody)(zod_1.z.object({ sessionId: zod_1.z.string().min(1) })), billing_controller_js_1.billingController.syncCheckout.bind(billing_controller_js_1.billingController));
exports.default = router;
//# sourceMappingURL=billing.routes.js.map