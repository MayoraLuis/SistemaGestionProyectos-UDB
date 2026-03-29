"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [tareas, setTareas] = useState([]); // Estado para todas las tareas
  const [showModal, setShowModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '', progreso: 0 });
  const [nuevaTarea, setNuevaTarea] = useState({ nombre: '', proyectoId: null });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      cargarDatos();
    }
  }, [isAuthenticated, router]);

  const cargarDatos = async () => {
    try {
      const [resProyectos, resTareas] = await Promise.all([
        api.get('/proyectos'),
        api.get('/tareas')
      ]);
      setProyectos(resProyectos.data);
      setTareas(resTareas.data);
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  // --- Lógica de Proyectos ---
  const handleSubmitProyecto = async (e) => {
    e.preventDefault();
    try {
      await api.post('/proyectos', nuevoProyecto);
      setShowModal(false);
      setNuevoProyecto({ nombre: '', descripcion: '', progreso: 0 });
      cargarDatos();
    } catch (error) {
      alert("Error al crear proyecto");
    }
  };

  const eliminarProyecto = async (id) => {
    if (window.confirm("¿Eliminar proyecto y sus tareas?")) {
      await api.delete(`/proyectos/${id}`);
      cargarDatos();
    }
  };

  // --- Lógica de TAREAS ---
  const agregarTarea = async (proyectoId) => {
    if (!nuevaTarea.nombre) return;
    try {
      await api.post('/tareas', { 
        nombre: nuevaTarea.nombre, 
        proyectoId: proyectoId, 
        completada: false 
      });
      setNuevaTarea({ nombre: '', proyectoId: null });
      cargarDatos();
    } catch (error) {
      alert("Error al agregar tarea");
    }
  };

  const alternarTarea = async (tarea) => {
    try {
      await api.patch(`/tareas/${tarea.id}`, { completada: !tarea.completada });
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar tarea");
    }
  };

  if (!user) return <p className="text-black p-8 text-center">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans pb-10">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b mb-6">
        <h1 className="font-bold text-xl text-blue-700">UDB Projects</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
            {user.nombre} ({user.rol})
          </span>
          <button onClick={logout} className="text-red-500 text-sm font-medium">Salir</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
          {user.rol === 'gerente' && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow-md">
              + Nuevo Proyecto
            </button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {proyectos.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{p.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1">{p.descripcion}</p>
                </div>
                {user.rol === 'gerente' && (
                  <button onClick={() => eliminarProyecto(p.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* SECCIÓN DE TAREAS [cite: 27, 33] */}
              <div className="mt-4 flex-grow">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">Tareas Asignadas</h4>
                <ul className="space-y-2 mb-4">
                  {tareas.filter(t => t.proyectoId === p.id).map(tarea => (
                    <li key={tarea.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <input 
                        type="checkbox" 
                        checked={tarea.completada} 
                        onChange={() => alternarTarea(tarea)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className={`text-sm ${tarea.completada ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {tarea.nombre}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Agregar Tarea (Solo Gerente)  */}
                {user.rol === 'gerente' && (
                  <div className="flex gap-2 mt-4">
                    <input 
                      type="text" 
                      placeholder="Nueva tarea..."
                      className="flex-1 text-xs border rounded-lg p-2 bg-white outline-none focus:border-blue-500"
                      value={nuevaTarea.proyectoId === p.id ? nuevaTarea.nombre : ''}
                      onChange={(e) => setNuevaTarea({ nombre: e.target.value, proyectoId: p.id })}
                    />
                    <button 
                      onClick={() => agregarTarea(p.id)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-200"
                    >
                      Añadir
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Proyecto (Solo Gerente) [cite: 28] */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Nuevo Proyecto</h2>
              <form onSubmit={handleSubmitProyecto} className="space-y-4">
                <input type="text" placeholder="Nombre" required className="w-full border rounded-xl p-3 bg-white"
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})} />
                <textarea placeholder="Descripción" required className="w-full border rounded-xl p-3 bg-white h-24"
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})} />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-medium">Cancelar</button>
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Crear</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}