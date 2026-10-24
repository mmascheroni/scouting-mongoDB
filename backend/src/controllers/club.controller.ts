import { Request, Response } from 'express';
import { ClubService } from '../services/club.service';

export const crearClub = async (req: Request, res: Response) => {
    try {
        const club = await ClubService.crearClub(req.body);
        res.status(201).json(club);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const obtenerClubes = async (req: Request, res: Response) => {
    try {
        const clubes = await ClubService.obtenerTodos();
        res.json(clubes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerClubPorId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const club = await ClubService.obtenerPorId(id);
        if (!club) return res.status(404).json({ mensaje: 'Club no encontrado' });
        res.json(club);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerPlantillaClub = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const resultado = await ClubService.obtenerClubConPlantilla(id);
        if (!resultado) {
        return res.status(404).json({ mensaje: 'Club no encontrado' });
        }
        res.json(resultado);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};