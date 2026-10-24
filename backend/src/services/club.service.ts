import { Types } from 'mongoose';
import { ClubModel, IClub } from '../models/Club';
import { JugadorModel } from '../models/Jugador';

export class ClubService {
    static async crearClub(datos: Partial<IClub>): Promise<IClub> {
        const nuevoClub = new ClubModel(datos);
        return await nuevoClub.save();
    }

    static async obtenerTodos(): Promise<IClub[]> {
        return await ClubModel.find().lean();
    }

    static async obtenerPorId(id: string): Promise<IClub | null> {
        return await ClubModel.findById(id).lean();
    }

    static async actualizarClub(id: string, datos: Partial<IClub>): Promise<IClub | null> {
        return await ClubModel.findByIdAndUpdate(id, datos, { new: true }).lean();
    }

    static async eliminarClub(id: string): Promise<IClub | null> {
        return await ClubModel.findByIdAndDelete(id).lean();
    }

    static async obtenerClubConPlantilla(clubId: string) {
    const objectId = new Types.ObjectId(clubId);

    
    const club = await ClubModel.findById(objectId).lean();
    if (!club) return null;

    
    const plantilla = await JugadorModel.find(
        { clubActualId: objectId },
        {
            nombre: 1,
            apellido: 1,
            posicionPrincipal: 1,
            posiciones: 1,
            fechaNacimiento: 1,
            altura: 1,
            pieHabil: 1
        }
        ).lean();

        
        return {
        club,
        plantilla
        };
    }
}