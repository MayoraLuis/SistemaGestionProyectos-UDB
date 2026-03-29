"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importamos el hook
import api from '../../services/api';

export default function RegistroPage() {
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    password: '', 
    rol: 'usuario' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ESTA ES LA LÍNEA QUE FALTABA:
  const router = useRouter(); 

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email.endsWith('@udb.edu.sv')) {
      setError('Debes usar un correo institucional (@udb.edu.sv)');
      setLoading(false);
      return;
    }

    try {
      await api.post('/usuarios', {
        ...formData,
        id: Date.now().toString() 
      });
      
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      router.push('/'); // Ahora sí funcionará
    } catch (err) {
      setError("Hubo un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans text-black">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">Crear Cuenta</h1>
          <p className="mt-2 text-gray-500 text-sm">Regístrate en el sistema UDB Projects</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-200">
            <p className="text-center text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegistro} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Nombre Completo</label>
            <input 
              type="text" required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. Luis Mayora"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Correo Institucional</label>
            <input 
              type="email" required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="usuario@udb.edu.sv"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Contraseña</label>
            <input 
              type="password" required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Selecciona tu Rol</label>
            <select 
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-black focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              onChange={(e) => setFormData({...formData, rol: e.target.value})}
            >
              <option value="usuario">Usuario Estudiante</option>
              <option value="gerente">Gerente de Proyecto</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-400"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={() => router.push('/')} className="font-semibold text-blue-600 hover:underline">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}