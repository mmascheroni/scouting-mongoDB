import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRankingScouting } from '../../services/jugadorService';

export const RankingScoutingTabla = () => {
    const navigate = useNavigate();
    const [ranking, setRanking] = useState<any[]>([]);
    const [posicionFiltro, setPosicionFiltro] = useState<string>('DEFENSOR');
    const [minGoles, setMinGoles] = useState<number>(0);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        let active = true;
        setCargando(true);

        getRankingScouting(posicionFiltro, minGoles > 0 ? minGoles : undefined)
            .then((data) => {
                if (active) {
                    setRanking(data);
                }
            })
            .catch((err) => {
                if (active) {
                    console.error('Error al cargar ranking:', err);
                }
            })
            .finally(() => {
                if (active) {
                    setCargando(false);
                }
            });

        return () => {
            active = false;
        };
    }, [posicionFiltro, minGoles]);

    const getMetricaHeader = (pos: string) => {
        switch (pos) {
            case 'GOLERO':
                return '🧤 Vallas Invictas';
            case 'DEFENSOR':
                return '🛡️ Duelos Ganados';
            case 'MEDIOCAMPISTA':
                return '🎯 Pases Progresivos';
            case 'DELANTERO':
            default:
                return '⚽ Goles';
        }
    };

    return (
        <div style={styles.cardContainer}>
            {/* BARRA DE FILTROS NATIVA DE SCOUTING */}
            <div style={styles.filterRow}>
                <div style={{ flex: '1 1 250px' }}>
                    <label style={styles.label}>
                        Filtrar Ranking por Posición:
                    </label>
                    <select
                        value={posicionFiltro}
                        onChange={(e) => setPosicionFiltro(e.target.value)}
                        style={styles.selectInput}
                    >
                        <option value='DELANTERO'>Delanteros</option>
                        <option value='MEDIOCAMPISTA'>Mediocampistas</option>
                        <option value='DEFENSOR'>Defensores</option>
                        <option value='GOLERO'>Goleros</option>
                    </select>
                </div>

                {posicionFiltro === 'DELANTERO' && (
                    <div style={{ flex: '0 0 120px' }}>
                        <label style={styles.label}>Mín. Goles:</label>
                        <input
                            type='number'
                            min='0'
                            value={minGoles}
                            onChange={(e) =>
                                setMinGoles(Number(e.target.value))
                            }
                            style={styles.numberInput}
                        />
                    </div>
                )}
            </div>

            {cargando ? (
                <div
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#64748b',
                    }}
                >
                    Cargando datos del ranking...
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.trHead}>
                                <th style={{ ...styles.th, width: '50px' }}>
                                    #
                                </th>
                                <th style={styles.th}>Jugador</th>
                                <th style={styles.th}>Posición</th>
                                <th style={styles.th}>Club Actual</th>
                                <th style={styles.th}>Temporada</th>
                                <th style={styles.th}>
                                    {getMetricaHeader(posicionFiltro)}
                                </th>
                                <th
                                    style={{
                                        ...styles.th,
                                        textAlign: 'center',
                                    }}
                                >
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        No se encontraron jugadores para esta
                                        posición.
                                    </td>
                                </tr>
                            ) : (
                                ranking.map((item, idx) => {
                                    const clubNombre =
                                        item.clubActual?.nombre ||
                                        item.clubActual ||
                                        'Sin club';
                                    const temporadaAnio =
                                        item.estadisticas_Temporadas
                                            ?.temporada ||
                                        item.temporada ||
                                        '2026';
                                    const valorMetrica =
                                        item.criterioPrincipal ??
                                        item.estadisticas_Temporadas?.ofensivas
                                            ?.goles ??
                                        0;

                                    return (
                                        <tr
                                            key={item._id || idx}
                                            style={styles.tr}
                                        >
                                            <td style={styles.tdBold}>
                                                #{idx + 1}
                                            </td>
                                            <td style={styles.tdBold}>
                                                {item.nombre} {item.apellido}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.badge}>
                                                    {item.posicionPrincipal}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {clubNombre}
                                            </td>
                                            <td style={styles.td}>
                                                {temporadaAnio}
                                            </td>
                                            <td style={styles.td}>
                                                <span
                                                    style={styles.metricBadge}
                                                >
                                                    {valorMetrica}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    ...styles.td,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <button
                                                    style={styles.actionBtn}
                                                    onClick={() =>
                                                        navigate(
                                                            `/jugadores/${item._id}`,
                                                        )
                                                    }
                                                >
                                                    Ver Ficha
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        padding: '1.5rem',
    },
    filterRow: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        alignItems: 'flex-end',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#334155',
        marginBottom: '0.4rem',
        display: 'block',
    },
    selectInput: {
        width: '100%',
        padding: '0.6rem 0.8rem',
        borderRadius: '8px',
        border: '1px solid #94a3b8',
        fontSize: '0.9rem',
        color: '#0f172a',
        backgroundColor: '#ffffff',
        outline: 'none',
    },
    numberInput: {
        width: '100%',
        padding: '0.6rem 0.8rem',
        borderRadius: '8px',
        border: '1px solid #94a3b8',
        fontSize: '0.9rem',
        color: '#0f172a',
        backgroundColor: '#ffffff',
        outline: 'none',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    trHead: {
        backgroundColor: '#0f172a',
        color: '#ffffff',
    },
    th: {
        padding: '0.85rem 1rem',
        fontSize: '0.85rem',
        fontWeight: '600',
        textAlign: 'left',
    },
    tr: {
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '0.85rem 1rem',
        fontSize: '0.9rem',
        color: '#334155',
    },
    tdBold: {
        padding: '0.85rem 1rem',
        fontSize: '0.9rem',
        color: '#0f172a',
        fontWeight: '700',
    },
    badge: {
        backgroundColor: '#f1f5f9',
        color: '#334155',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    metricBadge: {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '0.25rem 0.6rem',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '0.85rem',
    },
    actionBtn: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        border: 'none',
        padding: '0.4rem 0.85rem',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
};
