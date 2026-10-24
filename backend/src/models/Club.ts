import { Schema, model, Document } from 'mongoose';

export interface IClub extends Document {
    nombre: string;
    pais: string;
    ciudad: string;
    estadio: string;
    division: string;
}

const ClubSchema = new Schema<IClub>({
    nombre: { type: String, required: true },
    pais: { type: String, required: true, default: 'Uruguay' },
    ciudad: { type: String, required: true },
    estadio: { type: String },
    division: { type: String, required: true }
});

export const ClubModel = model<IClub>('Club', ClubSchema, 'CLUB');