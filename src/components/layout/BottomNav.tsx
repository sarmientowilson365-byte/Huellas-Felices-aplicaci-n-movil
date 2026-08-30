import React from 'react';
import { Home, Compass, Heart, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppScreen } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, user, applications } = useApp();

  const navItems = [
    { id: 'home' as AppScreen, label: 'Inicio', icon: Home },
    { id: 'explore' as AppScreen, label: 'Explorar', icon: Compass, badge: 'Swipe' },
    { id: 'favorites' as AppScreen, label: 'Favoritos', icon: Heart, count: user.savedFavorites.length },
    { id: 'visits' as AppScreen, label: 'Visitas', icon: Calendar },
    { id: 'profile' as AppScreen, label: 'Perfil', icon: User, dot: applications.some(a => a.currentStage === 'entrevista' || a.currentStage === 'aprobada') },
  ];

  // Only display on main tab screens
  const mainScreens: AppScreen[] = ['home', 'explore', 'favorites', 'visits', 'profile'];
  if (!mainScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 z-40 shadow-lg rounded-t-2xl"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => navigateTo(item.id)}
              className={`relative flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#4CAF50] font-semibold scale-105'
                  : 'text-[#607D8B] hover:text-[#263238]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span
                    id={`badge-${item.id}`}
                    className="absolute -top-1.5 -right-2.5 bg-[#EF5350] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight shadow-sm"
                  >
                    {item.count}
                  </span>
                )}
                {item.dot && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#4CAF50] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
