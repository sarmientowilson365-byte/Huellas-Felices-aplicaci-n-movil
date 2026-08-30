import React from 'react';
import { Heart, Sparkles, ArrowRight, ShieldCheck, PawPrint } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div
      id="splash-screen"
      className="relative min-h-[640px] h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 text-white p-6"
    >
      {/* Background Pet Imagery with warm overlay */}
      <div className="absolute inset-0 z-0 opacity-45 mix-blend-luminosity pointer-events-none scale-105 transition-transform duration-1000">
        <img
          src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
          alt="Mascotas felices"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
      </div>

      {/* Top Brand Tag */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center">
            <PawPrint className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-white">Refugio & Rescate Animal</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#81C784] font-medium bg-[#4CAF50]/15 px-2.5 py-1 rounded-full border border-[#4CAF50]/30">
          <Sparkles className="w-3 h-3 text-[#FFD54F]" />
          <span>IA Asistida</span>
        </div>
      </div>

      {/* Center Branding / Hero */}
      <div className="relative z-10 my-auto py-8 text-center space-y-4">
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#4CAF50] to-[#81C784] flex items-center justify-center shadow-xl shadow-[#4CAF50]/30 ring-4 ring-white/10 mx-auto">
            <PawPrint className="w-13 h-13 text-white fill-white/20 stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#FF7043] flex items-center justify-center text-white shadow-md">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Huellas Felices
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xs mx-auto mt-2 font-normal leading-relaxed">
            Conecta de corazón con tu mascota ideal y gestiona una adopción rápida, segura y responsable.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50]" /> 100% Verificado
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> +850 Adopciones
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 pb-6 space-y-3">
        <button
          id="splash-start-btn"
          onClick={() => navigateTo('auth')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] hover:from-[#43A047] hover:to-[#4CAF50] text-white font-bold text-base shadow-lg shadow-[#4CAF50]/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]"
        >
          <span>Comenzar</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          id="splash-guest-btn"
          onClick={() => navigateTo('home')}
          className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition-colors"
        >
          Explorar como invitado
        </button>
      </div>
    </div>
  );
};
