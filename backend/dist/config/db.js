"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scouting_db';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Conexión exitosa a MongoDB');
    }
    catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
