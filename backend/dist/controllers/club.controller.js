"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerPlantillaClub = exports.obtenerClubPorId = exports.obtenerClubes = exports.crearClub = void 0;
const club_service_1 = require("../services/club.service");
const crearClub = async (req, res) => {
    try {
        const club = await club_service_1.ClubService.crearClub(req.body);
        res.status(201).json(club);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.crearClub = crearClub;
const obtenerClubes = async (req, res) => {
    try {
        const clubes = await club_service_1.ClubService.obtenerTodos();
        res.json(clubes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obtenerClubes = obtenerClubes;
const obtenerClubPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const club = await club_service_1.ClubService.obtenerPorId(id);
        if (!club)
            return res.status(404).json({ mensaje: 'Club no encontrado' });
        res.json(club);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obtenerClubPorId = obtenerClubPorId;
const obtenerPlantillaClub = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await club_service_1.ClubService.obtenerClubConPlantilla(id);
        if (!resultado) {
            return res.status(404).json({ mensaje: 'Club no encontrado' });
        }
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.obtenerPlantillaClub = obtenerPlantillaClub;
