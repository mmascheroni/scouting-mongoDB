import { useState } from 'react';
import { ListadoGeneralTabla } from '../components/busqueda/ListadoGeneralTabla';
import { RankingScoutingTabla } from '../components/busqueda/RankingScoutingTabla';
import { TrayectoriaCardsGrid } from '../components/busqueda/TrayectoriaCardsGrid';

export const BusquedaScoutingPage = () => {
    const [modo, setModo] = useState<'general' | 'scouting' | 'trayectoria'>(
        'scouting',
    );

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1.5rem',
                boxSizing: 'border-box',
            }}
        >
            <header style={{ marginBottom: '1.5rem' }}>
                <h1
                    style={{
                        fontSize: '1.8rem',
                        color: '#0f172a',
                        margin: '0 0 0.5rem 0',
                    }}
                >
                    🔍 Búsqueda, Rankings & Trayectorias
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                    Exploración de prospectos, rankings por posición y
                    trayectoria NoSQL de clubes.
                </p>
            </header>

            {/* PESTAÑAS NATIVAS */}
            <div style={styles.tabContainer} role='tablist'>
                <button
                    type='button'
                    style={{
                        ...styles.tabBtn,
                        ...(modo === 'general'
                            ? styles.tabBtnActive
                            : styles.tabBtnInactive),
                    }}
                    onClick={() => setModo('general')}
                >
                    📋 Listado General
                </button>
                <button
                    type='button'
                    style={{
                        ...styles.tabBtn,
                        ...(modo === 'scouting'
                            ? styles.tabBtnActive
                            : styles.tabBtnInactive),
                    }}
                    onClick={() => setModo('scouting')}
                >
                    🔥 Ranking por Posición
                </button>
                <button
                    type='button'
                    style={{
                        ...styles.tabBtn,
                        ...(modo === 'trayectoria'
                            ? styles.tabBtnActive
                            : styles.tabBtnInactive),
                    }}
                    onClick={() => setModo('trayectoria')}
                >
                    🏟️ Histórico de Trayectorias
                </button>
            </div>

            {/* COMPONENTES INDEPENDIENTES */}
            {modo === 'general' && <ListadoGeneralTabla />}
            {modo === 'scouting' && <RankingScoutingTabla />}
            {modo === 'trayectoria' && <TrayectoriaCardsGrid />}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    tabContainer: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem',
        flexWrap: 'wrap',
    },
    tabBtn: {
        border: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0.6rem 1.2rem',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
    },
    tabBtnInactive: {
        backgroundColor: '#f1f5f9',
        color: '#475569',
    },
    tabBtnActive: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
    },
};
