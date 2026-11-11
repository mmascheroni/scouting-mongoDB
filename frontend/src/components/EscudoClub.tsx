import { obtenerEscudoClub } from '../data/escudosClubes';

export function EscudoClub({ nombre, tamano = 28 }: { nombre: string; tamano?: number }) {
    const imagen = obtenerEscudoClub(nombre);
    if (!imagen) return null;
    return <img
        src={imagen}
        alt={`Escudo de ${nombre}`}
        width={tamano}
        height={tamano}
        loading='lazy'
        style={{ objectFit: 'contain', verticalAlign: 'middle', marginRight: '.5rem' }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
    />;
}
