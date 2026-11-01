import type { IEstadisticaTemporada } from '../types/types';

interface Props {
    temporadas: IEstadisticaTemporada[];
    posicionPrincipal: string;
}

export const EstadisticasTemporadaCard = ({
    temporadas,
    posicionPrincipal,
}: Props) => {
    if (!temporadas || temporadas.length === 0) {
        return (
            <p style={styles.emptyText}>
                No hay estadísticas registradas para este jugador.
            </p>
        );
    }

    return (
        <div style={styles.container}>
            {temporadas.map((temp, index) => {
                const tieneOfensivas = Boolean(temp.ofensivas);
                const tienePase = Boolean(temp.pase);
                const tieneDefensivas = Boolean(temp.defensivas);
                const tieneGolero = Boolean(temp.golero);
                const tieneDefensor = Boolean(temp.defensor);
                const tieneMediocampista = Boolean(temp.mediocampista);
                const tieneDelantero = Boolean(temp.delantero);

                return (
                    <div key={temp._id || index} style={styles.seasonCard}>
                        {/* Cabecera de la Temporada */}
                        <div style={styles.seasonHeader}>
                            <h3 style={styles.seasonTitle}>
                                🏆 Temporada {temp.temporada} -{' '}
                                <span style={{ color: '#0284c7' }}>
                                    {temp.competicion}
                                </span>
                            </h3>
                        </div>

                        {/* Grid de Secciones de Métricas */}
                        <div style={styles.metricsGrid}>
                            {/* 1. MÉTICAS GENERALES (Siempre presentes) */}
                            <div style={styles.metricBlock}>
                                <h4 style={styles.blockTitle}>📋 Generales</h4>
                                <div style={styles.dataGroup}>
                                    <p>
                                        <strong>Partidos:</strong>{' '}
                                        {temp.generales?.partidos ?? 0}
                                    </p>
                                    <p>
                                        <strong>Titularidades:</strong>{' '}
                                        {temp.generales?.titularidades ?? 0}
                                    </p>
                                    <p>
                                        <strong>Minutos:</strong>{' '}
                                        {temp.generales?.minutos ?? 0}'
                                    </p>
                                    <p>
                                        <strong>Tarjetas:</strong> 🟨{' '}
                                        {temp.generales?.tarjetasAmarillas ?? 0}{' '}
                                        | 🟥{' '}
                                        {temp.generales?.tarjetasRojas ?? 0}
                                    </p>
                                </div>
                            </div>

                            {/* 2. MÉTRICAS DE GOLERO (Si el jugador es Portero o tiene el subdocumento) */}
                            {tieneGolero && temp.golero && (
                                <div
                                    style={{
                                        ...styles.metricBlock,
                                        borderColor: '#0ea5e9',
                                        backgroundColor: '#f0f9ff',
                                    }}
                                >
                                    <h4
                                        style={{
                                            ...styles.blockTitle,
                                            color: '#0369a1',
                                        }}
                                    >
                                        🧤 Específicas de Golero
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>Atajadas:</strong>{' '}
                                            {temp.golero.atajadas}
                                        </p>
                                        <p>
                                            <strong>Goles Recibidos:</strong>{' '}
                                            {temp.golero.golesRecibidos}
                                        </p>
                                        <p>
                                            <strong>Vallas Invictas:</strong>{' '}
                                            {temp.golero.vallasInvictas}
                                        </p>
                                        <p>
                                            <strong>Penales Atajados:</strong>{' '}
                                            {temp.golero.penalesAtajados}
                                        </p>
                                        <p>
                                            <strong>Salidas Exitosas:</strong>{' '}
                                            {temp.golero.salidasExitosas}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 3. MÉTRICAS OFENSIVAS */}
                            {tieneOfensivas && temp.ofensivas && (
                                <div style={styles.metricBlock}>
                                    <h4 style={styles.blockTitle}>
                                        ⚽ Producción Ofensiva
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>Goles:</strong>{' '}
                                            {temp.ofensivas.goles}
                                        </p>
                                        <p>
                                            <strong>Asistencias:</strong>{' '}
                                            {temp.ofensivas.asistencias}
                                        </p>
                                        <p>
                                            <strong>
                                                xG (Goles Esperados):
                                            </strong>{' '}
                                            {temp.ofensivas.xG}
                                        </p>
                                        <p>
                                            <strong>
                                                xA (Asist. Esperadas):
                                            </strong>{' '}
                                            {temp.ofensivas.xA}
                                        </p>
                                        <p>
                                            <strong>Tiros / Al Arco:</strong>{' '}
                                            {temp.ofensivas.tiros} /{' '}
                                            {temp.ofensivas.tirosAlArco}
                                        </p>
                                        <p>
                                            <strong>Regates:</strong>{' '}
                                            {temp.ofensivas.regates}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 4. MÉTRICAS DE PASE Y DISTRIBUCIÓN */}
                            {tienePase && temp.pase && (
                                <div style={styles.metricBlock}>
                                    <h4 style={styles.blockTitle}>
                                        🎯 Pase y Creación
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>Pases Completados:</strong>{' '}
                                            {temp.pase.pasesCompletados}
                                        </p>
                                        <p>
                                            <strong>Pases Clave:</strong>{' '}
                                            {temp.pase.pasesClave}
                                        </p>
                                        <p>
                                            <strong>Pases Progresivos:</strong>{' '}
                                            {temp.pase.pasesProgresivos}
                                        </p>
                                        <p>
                                            <strong>Ocasiones Creadas:</strong>{' '}
                                            {temp.pase.ocasionesCreadas}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 5. MÉTRICAS DEFENSIVAS */}
                            {tieneDefensivas && temp.defensivas && (
                                <div style={styles.metricBlock}>
                                    <h4 style={styles.blockTitle}>
                                        🛡️ Trabajo Defensivo
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>Duelos Ganados:</strong>{' '}
                                            {temp.defensivas.duelosGanados}
                                        </p>
                                        <p>
                                            <strong>Intercepciones:</strong>{' '}
                                            {temp.defensivas.intercepciones}
                                        </p>
                                        <p>
                                            <strong>Recuperaciones:</strong>{' '}
                                            {temp.defensivas.recuperaciones}
                                        </p>
                                        <p>
                                            <strong>
                                                Despejes / Entradas:
                                            </strong>{' '}
                                            {temp.defensivas.despejes} /{' '}
                                            {temp.defensivas.entradas}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 6. MÉTRICAS ESPECÍFICAS DE DEFENSOR */}
                            {tieneDefensor && temp.defensor && (
                                <div
                                    style={{
                                        ...styles.metricBlock,
                                        borderColor: '#64748b',
                                        backgroundColor: '#f8fafc',
                                    }}
                                >
                                    <h4
                                        style={{
                                            ...styles.blockTitle,
                                            color: '#334155',
                                        }}
                                    >
                                        🏔️ Métricas de Defensor
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>Bloqueos:</strong>{' '}
                                            {temp.defensor.bloqueos}
                                        </p>
                                        <p>
                                            <strong>
                                                Duelos Aéreos Ganados:
                                            </strong>{' '}
                                            {temp.defensor.duelosAereosGanados}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 7. MÉTRICAS ESPECÍFICAS DE MEDIOCAMPISTA */}
                            {tieneMediocampista && temp.mediocampista && (
                                <div
                                    style={{
                                        ...styles.metricBlock,
                                        borderColor: '#8b5cf6',
                                        backgroundColor: '#f5f3ff',
                                    }}
                                >
                                    <h4
                                        style={{
                                            ...styles.blockTitle,
                                            color: '#6d28d9',
                                        }}
                                    >
                                        🧠 Métricas de Mediocampista
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>
                                                Regates Completados:
                                            </strong>{' '}
                                            {
                                                temp.mediocampista
                                                    .regatesCompletados
                                            }
                                        </p>
                                        <p>
                                            <strong>
                                                Duelos Ofensivos Ganados:
                                            </strong>{' '}
                                            {
                                                temp.mediocampista
                                                    .duelosOfensivosGanados
                                            }
                                        </p>
                                        <p>
                                            <strong>Pases Progresivos:</strong>{' '}
                                            {
                                                temp.mediocampista
                                                    .pasesProgresivos
                                            }
                                        </p>
                                        <p>
                                            <strong>Ocasiones Creadas:</strong>{' '}
                                            {
                                                temp.mediocampista
                                                    .ocasionesCreadas
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 8. MÉTRICAS ESPECÍFICAS DE DELANTERO */}
                            {tieneDelantero && temp.delantero && (
                                <div
                                    style={{
                                        ...styles.metricBlock,
                                        borderColor: '#ef4444',
                                        backgroundColor: '#fef2f2',
                                    }}
                                >
                                    <h4
                                        style={{
                                            ...styles.blockTitle,
                                            color: '#b91c1c',
                                        }}
                                    >
                                        🔥 Métricas de Delantero
                                    </h4>
                                    <div style={styles.dataGroup}>
                                        <p>
                                            <strong>
                                                Duelos Ofensivos Ganados:
                                            </strong>{' '}
                                            {
                                                temp.delantero
                                                    .duelosOfensivosGanados
                                            }
                                        </p>
                                        <p>
                                            <strong>
                                                Regates Completados:
                                            </strong>{' '}
                                            {temp.delantero.regatesCompletados}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    seasonCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    },
    seasonHeader: {
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '0.75rem',
        marginBottom: '1rem',
    },
    seasonTitle: {
        fontSize: '1.25rem',
        color: '#0f172a',
        margin: 0,
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
    },
    metricBlock: {
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#ffffff',
    },
    blockTitle: {
        fontSize: '0.95rem',
        color: '#1e293b',
        margin: '0 0 0.5rem 0',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.25rem',
    },
    dataGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        fontSize: '0.85rem',
        color: '#334155',
    },
};
