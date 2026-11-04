"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const clubesPrimera_1 = require("./data/clubesPrimera");
const Jugador_1 = require("./models/Jugador");
dotenv_1.default.config();
async function main() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scouting_db');
        const jugadoresAntes = await Jugador_1.JugadorModel.countDocuments();
        const agregados = await (0, clubesPrimera_1.completarClubesPrimera)();
        const jugadoresDespues = await Jugador_1.JugadorModel.countDocuments();
        console.log(`Clubes agregados: ${agregados}. Jugadores antes/después: ${jugadoresAntes}/${jugadoresDespues}.`);
    }
    catch (error) {
        console.error('No se pudieron completar los clubes:', error);
        process.exitCode = 1;
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
void main();
