import React, { useState } from 'react';
import { PawPrint, Mail, Lock, User, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { loginUser, navigateTo } = useApp();
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('maria.gomez@ejemplo.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [fullName, setFullName] = useState<string>('María Gómez');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email || 'maria.gomez@ejemplo.com');
  };

  const handleGoogleAuth = () => {
    loginUser('maria.gomez@gmail.com');
  };

  return (
    <div
      id="auth-screen"
      className="min-h-[640px] h-full flex flex-col justify-between bg-[#F8FAFC] p-6 text-[#263238]"
    >
      {/* Top Brand */}
      <div className="pt-2 text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center mx-auto shadow-md shadow-[#4CAF50]/20">
          <PawPrint className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#263238] font-heading">
          {isRegister ? 'Crear Cuenta' : 'Bienvenido de vuelta'}
        </h2>
        <p className="text-xs text-[#607D8B] max-w-xs mx-auto">
          {isRegister
            ? 'Regístrate para encontrar a tu compañero peludo y agendar visitas.'
            : 'Inicia sesión para gestionar tus adopciones y mascotas favoritas.'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="my-auto py-4">
        {/* Toggle Mode */}
        <div className="bg-slate-200/80 p-1 rounded-xl flex mb-5">
          <button
            type="button"
            id="tab-login-btn"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister ? 'bg-white text-[#263238] shadow-xs' : 'text-[#607D8B]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            id="tab-register-btn"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister ? 'bg-white text-[#263238] shadow-xs' : 'text-[#607D8B]'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[#263238] mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#607D8B] absolute left-3.5 top-3.5" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-10 pr-3.5 py-3 text-[#263238] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#81C784]/20 outline-none shadow-2xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#607D8B] absolute left-3.5 top-3.5" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-10 pr-3.5 py-3 text-[#263238] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#81C784]/20 outline-none shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#263238]">Contraseña</label>
              {!isRegister && (
                <button
                  type="button"
                  className="text-[11px] text-[#4CAF50] font-medium hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#607D8B] absolute left-3.5 top-3.5" />
              <input
                id="auth-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 text-xs rounded-xl pl-10 pr-3.5 py-3 text-[#263238] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#81C784]/20 outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3.5 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold text-sm shadow-md shadow-[#4CAF50]/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>{isRegister ? 'Registrarme' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#F8FAFC] px-2 text-[#607D8B] text-[11px]">o continúa con</span>
          </div>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          id="google-auth-btn"
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-[#263238] flex items-center justify-center gap-3 shadow-2xs transition-all hover:bg-slate-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continuar con Google</span>
        </button>
      </div>

      {/* Guest / Terms notice */}
      <div className="pt-2 text-center space-y-1">
        <p className="text-[11px] text-[#607D8B]">
          Al continuar aceptas nuestros términos de adopción responsable y privacidad de datos.
        </p>
        <button
          id="skip-auth-btn"
          onClick={() => navigateTo('home')}
          className="text-xs text-[#4CAF50] font-semibold hover:underline"
        >
          Saltar por ahora →
        </button>
      </div>
    </div>
  );
};
