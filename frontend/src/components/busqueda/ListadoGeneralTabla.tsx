import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJugadores } from '../../services/jugadorService';
import type { IJugadorCompleto, IClub } from '../../types/types';

export const ListadoGeneralTabla = () => {
    const navigate = useNavigate();

    // 1. Estados propios del componente
    const [jugadores, setJugadores] = useState<IJugadorCompleto[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [textoBusqueda, setTextoBusqueda] = useState<string>('');
    const [posicionFiltro, setPosicionFiltro] = useState<string>('TODAS');

    // 2. Consumo directo de la API REST al cargarse el tab
    useEffect(() => {
        let active = true;
        setCargando(true);

        getJugadores()
            .then((data) => {
                if (active) setJugadores(data);
            })
            .catch((err) => console.error('Error al cargar jugadores:', err))
            .finally(() => {
                if (active) setCargando(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // 3. Filtrado local dinámico
    const filtrados = jugadores.filter((j) => {
        const coincideTexto = `${j.nombre} ${j.apellido}`
            .toLowerCase()
            .includes(textoBusqueda.toLowerCase());
        const coincidePosicion =
            posicionFiltro === 'TODAS' ||
            j.posicionPrincipal === posicionFiltro;
        return coincideTexto && coincidePosicion;
    });

    return (
        <div style={styles.cardContainer}>
            {/* Controles de filtro autónomos */}
            <div style={styles.filterRow}>
                <div style={{ flex: '2 1 250px' }}>
                    <label style={styles.label}>Buscar Nombre/Apellido:</label>
                    <input
                        type='text'
                        placeholder='Ej. Luis Mejía...'
                        value={textoBusqueda}
                        onChange={(e) => setTextoBusqueda(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={{ flex: '1 1 200px' }}>
                    <label style={styles.label}>Posición Principal:</label>
                    <select
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

            {/* Renderizado condicional */}
            {cargando ? (
                <div
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#64748b',
                    }}
                >
                    Cargando listado general de jugadores desde la API...
                </div>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.trHead}>
                                <th style={styles.th}>Jugador</th>
                                <th style={styles.th}>Posición</th>
                                <th style={styles.th}>Pie Hábil</th>
                                <th style={styles.th}>Club Actual</th>
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
                            {filtrados.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            color: '#94a3b8',
                                        }}
                                    >
                                        No se encontraron jugadores que
                                        coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filtrados.map((j) => {
                                    const clubObj =
                                        typeof j.clubActualId === 'object'
                                            ? (j.clubActualId as IClub)
                                            : null;
                                    const clubNombre = clubObj
                                        ? clubObj.nombre
                                        : (j as any).clubActual || 'Sin club';

                                    return (
                                        <tr key={j._id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <strong>
                                                    {j.nombre} {j.apellido}
                                                </strong>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.badge}>
                                                    {j.posicionPrincipal}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {j.pieHabil || 'N/D'}
                                            </td>
                                            <td style={styles.td}>
                                                {clubNombre}
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
                                                            `/jugadores/${j._id}`,
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
        flexWrap: 'wrap',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#1e293b', // Texto oscuro legible para la etiqueta
        marginBottom: '0.4rem',
        display: 'block',
    },
    // 🟢 INPUT DE BÚSQUEDA CORREGIDO
    searchInput: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff', // Fondo blanco limpio
        color: '#0f172a', // Texto digitado en azul/gris muy oscuro
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    // 🟢 SELECTOR CORREGIDO
    selectInput: {
        width: '100%',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: '#ffffff', // Fondo blanco limpio
        color: '#0f172a', // Texto visible
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    trHead: {
        backgroundColor: '#0f172a',
        color: '#ffffff',
        textAlign: 'left',
    },
    th: {
        padding: '0.85rem 1rem',
        fontSize: '0.85rem',
        fontWeight: '600',
    },
    tr: {
        borderBottom: '1px solid #e2e8f0',
    },
    td: {
        padding: '0.85rem 1rem',
        fontSize: '0.9rem',
        color: '#334155',
    },
    badge: {
        backgroundColor: '#f1f5f9',
        color: '#334155',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
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
