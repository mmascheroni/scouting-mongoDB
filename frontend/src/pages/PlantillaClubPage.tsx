import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlantillaClub } from '../services/clubService';
import type { IClub, IJugadorResumen } from '../types/types';

export const PlantillaClubPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [club, setClub] = useState<IClub | null>(null);
    const [plantilla, setPlantilla] = useState<IJugadorResumen[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPlantilla = async () => {
            try {
                setCargando(true);
                const data = await getPlantillaClub(id);
                setClub(data.club);
                setPlantilla(data.plantilla);
            } catch (err: any) {
                setError('No se pudo cargar la plantilla del club.');
            } finally {
                setCargando(false);
            }
        };

        fetchPlantilla();
    }, [id]);

    if (cargando) return <p style={styles.statusText}>Cargando plantilla...</p>;
    if (error)
        return (
            <p style={{ ...styles.statusText, color: '#ef4444' }}>{error}</p>
        );

    return (
        <div style={styles.container}>
            <button
                style={styles.backButton}
                onClick={() => navigate('/clubes')}
            >
                ← Volver a Clubes
            </button>

            {club && (
                <header style={styles.header}>
                    <h1 style={styles.title}>{club.nombre}</h1>
                    <p style={styles.subtitle}>
                        📍 {club.ciudad}, {club.pais} | 🏟️ Estadio:{' '}
                        {club.estadio} | 🏆 {club.division}
                    </p>
                </header>
            )}

            <h2>Plantilla Oficial</h2>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.trHead}>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Posición Principal</th>
                        <th style={styles.th}>Posiciones</th>
                        <th style={styles.th}>Altura</th>
                        <th style={styles.th}>Pie Hábil</th>
                        <th style={styles.th}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {plantilla.map((jugador) => (
                        <tr key={jugador._id} style={styles.tr}>
                            <td style={styles.td}>
                                <strong>
                                    {jugador.nombre} {jugador.apellido}
                                </strong>
                            </td>
                            <td style={styles.td}>
                                {jugador.posicionPrincipal}
                            </td>
                            <td style={styles.td}>
                                {jugador.posiciones.join(', ')}
                            </td>
                            <td style={styles.td}>{jugador.altura} cm</td>
                            <td style={styles.td}>{jugador.pieHabil}</td>
                            <td style={styles.td}>
                                <button
                                    style={styles.actionButton}
                                    onClick={() =>
                                        navigate(`/jugadores/${jugador._id}`)
                                    }
                                >
                                    Ficha Completa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        maxWidth: '100%',
        padding: '2rem 3rem',
        boxSizing: 'border-box',
    },
    statusText: {
        fontSize: '1.2rem',
        color: '#64748b',
        textAlign: 'center',
        marginTop: '3rem',
    },
    backButton: {
        backgroundColor: 'transparent',
        border: '1px solid #cbd5e1',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '1rem',
        color: '#475569',
        fontWeight: 'bold',
    },
    header: {
        marginBottom: '2rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '1rem',
    },
    title: {
        fontSize: '2.2rem',
        color: '#0f172a',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1rem',
        margin: 0,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    trHead: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        textAlign: 'left',
    },
    th: {
        padding: '1rem',
        fontSize: '0.9rem',
        fontWeight: 'bold',
    },
    tr: {
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '1rem',
        fontSize: '0.95rem',
        color: '#334155',
    },
    actionButton: {
        backgroundColor: '#0284c7',
        color: '#fff',
        border: 'none',
        padding: '0.4rem 0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};
