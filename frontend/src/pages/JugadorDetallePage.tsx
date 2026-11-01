import { useParams, useNavigate } from 'react-router-dom';
import { useJugador } from '../hooks/useJugador';
import type { IClub } from '../types/types';
import { EstadisticasTemporadaCard } from '../components/EstadisticasTemporadaCard';

export const JugadorDetallePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { jugador, cargando, error } = useJugador(id);

    if (cargando)
        return <p style={styles.statusText}>Cargando ficha del jugador...</p>;
    if (error || !jugador)
        return (
            <p style={{ ...styles.statusText, color: '#ef4444' }}>
                {error || 'Jugador no encontrado'}
            </p>
        );

    // Extraer información si clubActualId viene populado como objeto IClub
    const clubActualObj =
        typeof jugador.clubActualId === 'object'
            ? (jugador.clubActualId as IClub)
            : null;

    // Calcular edad estimada a partir de fechaNacimiento
    const calcularEdad = (fechaIso: string) => {
        const nacimiento = new Date(fechaIso);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => navigate(-1)}>
                ← Volver
            </button>

            {/* 1. CABECERA & INFORMACIÓN GENERAL */}
            <section style={styles.headerCard}>
                <div style={styles.headerInfo}>
                    <h1 style={styles.nombre}>
                        {jugador.nombre} {jugador.apellido}
                    </h1>
                    <div style={styles.badgesRow}>
                        <span style={styles.badgePosicion}>
                            {jugador.posicionPrincipal}
                        </span>
                        {jugador.posiciones?.map(
                            (pos, idx) =>
                                pos !== jugador.posicionPrincipal && (
                                    <span
                                        key={idx}
                                        style={styles.badgeSecundaria}
                                    >
                                        {pos}
                                    </span>
                                ),
                        )}
                    </div>

                    <div style={styles.detailsGrid}>
                        <p>
                            <strong>Edad:</strong>{' '}
                            {calcularEdad(jugador.fechaNacimiento)} años
                        </p>
                        <p>
                            <strong>Nacionalidad:</strong>{' '}
                            {jugador.nacionalidad}
                        </p>
                        <p>
                            <strong>Altura:</strong> {jugador.altura} cm
                        </p>
                        <p>
                            <strong>Pie Hábil:</strong> {jugador.pieHabil}
                        </p>
                        <p>
                            <strong>Club Actual:</strong>{' '}
                            {clubActualObj ? (
                                <span
                                    style={styles.clubLink}
                                    onClick={() =>
                                        navigate(`/clubes/${clubActualObj._id}`)
                                    }
                                >
                                    ⚽ {clubActualObj.nombre} (
                                    {clubActualObj.ciudad})
                                </span>
                            ) : (
                                'N/D'
                            )}
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
                <h2
                    style={{
                        fontSize: '1.5rem',
                        color: '#1e293b',
                        borderBottom: '2px solid #e2e8f0',
                        paddingBottom: '0.5rem',
                        marginBottom: '1.25rem',
                    }}
                >
                    📊 Rendimiento Estadístico por Temporada & Posición
                </h2>

                {/* Renderizado adaptativo */}
                <EstadisticasTemporadaCard
                    temporadas={jugador.estadisticas_Temporadas}
                    posicionPrincipal={jugador.posicionPrincipal}
                />
            </section>

            {/* 3. TRAYECTORIA DE CLUBES */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🏟️ Trayectoria de Clubes</h2>
                {jugador.historial_Clubes?.length === 0 ? (
                    <p style={styles.emptyText}>
                        No hay registros de clubes anteriores.
                    </p>
                ) : (
                    <div style={styles.cardsGrid}>
                        {jugador.historial_Clubes.map(
                            (item: any, index: number) => {
                                // 1. Extraer el nombre probando si clubId viene poblado como Objeto o como string desnormalizado
                                const nombreDelClub =
                                    typeof item.clubId === 'object' &&
                                    item.clubId !== null
                                        ? item.clubId.nombre
                                        : item.nombreClub || 'Club Registrado';

                                // 2. Extraer ciudad y país
                                const ciudadDelClub =
                                    typeof item.clubId === 'object' &&
                                    item.clubId !== null
                                        ? item.clubId.ciudad
                                        : item.ciudadClub;

                                const paisDelClub =
                                    typeof item.clubId === 'object' &&
                                    item.clubId !== null
                                        ? item.clubId.pais
                                        : item.paisClub;

                                return (
                                    <div
                                        key={item._id || index}
                                        style={styles.trayectoriaCard}
                                    >
                                        <h3 style={styles.trayectoriaClub}>
                                            ⚽ {nombreDelClub}
                                        </h3>

                                        {(ciudadDelClub || paisDelClub) && (
                                            <p style={styles.trayectoriaSub}>
                                                📍{' '}
                                                {ciudadDelClub
                                                    ? `${ciudadDelClub}, `
                                                    : ''}
                                                {paisDelClub || ''}
                                            </p>
                                        )}

                                        <p style={styles.trayectoriaInfo}>
                                            <strong>Período:</strong>{' '}
                                            {new Date(
                                                item.fechaInicio,
                                            ).toLocaleDateString()}{' '}
                                            —{' '}
                                            {item.fechaFin
                                                ? new Date(
                                                      item.fechaFin,
                                                  ).toLocaleDateString()
                                                : 'Presente'}
                                        </p>
                                        <p style={styles.trayectoriaInfo}>
                                            <strong>Partidos Jugados:</strong>{' '}
                                            {item.partidos}
                                        </p>
                                    </div>
                                );
                            },
                        )}
                    </div>
                )}
            </section>

            {/* 4. HISTORIAL DE LESIONES */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>🏥 Historial de Lesiones</h2>
                {jugador.historial_Lesiones?.length === 0 ? (
                    <p style={styles.emptyText}>
                        El jugador no registra lesiones en su historial clínico.
                    </p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.trHead}>
                                    <th style={styles.th}>Tipo de Lesión</th>
                                    <th style={styles.th}>Fecha Inicio</th>
                                    <th style={styles.th}>Fecha Alta</th>
                                    <th style={styles.th}>Días de Baja</th>
                                    <th style={styles.th}>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jugador.historial_Lesiones.map(
                                    (lesion, index) => (
                                        <tr
                                            key={lesion._id || index}
                                            style={styles.tr}
                                        >
                                            <td style={styles.td}>
                                                <strong
                                                    style={{ color: '#dc2626' }}
                                                >
                                                    {lesion.tipo}
                                                </strong>
                                            </td>
                                            <td style={styles.td}>
                                                {new Date(
                                                    lesion.fechaInicio,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td style={styles.td}>
                                                {lesion.fechaFin
                                                    ? new Date(
                                                          lesion.fechaFin,
                                                      ).toLocaleDateString()
                                                    : 'En recuperación'}
                                            </td>
                                            <td style={styles.td}>
                                                {lesion.diasInactividad} días
                                            </td>
                                            <td style={styles.td}>
                                                {lesion.descripcion}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
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
        marginBottom: '1.5rem',
        color: '#475569',
        fontWeight: 'bold',
    },
    headerCard: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
    },
    headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    nombre: {
        fontSize: '2.5rem',
        color: '#0f172a',
        margin: 0,
    },
    badgesRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    badgePosicion: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        padding: '0.3rem 0.75rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.85rem',
    },
    badgeSecundaria: {
        backgroundColor: '#e2e8f0',
        color: '#475569',
        padding: '0.3rem 0.75rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.85rem',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9',
        color: '#334155',
        fontSize: '1rem',
    },
    clubLink: {
        color: '#0284c7',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: '2.5rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        color: '#1e293b',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    tableContainer: {
        overflowX: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    trHead: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        textAlign: 'left',
    },
    th: {
        padding: '0.85rem 1rem',
        fontSize: '0.85rem',
        fontWeight: 'bold',
    },
    tr: {
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '0.85rem 1rem',
        fontSize: '0.9rem',
        color: '#334155',
    },
    cardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
    },
    trayectoriaCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
    },
    trayectoriaClub: {
        margin: '0 0 0.25rem 0',
        fontSize: '1.1rem',
        color: '#0369a1',
    },
    trayectoriaSub: {
        margin: '0 0 0.75rem 0',
        fontSize: '0.85rem',
        color: '#64748b',
    },
    trayectoriaInfo: {
        margin: '0.3rem 0',
        fontSize: '0.9rem',
        color: '#334155',
    },
};
