import React from 'react';
import { X, Check, RotateCcw, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Species, AgeGroup, PetSize, EnergyLevel, PetGender } from '../../types';

export const FilterModal: React.FC = () => {
  const { pets, activeFilter, setFilter, resetFilters, filterModalOpen, setFilterModalOpen } = useApp();

  if (!filterModalOpen) return null;

  const speciesList: (Species | 'Todos')[] = ['Todos', 'Perro', 'Gato', 'Conejo', 'Ave'];
  const ageGroups: (AgeGroup | 'Todos')[] = ['Todos', 'Cachorro', 'Joven', 'Adulto', 'Senior'];
  const sizes: (PetSize | 'Todos')[] = ['Todos', 'Pequeño', 'Mediano', 'Grande'];
  const energies: (EnergyLevel | 'Todos')[] = ['Todos', 'Bajo', 'Medio', 'Alto'];
  const genders: (PetGender | 'Todos')[] = ['Todos', 'Macho', 'Hembra'];

  // Count matching pets preview
  const matchingCount = pets.filter((p) => {
    if (activeFilter.species && activeFilter.species !== 'Todos' && p.species !== activeFilter.species) return false;
    if (activeFilter.ageGroup && activeFilter.ageGroup !== 'Todos' && p.ageGroup !== activeFilter.ageGroup) return false;
    if (activeFilter.size && activeFilter.size !== 'Todos' && p.size !== activeFilter.size) return false;
    if (activeFilter.energyLevel && activeFilter.energyLevel !== 'Todos' && p.energyLevel !== activeFilter.energyLevel) return false;
    if (activeFilter.gender && activeFilter.gender !== 'Todos' && p.gender !== activeFilter.gender) return false;
    if (activeFilter.vaccinated !== null && activeFilter.vaccinated !== undefined && p.vaccinated !== activeFilter.vaccinated) return false;
    if (activeFilter.goodWithKids !== null && activeFilter.goodWithKids !== undefined && p.goodWithKids !== activeFilter.goodWithKids) return false;
    if (activeFilter.goodWithPets !== null && activeFilter.goodWithPets !== undefined && p.goodWithPets !== activeFilter.goodWithPets) return false;
    return true;
  }).length;

  return (
    <div
      id="filter-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={() => setFilterModalOpen(false)}
    >
      <div
        id="filter-modal-content"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center">
              <Filter className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#263238]">Filtrar Mascotas</h2>
          </div>
          <button
            id="close-filter-modal-btn"
            onClick={() => setFilterModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#607D8B] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 text-sm">
          {/* Especie */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2">
              Especie
            </label>
            <div className="flex flex-wrap gap-2">
              {speciesList.map((sp) => {
                const selected = (activeFilter.species || 'Todos') === sp;
                return (
                  <button
                    key={sp}
                    id={`filter-species-${sp}`}
                    onClick={() => setFilter({ species: sp })}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#4CAF50] text-white shadow-sm ring-2 ring-[#81C784]'
                        : 'bg-slate-100 text-[#263238] hover:bg-slate-200'
                    }`}
                  >
                    {sp === 'Perro' && '🐶 '}
                    {sp === 'Gato' && '🐱 '}
                    {sp === 'Conejo' && '🐰 '}
                    {sp === 'Ave' && '🦜 '}
                    {sp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edad */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2">
              Edad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ageGroups.map((age) => {
                const selected = (activeFilter.ageGroup || 'Todos') === age;
                return (
                  <button
                    key={age}
                    id={`filter-age-${age}`}
                    onClick={() => setFilter({ ageGroup: age })}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'bg-slate-100 text-[#263238] hover:bg-slate-200'
                    }`}
                  >
                    {age}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tamaño */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2">
              Tamaño
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((sz) => {
                const selected = (activeFilter.size || 'Todos') === sz;
                return (
                  <button
                    key={sz}
                    id={`filter-size-${sz}`}
                    onClick={() => setFilter({ size: sz })}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'bg-slate-100 text-[#263238] hover:bg-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nivel de Energía */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2">
              Nivel de Energía
            </label>
            <div className="grid grid-cols-4 gap-2">
              {energies.map((en) => {
                const selected = (activeFilter.energyLevel || 'Todos') === en;
                return (
                  <button
                    key={en}
                    id={`filter-energy-${en}`}
                    onClick={() => setFilter({ energyLevel: en })}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'bg-slate-100 text-[#263238] hover:bg-slate-200'
                    }`}
                  >
                    {en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2">
              Sexo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {genders.map((gen) => {
                const selected = (activeFilter.gender || 'Todos') === gen;
                return (
                  <button
                    key={gen}
                    id={`filter-gender-${gen}`}
                    onClick={() => setFilter({ gender: gen })}
                    className={`py-2 text-center rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#4CAF50] text-white font-semibold'
                        : 'bg-slate-100 text-[#263238] hover:bg-slate-200'
                    }`}
                  >
                    {gen}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requisitos y Convivencia */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B]">
              Compatibilidad y Salud
            </label>

            {/* Vacunado */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-xs font-medium text-[#263238]">💉 Vacunado al día</span>
              <div className="flex gap-1.5">
                <button
                  id="filter-vac-all"
                  onClick={() => setFilter({ vaccinated: null })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.vaccinated === null ? 'bg-[#263238] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Todos
                </button>
                <button
                  id="filter-vac-yes"
                  onClick={() => setFilter({ vaccinated: true })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.vaccinated === true ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Sí
                </button>
              </div>
            </div>

            {/* Compatible con niños */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-xs font-medium text-[#263238]">👶 Compatible con niños</span>
              <div className="flex gap-1.5">
                <button
                  id="filter-kids-all"
                  onClick={() => setFilter({ goodWithKids: null })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.goodWithKids === null ? 'bg-[#263238] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Todos
                </button>
                <button
                  id="filter-kids-yes"
                  onClick={() => setFilter({ goodWithKids: true })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.goodWithKids === true ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Sí
                </button>
              </div>
            </div>

            {/* Compatible con otros animales */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-xs font-medium text-[#263238]">🐾 Compatible con otros animales</span>
              <div className="flex gap-1.5">
                <button
                  id="filter-pets-all"
                  onClick={() => setFilter({ goodWithPets: null })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.goodWithPets === null ? 'bg-[#263238] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Todos
                </button>
                <button
                  id="filter-pets-yes"
                  onClick={() => setFilter({ goodWithPets: true })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg ${
                    activeFilter.goodWithPets === true ? 'bg-[#4CAF50] text-white' : 'bg-white text-[#607D8B]'
                  }`}
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          <button
            id="reset-filters-btn"
            onClick={resetFilters}
            className="px-4 py-3 rounded-xl border border-slate-200 text-[#607D8B] hover:text-[#263238] hover:bg-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar
          </button>

          <button
            id="apply-filters-btn"
            onClick={() => setFilterModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Aplicar Filtros ({matchingCount} {matchingCount === 1 ? 'mascota' : 'mascotas'})
          </button>
        </div>
      </div>
    </div>
  );
};
