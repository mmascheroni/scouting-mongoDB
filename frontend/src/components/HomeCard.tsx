import { useNavigate } from 'react-router-dom';

interface HomeCardProps {
    titulo: string;
    descripcion: string;
    icono: string;
    ruta: string;
    textoBoton: string;
}

export const HomeCard = ({
    titulo,
    descripcion,
    icono,
    ruta,
    textoBoton,
}: HomeCardProps) => {
    const navigate = useNavigate();

    return (
        <div style={styles.card}>
            <div style={styles.icon}>{icono}</div>
            <h3 style={styles.title}>{titulo}</h3>
            <p style={styles.description}>{descripcion}</p>
            <button style={styles.button} onClick={() => navigate(ruta)}>
                {textoBoton} →
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    icon: {
        fontSize: '3rem',
        marginBottom: '1rem',
    },
    title: {
        fontSize: '1.4rem',
        color: '#0f172a',
        margin: '0 0 0.5rem 0',
    },
    description: {
        color: '#64748b',
        fontSize: '0.95rem',
        lineHeight: '1.5',
        marginBottom: '1.5rem',
    },
    button: {
        backgroundColor: '#0284c7',
        color: '#ffffff',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: 'auto',
    },
};
