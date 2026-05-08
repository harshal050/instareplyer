"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
exports.connectMongoDB = connectMongoDB;
exports.disconnectMongoDB = disconnectMongoDB;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
let isConnected = false;
async function connectMongoDB() {
    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    }
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    try {
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log('MongoDB connected successfully');
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}
async function disconnectMongoDB() {
    if (!isConnected)
        return;
    await mongoose_1.default.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected');
}
//# sourceMappingURL=mongodb.js.map