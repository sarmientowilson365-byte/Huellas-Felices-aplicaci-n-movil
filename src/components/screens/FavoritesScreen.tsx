import React from 'react';
import { Heart, Trash2, Calendar, Home, ArrowLeft, Sparkles, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FavoritesScreen: React.FC = () => {
  const { pets, user, toggleFavorite, navigateTo, goBack } = useApp();

  const favoritePets = pets.filter((p) => user.savedFavorites.includes(p.id));

  return (
    <div id="favorites-screen" className="pb-28 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#263238] flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#263238] font-heading">Mis Favoritos</h1>
            <p className="text-xs text-[#607D8B]">{favoritePets.length} mascotas guardadas</p>
          </div>
        </div>
      </div>

      {favoritePets.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-2xs my-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#263238]">Aún no tienes favoritos</h3>
            <p className="text-xs text-[#607D8B] mt-1 max-w-xs mx-auto">
              Explora las mascotas disponibles y presiona el corazón ❤️ para guardarlas aquí.
            </p>
          </div>
          <button
            id="fav-explore-btn"
            onClick={() => navigateTo('explore')}
            className="px-5 py-3 rounded-xl bg-[#4CAF50] text-white font-bold text-xs shadow-md hover:bg-[#388E3C] transition-all"
          >
            Explorar Mascotas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
          {favoritePets.map((pet) => (
            <div
              key={pet.id}
              id={`fav-pet-${pet.id}`}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#4CAF50] transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => navigateTo('pet_detail', pet)}
                className="relative aspect-16/10 w-full overflow-hidden cursor-pointer"
              >
                <img
                  src={pet.mainImage}
                  alt={pet.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pet.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-rose-500 flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <Heart className="w-4 h-4 fill-rose-500" />
                </button>
                <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {pet.age} • {pet.size}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div
                  onClick={() => navigateTo('pet_detail', pet)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-[#263238]">{pet.name}</h3>
                    <span className="text-xs text-[#607D8B] font-medium">{pet.gender}</span>
                  </div>
                  <p className="text-xs text-[#607D8B]">{pet.breed}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#607D8B] mt-1">
                    <MapPin className="w-3 h-3 text-[#4CAF50]" />
                    <span>{pet.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('schedule_visit', pet)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#263238] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Visitar</span>
                  </button>
                  <button
                    onClick={() => navigateTo('adoption_form', pet)}
                    className="flex-1 py-2 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Adoptar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
