const escudos: Record<string, string> = {
    'Club Nacional de Football': '2684',
    'Defensor Sporting Club': '1007',
    'Danubio Fútbol Club': '4817',
    'Liverpool Fútbol Club': '5492',
    'Montevideo Wanderers Fútbol Club': '5501',
    'Montevideo City Torque': '19002',
    'Club Deportivo Maldonado': '10000',
    'Club Atlético Peñarol': '2683',
    'Racing Club de Montevideo': '9903',
    'Club Atlético Progreso': '6866',
    'Club Atlético Juventud de Las Piedras': '8416',
    'Club Atlético Cerro': '5490',
    'Club Atlético Boston River': '9999',
    'Albion Football Club': '21403',
    'Cerro Largo Fútbol Club': '9902',
    'Central Español Fútbol Club': '131688',
};

export const obtenerEscudoClub = (nombre: string): string | undefined =>
    escudos[nombre] ? `/escudos/${escudos[nombre]}.png` : undefined;
