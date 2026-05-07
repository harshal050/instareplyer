"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_js_1 = require("./config/env.js");
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const rate_limit_middleware_js_1 = require("./middleware/rate-limit.middleware.js");
const auth_routes_js_1 = __importDefault(require("./modules/auth/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./modules/users/user.routes.js"));
const instagram_routes_js_1 = __importDefault(require("./modules/instagram/instagram.routes.js"));
const campaign_routes_js_1 = __importDefault(require("./modules/campaigns/campaign.routes.js"));
const analytics_routes_js_1 = __importDefault(require("./modules/analytics/analytics.routes.js"));
const billing_routes_js_1 = __importDefault(require("./modules/billing/billing.routes.js"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_js_1.env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Logging
if (env_js_1.env.isDev) {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// Rate limiting
app.use('/api', rate_limit_middleware_js_1.apiLimiter);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/users', user_routes_js_1.default);
app.use('/api/instagram', instagram_routes_js_1.default);
app.use('/api/campaigns', campaign_routes_js_1.default);
app.use('/api/analytics', analytics_routes_js_1.default);
app.use('/api/billing', billing_routes_js_1.default);
// 404 handler
app.use(error_middleware_js_1.notFoundHandler);
// Error handler
app.use(error_middleware_js_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map