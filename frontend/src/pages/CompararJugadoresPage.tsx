import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJugadores } from '../services/jugadorService';
import { getClubes } from '../services/clubService';
import type { IClub, IEstadisticaTemporada, IJugadorCompleto } from '../types/types';
import './CompararJugadoresPage.css';
import { formatearPorPartido, porPartido } from '../utils/estadisticas';
import { valorMasFavorable } from '../utils/comparacion';
import { formatearFechaNacimiento } from '../utils/fechas';
import { formatearPieHabil } from '../utils/jugadores';

const nombre = (jugador: IJugadorCompleto) => `${jugador.nombre} ${jugador.apellido}`;
const clubId = (jugador: IJugadorCompleto) => typeof jugador.clubActualId === 'string' ? jugador.clubActualId : jugador.clubActualId?._id;
type Grupo = Exclude<keyof IEstadisticaTemporada, '_id' | 'temporada' | 'competicion'>;
const metricas: [string, Grupo, string][] = [
    ['Partidos', 'generales', 'partidos'],
    ['Titularidades', 'generales', 'titularidades'],
    ['Minutos', 'generales', 'minutos'],
    ['Tarjetas amarillas', 'generales', 'tarjetasAmarillas'],
    ['Tarjetas rojas', 'generales', 'tarjetasRojas'],
    ['Goles', 'ofensivas', 'goles'],
    ['Asistencias', 'ofensivas', 'asistencias'],
    ['Goles esperados (xG)', 'ofensivas', 'xG'],
    ['Asistencias esperadas (xA)', 'ofensivas', 'xA'],
    ['Tiros al arco', 'ofensivas', 'tirosAlArco'],
    ['Pases completados', 'pase', 'pasesCompletados'],
    ['Pases clave', 'pase', 'pasesClave'],
    ['Intercepciones', 'defensivas', 'intercepciones'],
    ['Recuperaciones', 'defensivas', 'recuperaciones'],
    ['Entradas', 'defensivas', 'entradas'],
    ['Duelos ganados', 'defensivas', 'duelosGanados'],
    ['Atajadas', 'golero', 'atajadas'],
    ['Goles recibidos', 'golero', 'golesRecibidos'],
    ['Vallas invictas', 'golero', 'vallasInvictas'],
    ['Penales atajados', 'golero', 'penalesAtajados'],
    ['Errores que terminan en gol', 'golero', 'erroresQueTerminanEnGol'],
    ['Bloqueos', 'defensor', 'bloqueos'],
    ['Duelos aéreos ganados', 'defensor', 'duelosAereosGanados'],
    ['Regates completados', 'mediocampista', 'regatesCompletados'],
    ['Duelos ofensivos ganados', 'mediocampista', 'duelosOfensivosGanados'],
    ['Pases progresivos', 'mediocampista', 'pasesProgresivos'],
    ['Ocasiones creadas', 'mediocampista', 'ocasionesCreadas'],
    ['Duelos ofensivos ganados', 'delantero', 'duelosOfensivosGanados'],
    ['Regates completados', 'delantero', 'regatesCompletados'],
];

function total(temporadas: IEstadisticaTemporada[], grupo: Grupo, campo: string) {
    const valores = temporadas.map(t => {
        const datos = t[grupo];
        if (!datos || !(campo in datos)) return undefined;
        return (datos as unknown as Record<string, number>)[campo];
    });
    // Un dato ausente no equivale a cero ni a un total completo.
    if (!valores.length || valores.some(v => typeof v !== 'number')) return undefined;
    return valores.reduce<number>((suma, valor) => suma + (valor ?? 0), 0);
}

export function CompararJugadoresPage() {
    const [jugadores, setJugadores] = useState<IJugadorCompleto[]>([]);
    const [clubes, setClubes] = useState<IClub[]>([]);
    const [clubPrimero, setClubPrimero] = useState('');
    const [clubSegundo, setClubSegundo] = useState('');
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0);
    const [primeroId, setPrimeroId] = useState('');
    const [segundoId, setSegundoId] = useState('');
    const [periodo, setPeriodo] = useState('');

    useEffect(() => {
        let activo = true;
        Promise.all([getJugadores(), getClubes()]).then(([datos, catalogo]) => {
            if (activo) {
                setJugadores([...datos].sort((a, b) => nombre(a).localeCompare(nombre(b), 'es')));
                setClubes([...catalogo].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')));
            }
        }).catch(() => { if (activo) setError(true); })
            .finally(() => { if (activo) setCargando(false); });
        return () => { activo = false; };
    }, [intento]);

    const jugadoresPrimero = jugadores.filter(j => !clubPrimero || clubId(j) === clubPrimero);
    const primero = jugadoresPrimero.find(j => j._id === primeroId);
    const candidatos = primero ? jugadores.filter(j => j._id !== primero._id && j.posicionPrincipal === primero.posicionPrincipal && (!clubSegundo || clubId(j) === clubSegundo)) : [];
    const segundo = candidatos.find(j => j._id === segundoId);
    const periodos = primero && segundo ? primero.estadisticas_Temporadas
        .filter(t => segundo.estadisticas_Temporadas.some(s => s.temporada === t.temporada && s.competicion === t.competicion))
        .map(t => JSON.stringify([t.temporada, t.competicion]))
        .filter((valor, indice, todos) => todos.indexOf(valor) === indice)
        .sort((a, b) => Number(JSON.parse(b)[0]) - Number(JSON.parse(a)[0])) : [];
    const periodoActual = periodos.includes(periodo) ? periodo : (periodos[0] ?? '');
    const temporadas = (jugador: IJugadorCompleto) => jugador.estadisticas_Temporadas.filter(t => JSON.stringify([t.temporada, t.competicion]) === periodoActual);
    const formatear = (valor: number | undefined) => valor === undefined ? 'Sin datos' : valor.toLocaleString('es-UY', { maximumFractionDigits: 2 });

    return (
        <main className='comparar-page'>
            <h1>Comparar jugadores</h1>
            <p>Elegí dos jugadores de la misma posición principal para comparar sus datos y rendimiento.</p>
            {cargando ? <p role='status'>Cargando jugadores…</p> : error ? (
                <div role='alert'>No se pudieron cargar los jugadores. Comprobá que el backend esté funcionando.
                    <button onClick={() => { setCargando(true); setError(false); setIntento(i => i + 1); }}>Reintentar</button>
                </div>
            ) : jugadores.length === 0 ? <p>No hay jugadores registrados para comparar.</p> : <>
                <div className='comparar-selectores'>
                    <div className='comparar-selector-grupo'>
                    <label htmlFor='club-primero'>Club del primer jugador
                        <select id='club-primero' value={clubPrimero} onChange={e => { setClubPrimero(e.target.value); setPrimeroId(''); setSegundoId(''); setPeriodo(''); }}>
                            <option value=''>Todos los clubes</option>
                            {clubes.map(club => <option key={club._id} value={club._id}>{club.nombre}</option>)}
                        </select>
                    </label>
                    <label htmlFor='jugador-primero'>Primer jugador
                        <select id='jugador-primero' disabled={jugadoresPrimero.length === 0} value={primeroId} onChange={e => { setPrimeroId(e.target.value); setSegundoId(''); setPeriodo(''); }}>
                            <option value=''>{jugadoresPrimero.length === 0 ? 'No hay jugadores en este club' : 'Seleccioná un jugador'}</option>
                            {jugadoresPrimero.map(j => <option key={j._id} value={j._id}>{nombre(j)} · {j.posicionPrincipal}</option>)}
                        </select>
                    </label>
                    </div>
                    <div className='comparar-selector-grupo'>
                    <label htmlFor='club-segundo'>Club del segundo jugador
                        <select id='club-segundo' value={clubSegundo} onChange={e => { setClubSegundo(e.target.value); setSegundoId(''); setPeriodo(''); }}>
                            <option value=''>Todos los clubes</option>
                            {clubes.map(club => <option key={club._id} value={club._id}>{club.nombre}</option>)}
                        </select>
                    </label>
                    <label htmlFor='jugador-segundo'>Segundo jugador{primero ? ` · ${primero.posicionPrincipal}` : ''}
                        <select id='jugador-segundo' disabled={!primero || candidatos.length === 0} value={segundoId} onChange={e => { setSegundoId(e.target.value); setPeriodo(''); }}>
                            <option value=''>{!primero ? 'Elegí primero un jugador' : candidatos.length === 0 ? 'No hay jugadores para estos filtros' : 'Seleccioná otro jugador'}</option>
                            {candidatos.map(j => <option key={j._id} value={j._id}>{nombre(j)}</option>)}
                        </select>
                    </label>
                    </div>
                </div>
                {primero && candidatos.length === 0 && <p role='status'>No hay otro jugador con posición principal {primero.posicionPrincipal} en el club seleccionado. Probá con otro club o con “Todos los clubes”.</p>}
                {primero && segundo && <section aria-label='Comparación de jugadores'>
                    <div className='comparar-tabla'><table>
                        <caption>Datos personales</caption>
                        <thead><tr><th scope='col'>Dato</th>{[primero, segundo].map(j => <th scope='col' key={j._id}><Link to={`/jugadores/${j._id}`}>{nombre(j)}</Link></th>)}</tr></thead>
                        <tbody>{[
                            ['Posición principal', primero.posicionPrincipal, segundo.posicionPrincipal],
                            ['Nacionalidad', primero.nacionalidad, segundo.nacionalidad],
                            ['Fecha de nacimiento', formatearFechaNacimiento(primero.fechaNacimiento), formatearFechaNacimiento(segundo.fechaNacimiento)],
                            ['Altura (cm)', primero.altura, segundo.altura],
                            ['Pie hábil', formatearPieHabil(primero.pieHabil), formatearPieHabil(segundo.pieHabil)],
                        ].map(([etiqueta, a, b]) => <tr key={etiqueta}><th scope='row'>{etiqueta}</th><td>{a ?? 'Sin datos'}</td><td>{b ?? 'Sin datos'}</td></tr>)}</tbody>
                    </table></div>
                    {periodos.length === 0 ? <p>No hay estadísticas de una misma temporada y competición para ambos jugadores.</p> : <>
                        <label className='comparar-periodo' htmlFor='comparar-temporada'>Temporada y competición
                            <select id='comparar-temporada' value={periodoActual} onChange={e => setPeriodo(e.target.value)}>
                                {periodos.map(p => <option key={p} value={p}>{JSON.parse(p).join(' · ')}</option>)}
                            </select>
                        </label>
                        <p className='comparar-leyenda'>Verde: valor más favorable. Más es mejor, salvo tarjetas, goles recibidos y errores, donde menos es mejor. Empates y datos faltantes no se resaltan.</p>
                        <div className='comparar-tabla'><table>
                            <caption>Estadísticas de la misma temporada y competición</caption>
                            <thead><tr><th scope='col'>Estadística</th><th scope='col'>{nombre(primero)}</th><th scope='col'>{nombre(segundo)}</th></tr></thead>
                            <tbody>{metricas.map(([etiqueta, grupo, campo]) => {
                                const a = total(temporadas(primero), grupo, campo);
                                const b = total(temporadas(segundo), grupo, campo);
                                if (a === undefined && b === undefined) return null;
                                const esDuelo = campo.startsWith('duelos');
                                const partidosA = total(temporadas(primero), 'generales', 'partidos');
                                const partidosB = total(temporadas(segundo), 'generales', 'partidos');
                                const menorEsMejor = ['tarjetasAmarillas', 'tarjetasRojas', 'golesRecibidos', 'erroresQueTerminanEnGol'].includes(campo);
                                const favorable = valorMasFavorable(esDuelo ? porPartido(a, partidosA) : a, esDuelo ? porPartido(b, partidosB) : b, menorEsMejor);
                                return <tr key={`${grupo}-${campo}`}>
                                    <th scope='row'>{etiqueta}{esDuelo ? ' xP (por partido)' : ''}</th>
                                    <td className={favorable === 'primero' ? 'comparar-favorable' : undefined}>
                                        {esDuelo ? formatearPorPartido(a, partidosA) : formatear(a)}
                                    </td>
                                    <td className={favorable === 'segundo' ? 'comparar-favorable' : undefined}>
                                        {esDuelo ? formatearPorPartido(b, partidosB) : formatear(b)}
                                    </td>
                                </tr>;
                            })}</tbody>
                        </table></div>
                    </>}
                </section>}
            </>}
        </main>
    );
}
