"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const database_1 = require("@instareplyer/database");
const instagram_service_js_1 = require("./modules/instagram/instagram.service.js");
const logger_js_1 = __importDefault(require("./utils/logger.js"));
async function startServer() {
    try {
        // Connect to MongoDB
        logger_js_1.default.info('Connecting to MongoDB...');
        await (0, database_1.connectMongoDB)();
        // Start the server
        const server = app_js_1.default.listen(env_js_1.env.port, () => {
            logger_js_1.default.info(`Server running on http://localhost:${env_js_1.env.port}`);
            logger_js_1.default.info(`Environment: ${env_js_1.env.nodeEnv}`);
        });
        instagram_service_js_1.instagramService.startCommentPolling();
        // Graceful shutdown
        const shutdown = async (signal) => {
            logger_js_1.default.info(`${signal} received. Shutting down gracefully...`);
            instagram_service_js_1.instagramService.stopCommentPolling();
            server.close(async () => {
                logger_js_1.default.info('HTTP server closed');
                process.exit(0);
            });
            // Force close after 30s
            setTimeout(() => {
                logger_js_1.default.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_js_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map