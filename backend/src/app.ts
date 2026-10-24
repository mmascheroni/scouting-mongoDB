import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import clubRoutes from './routes/club.routes';
import jugadorRoutes from './routes/jugador.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'API REST de Scouting escuchando correctamente' });
});


app.use('/api/clubes', clubRoutes);
app.use('/api/jugadores', jugadorRoutes);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
});