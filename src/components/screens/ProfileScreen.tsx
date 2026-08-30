import React from 'react';
import {
  User,
  Heart,
  Calendar,
  ClipboardList,
  Gift,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Bot,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    logoutUser,
    navigateTo,
    applications,
    visits,
    setAiAssistantOpen,
    showToast,
  } = useApp();

  return (
    <div id="profile-screen" className="pb-28 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs text-center space-y-3 mt-2">
        <div className="relative inline-block mx-auto">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#81C784]/30 shadow-md mx-auto"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#4CAF50] text-white flex items-center justify-center ring-2 ring-white text-xs">
            ✓
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#263238] font-heading">{user.name}</h2>
          <p className="text-xs text-[#607D8B]">{user.email}</p>
          <span className="inline-flex items-center gap-1 mt-1 bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-bold px-3 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Adoptante Verificado
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigateTo('favorites')}
            className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="block text-base font-extrabold text-[#263238]">
              {user.savedFavorites.length}
            </span>
            <span className="block text-[10px] text-[#607D8B] font-medium">Favoritos</span>
          </button>

          <button
            onClick={() => {
              if (applications.length > 0) {
                navigateTo('application_status', null, applications[0]);
              } else {
                showToast('No tienes solicitudes activas');
              }
            }}
            className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="block text-base font-extrabold text-[#4CAF50]">
              {applications.length}
            </span>
            <span className="block text-[10px] text-[#607D8B] font-medium">Solicitudes</span>
          </button>

          <button
            onClick={() => navigateTo('visits')}
            className="p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="block text-base font-extrabold text-blue-600">
              {visits.length}
            </span>
            <span className="block text-[10px] text-[#607D8B] font-medium">Visitas</span>
          </button>
        </div>
      </div>

      {/* Menu Action List */}
      <div className="my-4 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B] px-1">
          Gestión y Actividad
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
          <button
            id="profile-menu-applications"
            onClick={() => {
              if (applications.length > 0) {
                navigateTo('application_status', null, applications[0]);
              } else {
                showToast('No tienes solicitudes de adopción aún');
              }
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#263238]">Mis Solicitudes de Adopción</p>
                <p className="text-[10px] text-[#607D8B]">Revisa el avance de tu expediente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {applications.length > 0 && (
                <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
                  {applications[0].currentStage.replace('_', ' ')}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          <button
            id="profile-menu-favorites"
            onClick={() => navigateTo('favorites')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#263238]">Mascotas Guardadas</p>
                <p className="text-[10px] text-[#607D8B]">{user.savedFavorites.length} mascotas en lista</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            id="profile-menu-visits"
            onClick={() => navigateTo('visits')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#263238]">Historial de Visitas al Refugio</p>
                <p className="text-[10px] text-[#607D8B]">Citas agendadas y pases de acceso</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            id="profile-menu-ai-bot"
            onClick={() => setAiAssistantOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#263238]">HuellasBot (Asistente IA)</p>
                <p className="text-[10px] text-[#607D8B]">Consejos de cuidado, dudas y guía</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            id="profile-menu-donations"
            onClick={() => showToast('❤️ ¡Gracias por apoyar al refugio con donaciones de alimento y medicamentos!')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#263238]">Donaciones & Apadrinamiento</p>
                <p className="text-[10px] text-[#607D8B]">Ayuda a mantener a más rescatados</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Logout / Switch */}
      <div className="pt-2">
        <button
          id="profile-logout-btn"
          onClick={logoutUser}
          className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-[#EF5350] hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
