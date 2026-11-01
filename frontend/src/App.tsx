import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ClubesPage } from './pages/ClubesPage';
import { PlantillaClubPage } from './pages/PlantillaClubPage';
import { JugadorDetallePage } from './pages/JugadorDetallePage';
import { BusquedaScoutingPage } from './pages/BusquedaScoutingPage';

export default function App() {
    return (
        <BrowserRouter>
            <div
                style={{
                    backgroundColor: '#f8fafc',
                    minHeight: '100vh',
                    fontFamily: 'sans-serif',
                }}
            >
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/clubes' element={<ClubesPage />} />
                    <Route path='/clubes/:id' element={<PlantillaClubPage />} />
                    <Route
                        path='/jugadores/:id'
                        element={<JugadorDetallePage />}
                    />
                    <Route path='/buscar' element={<BusquedaScoutingPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
