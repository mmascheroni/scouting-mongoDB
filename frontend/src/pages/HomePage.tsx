import { HomeCard } from '../components/HomeCard';

export const HomePage = () => {
    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.mainTitle}>
                    Sistema de Scouting de Jugadores
                </h1>
                <p style={styles.subtitle}>
                    Plataforma de análisis, seguimiento de datos y métricas
                    avanzadas del Fútbol Uruguayo.
                </p>
            </header>

            {/* Cards de Acceso Rápido */}
            <section style={styles.sectionGrid}>
                <HomeCard
                    icono='🏟️'
                    titulo='Clubes'
                    descripcion='Explora los planteles completos, información institucional por equipo.'
                    ruta='/clubes'
                    textoBoton='Ver Clubes'
                />
                <HomeCard
                    icono='🔍'
                    titulo='Búsqueda & Rankings'
                    descripcion='Filtra jugadores por posición, compara métricas clave y genera rankings de rendimiento.'
                    ruta='/buscar'
                    textoBoton='Ir a Búsqueda'
                />
            </section>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
    },
    hero: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    mainTitle: {
        fontSize: '2.5rem',
        color: '#0f172a',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#64748b',
        marginTop: '1.5rem',
    },
    sectionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    sectionTitle: {
        fontSize: '1.75rem',
        color: '#1e293b',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem',
        marginBottom: '1.5rem',
    },
    statusText: {
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#64748b',
    },
    clubesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
    },
    clubCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    clubName: {
        fontSize: '1.1rem',
        color: '#0369a1',
        margin: '0 0 0.5rem 0',
    },
    clubDetail: {
        margin: '0.25rem 0',
        fontSize: '0.85rem',
        color: '#475569',
    },
    badge: {
        display: 'inline-block',
        marginTop: '0.75rem',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
};
