"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubService = void 0;
const mongoose_1 = require("mongoose");
const Club_1 = require("../models/Club");
const Jugador_1 = require("../models/Jugador");
class ClubService {
    static async crearClub(datos) {
        const nuevoClub = new Club_1.ClubModel(datos);
        return await nuevoClub.save();
    }
    static async obtenerTodos() {
        return await Club_1.ClubModel.find().lean();
    }
    static async obtenerPorId(id) {
        return await Club_1.ClubModel.findById(id).lean();
    }
    static async actualizarClub(id, datos) {
        return await Club_1.ClubModel.findByIdAndUpdate(id, datos, { new: true }).lean();
    }
    static async eliminarClub(id) {
        return await Club_1.ClubModel.findByIdAndDelete(id).lean();
    }
    static async obtenerClubConPlantilla(clubId) {
        const objectId = new mongoose_1.Types.ObjectId(clubId);
        const club = await Club_1.ClubModel.findById(objectId).lean();
        if (!club)
            return null;
        const plantilla = await Jugador_1.JugadorModel.find({ clubActualId: objectId }, {
            nombre: 1,
            apellido: 1,
            posicionPrincipal: 1,
            posiciones: 1,
            fechaNacimiento: 1,
            altura: 1,
            pieHabil: 1
        }).lean();
        return {
            club,
            plantilla
        };
    }
}
exports.ClubService = ClubService;
