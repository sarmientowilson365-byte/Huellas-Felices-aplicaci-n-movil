import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Calendar,
  ClipboardList,
  Heart,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet, Species } from '../../types';

export const HomeScreen: React.FC = () => {
  const {
    user,
    pets,
    activeFilter,
    setFilter,
    setFilterModalOpen,
    setAiAssistantOpen,
    setAiRecommenderOpen,
    navigateTo,
    toggleFavorite,
    applications,
    showToast,
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [searchingAi, setSearchingAi] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);
  const [aiMatchedIds, setAiMatchedIds] = useState<string[] | null>(null);

  // Quick filter chips
  const quickFilters = [
    { label: 'Todos', species: 'Todos', icon: '🐾' },
    { label: 'Perros', species: 'Perro', icon: '🐶' },
    { label: 'Gatos', species: 'Gato', icon: '🐱' },
    { label: 'Otros', species: 'Otro', icon: '🐰' },
  ];

  const handleQuickFilter = (sp: string) => {
    setAiMatchedIds(null);
    setAiSearchSummary(null);
    if (sp === 'Todos') {
      setFilter({ species: 'Todos' });
    } else if (sp === 'Otro') {
      // Show rabbit or bird
      setFilter({ species: 'Conejo' });
    } else {
      setFilter({ species: sp as Species });
    }
  };

  const handleSmartSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setAiMatchedIds(null);
      setAiSearchSummary(null);
      setFilter({ searchQuery: '' });
      return;
    }

    setSearchingAi(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          availablePets: pets,
        }),
      });

      if (!res.ok) throw new Error('Error buscando con IA');
      const data = await res.json();
      setAiSearchSummary(data.interpretation);
      setAiMatchedIds(data.recommendedPetIds);
      showToast(`✨ Búsqueda inteligente: ${data.recommendedPetIds?.length || 0} coincidencias`);
    } catch (err) {
      console.error(err);
      // Fallback text search
      const lower = query.toLowerCase();
      const matched = pets.filter((p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.breed.toLowerCase().includes(lower) ||
        p.species.toLowerCase().includes(lower)
      );
      setAiMatchedIds(matched.map((p) => p.id));
      setAiSearchSummary(`Resultados para "${query}"`);
    } finally {
      setSearchingAi(false);
    }
  };

  // Filtered pet list
  const filteredPets = pets.filter((pet) => {
    if (aiMatchedIds !== null) {
      return aiMatchedIds.includes(pet.id);
    }
    if (activeFilter.species && activeFilter.species !== 'Todos' && pet.species !== activeFilter.species) {
      return false;
    }
    if (activeFilter.ageGroup && activeFilter.ageGroup !== 'Todos' && pet.ageGroup !== activeFilter.ageGroup) {
      return false;
    }
    if (activeFilter.size && activeFilter.size !== 'Todos' && pet.size !== activeFilter.size) {
      return false;
    }
    if (activeFilter.energyLevel && activeFilter.energyLevel !== 'Todos' && pet.energyLevel !== activeFilter.energyLevel) {
      return false;
    }
    return true;
  });

  const urgentPets = pets.filter((p) => p.urgentAdoption);

  return (
    <div id="home-screen" className="pb-24 pt-2 px-4 space-y-5 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Top Greeting Header */}
      <header className="flex items-start justify-between pt-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-[#607D8B] font-medium">Hola, {user.name.split(' ')[0]}</span>
            <span className="text-base animate-wave">👋</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight mt-0.5 font-heading">
            ¿Qué mascota buscas hoy?
          </h1>
        </div>

        <button
          id="home-profile-avatar-btn"
          onClick={() => navigateTo('profile')}
          className="relative w-11 h-11 rounded-full ring-2 ring-[#81C784]/40 overflow-hidden shadow-xs hover:scale-105 transition-transform"
        >
          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full ring-2 ring-white" />
        </button>
      </header>

      {/* Search Bar + Filter Trigger */}
      <div className="space-y-2">
        <form onSubmit={handleSmartSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#607D8B] absolute left-3.5 top-3.5" />
            <input
              id="home-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre, raza o 'perros tranquilos'..."
              className="w-full bg-white border border-slate-200 text-xs rounded-2xl pl-10 pr-9 py-3 text-[#263238] placeholder-slate-400 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#81C784]/20 outline-none shadow-2xs transition-all"
            />
            {searchingAi ? (
              <div className="absolute right-3 top-3 w-4 h-4 rounded-full border-2 border-[#4CAF50] border-t-transparent animate-spin" />
            ) : searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setAiMatchedIds(null);
                  setAiSearchSummary(null);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            ) : null}
          </div>

          <button
            type="button"
            id="open-filter-btn"
            onClick={() => setFilterModalOpen(true)}
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 hover:border-[#4CAF50] text-[#263238] hover:text-[#4CAF50] flex items-center justify-center shadow-2xs transition-all flex-shrink-0"
            title="Filtros avanzados"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </form>

        {aiSearchSummary && (
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-[#2E7D32] animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4CAF50] flex-shrink-0" />
              <span>{aiSearchSummary}</span>
            </div>
            <button
              onClick={() => {
                setAiMatchedIds(null);
                setAiSearchSummary(null);
                setSearchInput('');
              }}
              className="text-[11px] font-bold text-[#2E7D32] hover:underline ml-2"
            >
              Restablecer
            </button>
          </div>
        )}
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {quickFilters.map((q) => {
          const isSelected =
            (activeFilter.species || 'Todos') === q.species ||
            (q.species === 'Otro' && ['Conejo', 'Ave'].includes(activeFilter.species || ''));
          return (
            <button
              key={q.label}
              id={`quick-filter-${q.label}`}
              onClick={() => handleQuickFilter(q.species)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#4CAF50] text-white shadow-xs scale-102'
                  : 'bg-white border border-slate-200 text-[#263238] hover:bg-slate-50'
              }`}
            >
              <span>{q.icon}</span>
              <span>{q.label}</span>
            </button>
          );
        })}

        {/* AI Matchmaker trigger chip */}
        <button
          id="trigger-ai-recommender-chip"
          onClick={() => setAiRecommenderOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-gradient-to-r from-[#81C784] to-[#4CAF50] text-white shadow-xs hover:opacity-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFD54F]" />
          <span>Match con IA</span>
        </button>
      </div>

      {/* Quick Access Cards (Mascotas cercanas, Agendar visita, Mis solicitudes) */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          id="quick-card-explore"
          onClick={() => navigateTo('explore')}
          className="bg-white p-3 rounded-2xl border border-slate-200/90 text-left hover:border-[#4CAF50] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#263238] leading-tight">Mascotas cercanas</p>
            <p className="text-[10px] text-[#607D8B] mt-0.5">Quito y valles</p>
          </div>
        </button>

        <button
          id="quick-card-visit"
          onClick={() => navigateTo('schedule_visit')}
          className="bg-white p-3 rounded-2xl border border-slate-200/90 text-left hover:border-[#4CAF50] hover:shadow-xs transition-all group flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#263238] leading-tight">Agendar visita</p>
            <p className="text-[10px] text-[#607D8B] mt-0.5">Visita el refugio</p>
          </div>
        </button>

        <button
          id="quick-card-requests"
          onClick={() => {
            if (applications.length > 0) {
              navigateTo('application_status', null, applications[0]);
            } else {
              navigateTo('profile');
            }
          }}
          className="bg-white p-3 rounded-2xl border border-slate-200/90 text-left hover:border-[#4CAF50] hover:shadow-xs transition-all group flex flex-col justify-between relative"
        >
          {applications.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#4CAF50] rounded-full animate-ping" />
          )}
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#263238] leading-tight">Mis solicitudes</p>
            <p className="text-[10px] text-[#607D8B] mt-0.5">
              {applications.length > 0 ? `${applications.length} activa` : 'Ver estado'}
            </p>
          </div>
        </button>
      </div>

      {/* Featured Tinder Swipe Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4.5 shadow-md">
        <div className="relative z-10 max-w-[65%] space-y-1.5">
          <span className="bg-[#4CAF50] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Modo Swipe
          </span>
          <h3 className="font-bold text-base text-white leading-tight font-heading">
            Descubre deslizando
          </h3>
          <p className="text-xs text-slate-300">
            Haz match con tu mascota ideal como en las apps modernas.
          </p>
          <button
            id="home-start-swipe-btn"
            onClick={() => navigateTo('explore')}
            className="mt-2 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <span>Explorar tarjetas</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#4CAF50]" />
          </button>
        </div>

        <div className="absolute right-2 -bottom-2 w-32 h-36 opacity-90">
          <img
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
            alt="Perro amigable"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Urgent Adoption Section */}
      {urgentPets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF5350] animate-pulse" />
              <h2 className="text-base font-bold text-[#263238] font-heading">Adopción Urgente</h2>
            </div>
            <span className="text-xs text-[#EF5350] font-semibold">Requieren hogar pronto</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {urgentPets.map((pet) => {
              const isFav = user.savedFavorites.includes(pet.id);
              return (
                <div
                  key={pet.id}
                  id={`urgent-pet-${pet.id}`}
                  onClick={() => navigateTo('pet_detail', pet)}
                  className="bg-white rounded-2xl border border-rose-100 hover:border-rose-300 p-3 flex gap-3 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                >
                  <img
                    src={pet.mainImage}
                    alt={pet.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#263238]">{pet.name}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pet.id);
                          }}
                          className="text-[#607D8B] hover:text-rose-500 transition-colors p-1"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#607D8B]">{pet.breed} • {pet.age}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{pet.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-[#4CAF50] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Vacunado
                      </span>
                      <span className="text-slate-400">📍 {pet.distanceKm} km</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Mascotas Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#263238] font-heading">
              Mascotas Disponibles ({filteredPets.length})
            </h2>
            <p className="text-[11px] text-[#607D8B]">Encuentra a tu mejor amigo</p>
          </div>
          <button
            onClick={() => navigateTo('explore')}
            className="text-xs font-bold text-[#4CAF50] hover:underline flex items-center gap-1"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredPets.map((pet) => {
            const isFav = user.savedFavorites.includes(pet.id);
            return (
              <div
                key={pet.id}
                id={`pet-card-${pet.id}`}
                onClick={() => navigateTo('pet_detail', pet)}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#4CAF50] transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <img
                    src={pet.mainImage}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(pet.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#263238] px-2 py-0.5 rounded-full">
                    {pet.age}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#263238] truncate">{pet.name}</h3>
                    <span className="text-[10px] text-[#607D8B] font-medium">{pet.gender}</span>
                  </div>
                  <p className="text-[11px] text-[#607D8B] truncate mt-0.5">{pet.breed}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[9px] bg-slate-100 text-[#607D8B] px-1.5 py-0.5 rounded-md">
                      {pet.size}
                    </span>
                    <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.5 rounded-md">
                      ⚡ {pet.energyLevel}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-[#607D8B]">
                    <span className="truncate">📍 {pet.location.split(',')[0]}</span>
                    <span className="text-[#4CAF50] font-semibold group-hover:translate-x-0.5 transition-transform">
                      Ver →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating AI Helper quick bubble */}
      <button
        id="floating-ai-btn"
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-20 right-4 sm:right-auto sm:left-[calc(50%+140px)] z-40 bg-[#4CAF50] hover:bg-[#388E3C] text-white p-3 rounded-full shadow-lg shadow-[#4CAF50]/40 flex items-center gap-2 transition-all hover:scale-105"
        title="Consultar a HuellasBot"
      >
        <Bot className="w-5 h-5" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">HuellasBot</span>
      </button>
    </div>
  );
};
