import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EscudoClub } from '../EscudoClub';
import type { ITrayectoriaJugador } from '../../types/types';

export const TrayectoriaCardsGrid = () => {
    const navigate = useNavigate();

    // 1. Estados de datos, carga, error y filtros
    const [trayectorias, setTrayectorias] = useState<ITrayectoriaJugador[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [textoBusqueda, setTextoBusqueda] = useState<string>('');
    const [posicionFiltro, setPosicionFiltro] = useState<string>('TODAS');
    const [clubFiltro, setClubFiltro] = useState<string>('TODOS');

    // 2. Consumo directo de la API REST al montarse el componente
    useEffect(() => {
        let active = true;
        setCargando(true);

        fetch('http://localhost:3000/api/jugadores/trayectoria')
            .then((res) => {
                if (!res.ok)
                    throw new Error('Error al obtener las trayectorias');
                return res.json();
            })
            .then((data) => {
                if (active) setTrayectorias(data);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setCargando(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const clubes = Array.from(new Map(trayectorias.flatMap(item =>
        item.clubActual ? [[item.clubActual._id, item.clubActual] as const] : [],
    )).values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    // 3. Los filtros de nombre, club actual y posición se combinan.
    const filtradas = trayectorias.filter((item) => {
        const nombreCompleto =
            `${item.nombre || ''} ${item.apellido || ''}`.toLowerCase();
        const coincideTexto = nombreCompleto.includes(
            textoBusqueda.toLowerCase(),
        );
        const coincidePosicion =
            posicionFiltro === 'TODAS' ||
            item.posicionPrincipal === posicionFiltro;
        const coincideClub = clubFiltro === 'TODOS' ||
            (clubFiltro === 'SIN_CLUB' ? !item.clubActual : item.clubActual?._id === clubFiltro);
        return coincideTexto && coincidePosicion && coincideClub;
    });

    if (cargando) {
        return (
            <p
                style={{
                    textAlign: 'center',
                    color: '#64748b',
                    marginTop: '2rem',
                }}
            >
                Cargando trayectorias desde la API...
            </p>
        );
    }

    if (error) {
        return (
            <p
                style={{
                    textAlign: 'center',
                    color: '#ef4444',
                    marginTop: '2rem',
                }}
            >
                Error: {error}
            </p>
        );
    }

    return (
        <div>
            {/* BARRA DE FILTROS AUTÓNOMA */}
            <div style={styles.filterRow}>
                <div style={{ flex: '2 1 250px' }}>
                    <label htmlFor='trayectoria-nombre' style={styles.label}>Buscar Nombre/Apellido:</label>
                    <input
                        id='trayectoria-nombre'
                        type='text'
                        placeholder='Ej. Luis Mejía...'
                        value={textoBusqueda}
                        onChange={(e) => setTextoBusqueda(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={{ flex: '1 1 200px' }}>
                    <label htmlFor='trayectoria-club' style={styles.label}>Club actual:</label>
                    <select
                        id='trayectoria-club'
                        value={clubFiltro}
                        onChange={e => setClubFiltro(e.target.value)}
                        style={styles.selectInput}
                    >
                        <option value='TODOS'>Todos los clubes</option>
                        {clubes.map(club => <option key={club._id} value={club._id}>{club.nombre}</option>)}
                        <option value='SIN_CLUB'>Sin club asignado</option>
                    </select>
                </div>

                <div style={{ flex: '1 1 200px' }}>
                    <label htmlFor='trayectoria-posicion' style={styles.label}>Posición Principal:</label>
                    <select
                        id='trayectoria-posicion'
                        value={posicionFiltro}
                        onChange={(e) => setPosicionFiltro(e.target.value)}
                        style={styles.selectInput}
                    >
                        <option value='TODAS'>Todas las Posiciones</option>
                        <option value='GOLERO'>Goleros</option>
                        <option value='DEFENSOR'>Defensores</option>
                        <option value='MEDIOCAMPISTA'>Mediocampistas</option>
                        <option value='DELANTERO'>Delanteros</option>
                    </select>
                </div>
            </div>

            {filtradas.length === 0 ? (
                <p
                    style={{
                        textAlign: 'center',
                        color: '#94a3b8',
                        marginTop: '3rem',
                    }}
                >
                    No se encontraron trayectorias que coincidan con los
                    criterios de búsqueda.
                </p>
            ) : (
                <div style={styles.gridTrayectorias}>
                    {filtradas.map((item) => {
                        const clubActualNombre =
                            typeof item.clubActual === 'object' &&
                            item.clubActual !== null
                                ? (item.clubActual as any).nombre
                                : item.clubActual || 'Sin club asignado';

                        const clubActualCiudad =
                            typeof item.clubActual === 'object' &&
                            item.clubActual !== null &&
                            (item.clubActual as any).ciudad
                                ? ` (${(item.clubActual as any).ciudad})`
                                : '';

                        return (
                            <div key={item._id} style={styles.trayectoriaCard}>
                                <div style={styles.cardTop}>
                                    <div>
                                        <h3 style={styles.jugadorNombre}>
                                            {item.nombre} {item.apellido}
                                        </h3>
                                        <span style={styles.badge}>
                                            {item.posicionPrincipal}
                                        </span>
                                    </div>
                                    <button
                                        style={styles.actionBtn}
                                        onClick={() =>
                                            navigate(`/jugadores/${item._id}`)
                                        }
                                    >
                                        Ficha Completa →
                                    </button>
                                </div>

                                <p style={styles.clubActualLabel}>
                                    <strong>Club Actual:</strong>{' '}
                                    <EscudoClub nombre={clubActualNombre} />
                                    {item.clubActual
                                        ? `${clubActualNombre}${clubActualCiudad}`
                                        : 'Sin club asignado'}
                                </p>

                                <h4 style={styles.subTitleHistorial}>
                                    Historial de Clubes Anteriores:
                                </h4>
                                <div style={styles.timelineList}>
                                    {item.historial_Clubes?.length === 0 ? (
                                        <p style={styles.emptyHistorial}>
                                            Sin clubes anteriores registrados.
                                        </p>
                                    ) : (
                                        item.historial_Clubes.map(
                                            (club: any, idx: number) => (
                                                <div
                                                    key={club._id || idx}
                                                    style={styles.timelineItem}
                                                >
                                                    <span style={styles.dot} />
                                                    <div>
                                                        <strong>
                                                            <EscudoClub nombre={club.nombreClub || ''} />
                                                            {club.nombreClub ||
                                                                'Club Registrado'}
                                                        </strong>
                                                        {club.ciudadClub && (
                                                            <span
                                                                style={
                                                                    styles.location
                                                                }
                                                            >
                                                                {' '}
                                                                (📍{' '}
                                                                {
                                                                    club.ciudadClub
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                        <p
                                                            style={
                                                                styles.timelinePeriod
                                                            }
                                                        >
                                                            🗓️{' '}
                                                            {club.fechaInicio
                                                                ? new Date(
                                                                      club.fechaInicio,
                                                                  ).toLocaleDateString()
                                                                : 'N/D'}{' '}
                                                            —{' '}
                                                            {club.fechaFin
                                                                ? new Date(
                                                                      club.fechaFin,
                                                                  ).toLocaleDateString()
                                                                : 'Presente'}{' '}
                                                            | 👕{' '}
                                                            {club.partidos ?? 0}{' '}
                                                            partidos
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    filterRow: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.4rem',
        display: 'block',
    },
    searchInput: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    selectInput: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    gridTrayectorias: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
    },
    trayectoriaCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
    },
    jugadorNombre: { margin: 0, fontSize: '1.25rem', color: '#0f172a' },
    badge: {
        display: 'inline-block',
        marginTop: '0.25rem',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
    clubActualLabel: {
        fontSize: '0.95rem',
        color: '#334155',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '0.75rem',
        marginBottom: '0.75rem',
    },
    subTitleHistorial: {
        fontSize: '0.9rem',
        color: '#64748b',
        margin: '0 0 0.75rem 0',
    },
    timelineList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    timelineItem: {
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        fontSize: '0.88rem',
        color: '#334155',
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#0284c7',
        marginTop: '6px',
    },
    location: { color: '#64748b', fontSize: '0.8rem' },
    timelinePeriod: {
        margin: '0.2rem 0 0 0',
        fontSize: '0.8rem',
        color: '#64748b',
    },
    emptyHistorial: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    actionBtn: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};
