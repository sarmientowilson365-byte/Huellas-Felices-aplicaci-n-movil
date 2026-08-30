import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Home,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Sparkles,
  Award,
  AlertCircle,
  Clock,
  Phone,
  Activity,
  Bot
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';

export const PetDetailScreen: React.FC = () => {
  const {
    activePet,
    goBack,
    navigateTo,
    toggleFavorite,
    user,
    showToast,
    setAiAssistantOpen,
  } = useApp();

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [aiCompatibility, setAiCompatibility] = useState<string | null>(null);
  const [checkingAi, setCheckingAi] = useState<boolean>(false);

  if (!activePet) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-[#607D8B]">No se seleccionó ninguna mascota.</p>
        <button
          onClick={goBack}
          className="px-4 py-2 bg-[#4CAF50] text-white text-xs font-semibold rounded-xl"
        >
          Volver
        </button>
      </div>
    );
  }

  const isFav = user.savedFavorites.includes(activePet.id);
  const gallery = activePet.gallery && activePet.gallery.length > 0 ? activePet.gallery : [activePet.mainImage];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopta a ${activePet.name} en Huellas Felices`,
        text: `Conoce a ${activePet.name} (${activePet.species}, ${activePet.age}) en el refugio Huellas Felices.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('🔗 Enlace de adopción copiado al portapapeles');
    }
  };

  const handleCheckAiCompatibility = async () => {
    setCheckingAi(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `¿Qué tipo de familia o tutor es el más compatible para adoptar a ${activePet.name}? (${activePet.species}, ${activePet.breed}, ${activePet.age}, energía ${activePet.energyLevel}, tamaño ${activePet.size}, personalidad: ${activePet.personality.join(', ')})`,
          context: { userName: user.name },
        }),
      });

      if (!res.ok) throw new Error('Error de compatibilidad');
      const data = await res.json();
      setAiCompatibility(data.reply);
    } catch (err) {
      setAiCompatibility(
        `${activePet.name} es ideal para personas que buscan un compañero ${activePet.personality[0]?.toLowerCase() || 'cariñoso'} con paseos regulares y espacios seguros.`
      );
    } finally {
      setCheckingAi(false);
    }
  };

  return (
    <div id="pet-detail-screen" className="pb-28 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Top Media Gallery & Navigation Overlay */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden">
        <img
          src={gallery[selectedPhotoIndex] || activePet.mainImage}
          alt={activePet.name}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top Gradient */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

        {/* Header Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            id="pet-detail-back-btn"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-[#263238] flex items-center justify-center shadow-md transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              id="pet-detail-share-btn"
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-[#263238] flex items-center justify-center shadow-md transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              id="pet-detail-favorite-btn"
              onClick={() => toggleFavorite(activePet.id)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-all ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 hover:bg-white text-[#263238]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {gallery.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedPhotoIndex === idx ? 'border-[#4CAF50] scale-105' : 'border-transparent opacity-70'
                }`}
              >
                <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Details Body */}
      <div className="px-5 pt-5 space-y-6">
        {/* Title, Breed, Location */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263238] font-heading">
              {activePet.name}
            </h1>
            <span className="bg-[#4CAF50]/15 text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Disponible
            </span>
          </div>

          <p className="text-sm text-[#607D8B] font-medium mt-0.5">
            {activePet.breed} • {activePet.gender}
          </p>

          <div className="flex items-center gap-1 text-xs text-[#607D8B] mt-2">
            <MapPin className="w-3.5 h-3.5 text-[#4CAF50]" />
            <span>{activePet.location}</span>
            <span className="text-slate-300 mx-1">•</span>
            <span className="text-[#263238] font-medium">{activePet.shelterName}</span>
          </div>
        </div>

        {/* Characteristic Stats Grid (Edad, Peso, Tamaño, Color) */}
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[10px] text-[#607D8B] uppercase font-bold">Edad</span>
            <span className="block text-xs font-bold text-[#263238] mt-1">{activePet.age}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[10px] text-[#607D8B] uppercase font-bold">Peso</span>
            <span className="block text-xs font-bold text-[#263238] mt-1">{activePet.weight}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[10px] text-[#607D8B] uppercase font-bold">Tamaño</span>
            <span className="block text-xs font-bold text-[#263238] mt-1">{activePet.size}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[10px] text-[#607D8B] uppercase font-bold">Color</span>
            <span className="block text-xs font-bold text-[#263238] mt-1 truncate">{activePet.color}</span>
          </div>
        </div>

        {/* Health & Medical Status Badges (Vacunas, Esterilizado) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">Salud & Cuidados Veterinarios</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              {activePet.vaccinated ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-400" />
              )}
              <span className="font-semibold text-[#263238]">
                {activePet.vaccinated ? 'Vacunas al día' : 'En proceso de vacunas'}
              </span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              {activePet.sterilized ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-400" />
              )}
              <span className="font-semibold text-[#263238]">
                {activePet.sterilized ? 'Esterilizado/a' : 'Pendiente esterilización'}
              </span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              {activePet.goodWithKids ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-semibold text-[#263238]">
                {activePet.goodWithKids ? 'Apto con niños' : 'Adultos recomendados'}
              </span>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              {activePet.goodWithPets ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <span className="font-semibold text-[#263238]">
                {activePet.goodWithPets ? 'Sociable con mascotas' : 'Hogar sin otras mascotas'}
              </span>
            </div>
          </div>
        </div>

        {/* Nivel de Energía */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">Nivel de Energía</span>
            <span className="text-xs font-bold text-[#4CAF50]">⚡ {activePet.energyLevel}</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#4CAF50] h-full rounded-full transition-all"
              style={{
                width: activePet.energyLevel === 'Bajo' ? '33%' : activePet.energyLevel === 'Medio' ? '66%' : '100%',
              }}
            />
          </div>
          <p className="text-[11px] text-[#607D8B]">
            {activePet.energyLevel === 'Bajo' && 'Prefiere descansar, juegos ligeros y paseos cortos.'}
            {activePet.energyLevel === 'Medio' && 'Disfruta caminatas diarias de 30-45 min y ratos de juego.'}
            {activePet.energyLevel === 'Alto' && 'Requiere ejercicio activo diario, correr y estimulación mental.'}
          </p>
        </div>

        {/* Personalidad Tags */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">Personalidad</h3>
          <div className="flex flex-wrap gap-2">
            {activePet.personality.map((tag, idx) => (
              <span
                key={idx}
                className="bg-white border border-slate-200 text-[#263238] font-medium text-xs px-3 py-1.5 rounded-xl shadow-2xs"
              >
                ✨ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Historia del Rescate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">Historia del Rescate</h3>
          <p className="text-xs text-[#263238] leading-relaxed font-normal">
            {activePet.rescueStory}
          </p>
        </div>

        {/* AI Compatibility Advisor Pill */}
        <div className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]/40 p-4 rounded-2xl border border-[#C8E6C9] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#4CAF50]" />
              <span className="text-xs font-bold text-[#2E7D32]">Asesor de Compatibilidad IA</span>
            </div>
            {!aiCompatibility && (
              <button
                id="check-ai-compat-btn"
                onClick={handleCheckAiCompatibility}
                disabled={checkingAi}
                className="text-[11px] font-bold text-[#4CAF50] bg-white px-2.5 py-1 rounded-lg shadow-2xs hover:bg-[#4CAF50] hover:text-white transition-colors"
              >
                {checkingAi ? 'Analizando...' : '¿Es ideal para mí?'}
              </button>
            )}
          </div>
          {aiCompatibility && (
            <p className="text-xs text-[#263238] leading-relaxed animate-fade-in">
              {aiCompatibility}
            </p>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Buttons: (❤️ Favorito, 📅 Agendar visita, 🏡 Solicitar adopción) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 z-40 shadow-xl flex items-center gap-2">
        <button
          id="pet-detail-schedule-btn"
          onClick={() => navigateTo('schedule_visit', activePet)}
          className="flex-1 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#263238] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Agendar visita</span>
        </button>

        <button
          id="pet-detail-adopt-btn"
          onClick={() => navigateTo('adoption_form', activePet)}
          className="flex-1 py-3 px-3 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#4CAF50]/20 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Solicitar adopción</span>
        </button>
      </div>
    </div>
  );
};
