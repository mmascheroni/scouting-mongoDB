import { Link, NavLink } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <Link to='/' style={styles.logoLink}>
                    ⚽ <span>ScoutingUy</span>
                </Link>
            </div>
            <ul style={styles.navLinks}>
                <li>
                    <NavLink
                        to='/'
                        style={({ isActive }) =>
                            isActive ? styles.activeLink : styles.link
                        }
                    >
                        Inicio
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/clubes'
                        style={({ isActive }) =>
                            isActive ? styles.activeLink : styles.link
                        }
                    >
                        Clubes
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to='/buscar'
                        style={({ isActive }) =>
                            isActive ? styles.activeLink : styles.link
                        }
                    >
                        Búsqueda de Jugadores
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/comparar' style={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Comparar jugadores
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: '1rem 2rem',
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    logoLink: {
        color: '#38bdf8',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    navLinks: {
        display: 'flex',
        listStyle: 'none',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
    },
    link: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontWeight: 500,
        transition: 'color 0.2s',
    },
    activeLink: {
        color: '#ffffff',
        textDecoration: 'none',
        fontWeight: 'bold',
        borderBottom: '2px solid #38bdf8',
        paddingBottom: '0.2rem',
    },
};
