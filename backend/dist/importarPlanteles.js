"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Club_1 = require("./models/Club");
const Jugador_1 = require("./models/Jugador");
const plantelesDemo_1 = require("./services/plantelesDemo");
dotenv_1.default.config();
async function main() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scouting_db');
        const antes = await Jugador_1.JugadorModel.countDocuments();
        const agregados = await (0, plantelesDemo_1.cargarPlanteles)();
        console.log(`Jugadores agregados: ${agregados}. Total: ${await Jugador_1.JugadorModel.countDocuments()} (antes: ${antes}). Clubes: ${await Club_1.ClubModel.countDocuments()}.`);
    }
    catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
void main();
