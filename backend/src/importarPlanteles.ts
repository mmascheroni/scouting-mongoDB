import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ClubModel } from './models/Club';
import { JugadorModel } from './models/Jugador';
import { cargarPlanteles } from './services/plantelesDemo';

dotenv.config();

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scouting_db');
        const antes = await JugadorModel.countDocuments();
        const agregados = await cargarPlanteles();
        console.log(`Jugadores agregados: ${agregados}. Total: ${await JugadorModel.countDocuments()} (antes: ${antes}). Clubes: ${await ClubModel.countDocuments()}.`);
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

void main();
