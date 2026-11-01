import api from '../api/axiosConfig';
import type { IClub, IPlantillaClubResponse } from '../types/types';


export const getClubes = async (): Promise<IClub[]> => {
    const response = await api.get<IClub[]>('/clubes');
    return response.data;
};


export const getPlantillaClub = async (clubId: string): Promise<IPlantillaClubResponse> => {
    const response = await api.get<IPlantillaClubResponse>(`/clubes/${clubId}/plantilla`);
    return response.data;
};