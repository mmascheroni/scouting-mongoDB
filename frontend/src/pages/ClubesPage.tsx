import { useNavigate } from 'react-router-dom';
import { useClubes } from '../hooks/useClubes';
import { obtenerEscudoClub } from '../data/escudosClubes';

export const ClubesPage = () => {
    const { clubes, cargando, error } = useClubes();
    const navigate = useNavigate();

    if (cargando) {
        return (
            <div style={styles.container}>
                <p style={styles.statusText}>Cargando catálogo de clubes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <p style={{ ...styles.statusText, color: '#ef4444' }}>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Catálogo de Clubes</h1>
                <p style={styles.subtitle}>
                    Lista oficial de instituciones registradas en el sistema de
                    scouting.
                </p>
            </header>

            <div style={styles.grid}>
                {clubes.map((club) => (
                    <div key={club._id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div style={styles.clubIdentity}>
                                {obtenerEscudoClub(club.nombre) && <img
                                    src={obtenerEscudoClub(club.nombre)}
                                    alt={`Escudo de ${club.nombre}`}
                                    width={64}
                                    height={64}
                                    loading='lazy'
                                    style={styles.escudo}
                                    onError={e => { e.currentTarget.style.display = 'none'; }}
                                />}
                                <h2 style={styles.clubName}>{club.nombre}</h2>
                            </div>
                            <span style={styles.badge}>{club.division}</span>
                        </div>

                        <div style={styles.cardBody}>
                            <p style={styles.field}>
                                <strong>País:</strong> {club.pais}
                            </p>
                            <p style={styles.field}>
                                <strong>Ciudad:</strong> {club.ciudad}
                            </p>
                            <p style={styles.field}>
                                <strong>Estadio:</strong>{' '}
                                {club.estadio || 'No especificado'}
                            </p>
                        </div>

                        <div style={styles.cardFooter}>
                            <button
                                style={styles.button}
                                onClick={() => navigate(`/clubes/${club._id}`)}
                            >
                                Ver Plantilla →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
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
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        color: '#0f172a',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1rem',
        margin: 0,
    },
    statusText: {
        fontSize: '1.2rem',
        color: '#64748b',
        textAlign: 'center',
        marginTop: '3rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '0.75rem',
        flexWrap: 'wrap',
    },
    clubIdentity: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: '1 1 200px',
        minWidth: 0,
    },
    escudo: {
        objectFit: 'contain',
        flexShrink: 0,
    },
    clubName: {
        fontSize: '1.25rem',
        color: '#0369a1',
        margin: 0,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '0.25rem 0.6rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1.5rem',
    },
    field: {
        margin: 0,
        fontSize: '0.95rem',
        color: '#334155',
    },
    cardFooter: {
        marginTop: 'auto',
    },
    button: {
        width: '100%',
        backgroundColor: '#0284c7',
        color: '#ffffff',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};
