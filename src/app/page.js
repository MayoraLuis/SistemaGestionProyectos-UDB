"use client";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Obtenemos todos los usuarios para comparar localmente
      // Esto evita errores de formato en la URL del JSON Server
      const response = await api.get('/usuarios');
      
      // 2. Buscamos el usuario exacto (ignorando espacios y mayúsculas en el correo)
      const userFound = response.data.find(u => 
        u.email.toLowerCase().trim() === email.toLowerCase().trim() && 
        u.password.toString().trim() === password.trim()
      );

      if (userFound) {
        login(userFound); // Función del AuthContext que guarda sesión y redirige
      } else {
        setError('Credenciales incorrectas. Verifica tus datos.');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('No se pudo conectar con el servidor (Puerto 4000).');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans text-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">UDB Projects</h1>
          <p className="mt-2 text-gray-500 text-sm">Inicia sesión para gestionar tus proyectos</p>
        </div>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-200 text-center text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
              placeholder="nombre@udb.edu.sv"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿Eres nuevo en el sistema?{' '}
            <button 
              type="button"
              onClick={() => router.push('/registro')} 
              className="font-semibold text-blue-600 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
          <p className="mt-4 text-[10px] text-gray-300 uppercase tracking-widest">
            UDB - Ciclo 01-2026
          </p>
        </div>
      </div>
    </main>
  );
}