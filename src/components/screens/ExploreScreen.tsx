import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import {
  Heart,
  X,
  Eye,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';

export const ExploreScreen: React.FC = () => {
  const {
    pets,
    user,
    likePet,
    passPet,
    resetSwipes,
    setFilterModalOpen,
    navigateTo,
    activeFilter,
  } = useApp();

  // Filter available pets excluding passed ones unless list is empty
  const activeDeck = pets.filter((pet) => {
    // If filter applied
    if (activeFilter.species && activeFilter.species !== 'Todos' && pet.species !== activeFilter.species) return false;
    if (activeFilter.size && activeFilter.size !== 'Todos' && pet.size !== activeFilter.size) return false;
    if (activeFilter.energyLevel && activeFilter.energyLevel !== 'Todos' && pet.energyLevel !== activeFilter.energyLevel) return false;
    // Don't show already passed pets if there are remaining ones
    return !user.passedPets.includes(pet.id);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentPet = activeDeck[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentPet) return;
    setSwipeDirection(direction);

    setTimeout(() => {
      if (direction === 'right') {
        likePet(currentPet.id);
      } else {
        passPet(currentPet.id);
      }
      setSwipeDirection(null);
      // Index advances automatically since activeDeck re-evaluates or we cycle
      if (currentIndex >= activeDeck.length - 1) {
        setCurrentIndex(0);
      }
    }, 200);
  };

  return (
    <div id="explore-screen" className="pb-24 pt-2 px-4 flex flex-col justify-between min-h-[640px] h-full text-[#263238]">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold text-[#263238] font-heading">Explorar Mascotas</h1>
          <p className="text-xs text-[#607D8B]">Desliza a la derecha para guardar ❤️</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="explore-filter-btn"
            onClick={() => setFilterModalOpen(true)}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-[#4CAF50] text-[#263238] hover:text-[#4CAF50] flex items-center justify-center shadow-2xs transition-all"
            title="Filtros"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tinder Card Deck Area */}
      <div className="relative flex-1 my-2 flex items-center justify-center">
        {currentPet ? (
          <div className="relative w-full max-w-sm h-[480px]">
            {/* Card Beneath (Preview of next pet) */}
            {activeDeck[currentIndex + 1] && (
              <div className="absolute inset-0 scale-95 translate-y-3 rounded-3xl bg-white border border-slate-200 overflow-hidden opacity-60 shadow-md pointer-events-none transition-all">
                <img
                  src={activeDeck[currentIndex + 1].mainImage}
                  alt="Siguiente mascota"
                  className="w-full h-full object-cover filter blur-[1px]"
                />
              </div>
            )}

            {/* Active Swipe Card */}
            <motion.div
              key={currentPet.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                rotate: swipeDirection === 'right' ? 15 : swipeDirection === 'left' ? -15 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                  handleSwipe('right');
                } else if (info.offset.x < -100) {
                  handleSwipe('left');
                }
              }}
              className="absolute inset-0 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
            >
              {/* Big Photo Container */}
              <div className="relative flex-1 w-full bg-slate-900 overflow-hidden">
                <img
                  src={currentPet.mainImage}
                  alt={currentPet.name}
                  className="w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Badges on photo */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {currentPet.species}
                  </span>
                  {currentPet.vaccinated && (
                    <span className="bg-[#4CAF50]/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Vacunado
                    </span>
                  )}
                </div>

                {/* Card Text Information (Luna, 2 años, Mediana, Muy cariñosa, 📍 Quito) */}
                <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight font-heading">
                      {currentPet.name}
                    </h2>
                    <span className="text-base text-slate-200 font-semibold">{currentPet.age}</span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium">
                    {currentPet.breed} • {currentPet.size}
                  </p>

                  <p className="text-xs text-white/95 font-medium bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-xl inline-block">
                    ✨ "{currentPet.personality[0] || 'Muy cariñosa'}"
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-300 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#81C784]" />
                    <span>{currentPet.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Details Bar */}
              <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-[#607D8B]">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-[#263238] font-medium px-2 py-0.5 rounded-md text-[11px]">
                    Peso: {currentPet.weight}
                  </span>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] font-medium px-2 py-0.5 rounded-md text-[11px]">
                    ⚡ {currentPet.energyLevel}
                  </span>
                </div>

                <button
                  id="explore-view-details-btn"
                  onClick={() => navigateTo('pet_detail', currentPet)}
                  className="text-xs font-bold text-[#4CAF50] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver perfil completo
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Empty Deck State */
          <div className="text-center py-12 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#263238]">¡Has explorado todas las mascotas!</h3>
              <p className="text-xs text-[#607D8B] mt-1">
                Puedes revisar tus mascotas guardadas en Favoritos o reiniciar el catálogo para verlas de nuevo.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                id="reset-swipes-btn"
                onClick={resetSwipes}
                className="w-full py-3 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar Explorador
              </button>
              <button
                onClick={() => navigateTo('favorites')}
                className="w-full py-2.5 text-xs text-[#607D8B] hover:text-[#263238] font-semibold"
              >
                Ir a Favoritos ({user.savedFavorites.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Buttons (👎 Omitir, 👀 Ver detalles, ❤️ Guardar, 🔄 Rebobinar) */}
      <div className="flex items-center justify-center gap-5 pt-2 pb-1">
        {/* Rebobinar / Reset */}
        <button
          id="swipe-rewind-btn"
          onClick={resetSwipes}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-amber-500 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Rebobinar"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* 👎 Omitir (Pass) */}
        <button
          id="swipe-pass-btn"
          onClick={() => handleSwipe('left')}
          disabled={!currentPet}
          className="w-16 h-16 rounded-full bg-white border border-slate-200 text-[#EF5350] hover:bg-rose-50 hover:border-rose-300 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          title="Omitir"
        >
          <X className="w-8 h-8 stroke-[2.5]" />
        </button>

        {/* 👀 Ver detalles */}
        <button
          id="swipe-details-btn"
          onClick={() => currentPet && navigateTo('pet_detail', currentPet)}
          disabled={!currentPet}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 text-blue-500 hover:bg-blue-50 hover:border-blue-300 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          title="Ver detalles"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* ❤️ Guardar (Like) */}
        <button
          id="swipe-like-btn"
          onClick={() => handleSwipe('right')}
          disabled={!currentPet}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#4CAF50] to-[#81C784] text-white flex items-center justify-center shadow-xl shadow-[#4CAF50]/30 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          title="Guardar / Me gusta"
        >
          <Heart className="w-8 h-8 fill-white stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
