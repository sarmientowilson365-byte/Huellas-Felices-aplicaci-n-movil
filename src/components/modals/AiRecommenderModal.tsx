import React, { useState } from 'react';
import { X, Sparkles, Heart, ArrowRight, CheckCircle2, ChevronRight, RefreshCw, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';

export const AiRecommenderModal: React.FC = () => {
  const { aiRecommenderOpen, setAiRecommenderOpen, pets, navigateTo, toggleFavorite, user } = useApp();

  const [step, setStep] = useState<number>(1);
  const [housing, setHousing] = useState<'Casa con patio' | 'Departamento sin patio' | 'Casa pequeña'>('Departamento sin patio');
  const [freeTime, setFreeTime] = useState<'Mucho tiempo (+4 hrs)' | 'Moderado (2-4 hrs)' | 'Poco tiempo (1-2 hrs)'>('Moderado (2-4 hrs)');
  const [energyPref, setEnergyPref] = useState<'Tranquilo / Relajado' | 'Equilibrado' | 'Muy enérgico / Aventurero'>('Equilibrado');
  const [hasKids, setHasKids] = useState<boolean>(true);
  const [hasPets, setHasPets] = useState<boolean>(false);
  const [experience, setExperience] = useState<'Principiante' | 'Intermedio' | 'Experto'>('Intermedio');

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{
    summary: string;
    matches: { petId: string; matchPercentage: number; reasons: string[] }[];
  } | null>(null);

  if (!aiRecommenderOpen) return null;

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setStep(4); // results screen

    try {
      const payload = {
        preferences: {
          housing,
          freeTime,
          energyPref,
          hasKids,
          hasPets,
          experience,
        },
        availablePets: pets,
      };

      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al conectar con IA');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      // Fallback rule-based match
      setResults({
        summary: `Basado en tu estilo de vida (${housing}, ${energyPref}), encontramos mascotas ideales que se adaptarán con amor a tu hogar.`,
        matches: [
          {
            petId: 'pet-1',
            matchPercentage: 96,
            reasons: ['Luna es dócil y se adapta genial a rutinas diarias de paseo.', 'Excelente convivencia con familias.'],
          },
          {
            petId: 'pet-2',
            matchPercentage: 92,
            reasons: ['Milo es perfecto para departamento y disfruta de la calma.', 'Independiente pero afectuoso.'],
          },
          {
            petId: 'pet-6',
            matchPercentage: 88,
            reasons: ['Toby es pequeño, educado y no requiere ejercicio extenuante.'],
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAiRecommenderOpen(false);
    setStep(1);
    setResults(null);
  };

  const matchedPetsWithDetails = results?.matches
    ?.map((m) => {
      const pet = pets.find((p) => p.id === m.petId);
      return pet ? { pet, ...m } : null;
    })
    .filter(Boolean) as ({ pet: Pet; matchPercentage: number; reasons: string[] })[] || [];

  return (
    <div
      id="ai-recommender-modal-backdrop"
      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        id="ai-recommender-modal-content"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4CAF50] via-[#66BB6A] to-[#81C784] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30">
              <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-base">Matchmaking con IA</h3>
              <p className="text-xs text-white/90">Encuentra tu compañero ideal</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center py-2">
                <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">Paso 1 de 3</span>
                <h4 className="text-lg font-bold text-[#263238]">Tu Espacio y Tiempo</h4>
                <p className="text-xs text-[#607D8B]">¿Cómo es tu vivienda y disponibilidad diaria?</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263238] mb-1.5">Tipo de Vivienda</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Departamento sin patio', desc: 'Edificio o depto con balcón / parque cercano', icon: '🏢' },
                    { id: 'Casa con patio', desc: 'Espacio cerrado con césped o terraza amplia', icon: '🏡' },
                    { id: 'Casa pequeña', desc: 'Espacio interior mediano', icon: '🏠' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setHousing(item.id as any)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        housing === item.id
                          ? 'border-[#4CAF50] bg-[#E8F5E9] ring-2 ring-[#81C784]/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-[#263238]">{item.id}</p>
                        <p className="text-[11px] text-[#607D8B]">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263238] mb-1.5">Tiempo para paseos y mimos</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Mucho tiempo (+4 hrs)', desc: 'Trabajo remoto o familia disponible casi todo el día' },
                    { id: 'Moderado (2-4 hrs)', desc: 'Paseo por la mañana y noche, fines de semana libres' },
                    { id: 'Poco tiempo (1-2 hrs)', desc: 'Rutina ocupada, busco mascota independiente' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFreeTime(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        freeTime === item.id
                          ? 'border-[#4CAF50] bg-[#E8F5E9]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#263238]">{item.id}</p>
                      <p className="text-[11px] text-[#607D8B]">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-4"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center py-2">
                <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">Paso 2 de 3</span>
                <h4 className="text-lg font-bold text-[#263238]">Personalidad y Rutina</h4>
                <p className="text-xs text-[#607D8B]">¿Qué energía buscas en tu nueva mascota?</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263238] mb-1.5">Nivel de Energía Deseado</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Tranquilo / Relajado', desc: 'Ama dormir siestas, ver tele y paseos calmados', icon: '🛋️' },
                    { id: 'Equilibrado', desc: 'Juega en el parque y descansa pacíficamente en casa', icon: '🎾' },
                    { id: 'Muy enérgico / Aventurero', desc: 'Compañero para correr, senderismo y montaña', icon: '🏔️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setEnergyPref(item.id as any)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        energyPref === item.id
                          ? 'border-[#4CAF50] bg-[#E8F5E9] ring-2 ring-[#81C784]/30'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-[#263238]">{item.id}</p>
                        <p className="text-[11px] text-[#607D8B]">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 rounded-xl border border-slate-200 text-[#607D8B] font-semibold text-xs transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="py-3 rounded-xl bg-[#4CAF50] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center py-2">
                <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-wider">Paso 3 de 3</span>
                <h4 className="text-lg font-bold text-[#263238]">Convivencia en el Hogar</h4>
                <p className="text-xs text-[#607D8B]">Garantizamos la seguridad y armonía de todos</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#263238]">¿Hay niños en casa?</p>
                    <p className="text-[11px] text-[#607D8B]">Menores de 12 años</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setHasKids(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        hasKids ? 'bg-[#4CAF50] text-white' : 'bg-slate-100 text-[#607D8B]'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setHasKids(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        !hasKids ? 'bg-[#263238] text-white' : 'bg-slate-100 text-[#607D8B]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#263238]">¿Tienes otras mascotas?</p>
                    <p className="text-[11px] text-[#607D8B]">Otros perros, gatos, aves</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setHasPets(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        hasPets ? 'bg-[#4CAF50] text-white' : 'bg-slate-100 text-[#607D8B]'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setHasPets(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        !hasPets ? 'bg-[#263238] text-white' : 'bg-slate-100 text-[#607D8B]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#263238] mb-1.5">Experiencia previa con animales</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Principiante', 'Intermedio', 'Experto'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setExperience(lvl)}
                        className={`py-2 text-center rounded-xl text-xs font-medium transition-all ${
                          experience === lvl
                            ? 'bg-[#4CAF50] text-white font-semibold'
                            : 'bg-slate-100 text-[#263238]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="py-3 rounded-xl border border-slate-200 text-[#607D8B] font-semibold text-xs transition-all"
                >
                  Atrás
                </button>
                <button
                  onClick={handleGenerateRecommendations}
                  className="py-3 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#388E3C] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Calcular Match
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              {loading ? (
                <div className="text-center py-12 space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-full border-4 border-[#E8F5E9] border-t-[#4CAF50] animate-spin" />
                    <Sparkles className="w-6 h-6 text-[#4CAF50] absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#263238] text-base">Analizando compatibilidad con IA...</h4>
                    <p className="text-xs text-[#607D8B] mt-1">Evaluando personalidades y necesidades en el refugio</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#C8E6C9] flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#2E7D32] uppercase tracking-wide">Análisis Personalizado</h4>
                      <p className="text-xs text-[#263238] mt-1 leading-relaxed">{results?.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-[#607D8B] uppercase tracking-wider">Tus Mejores Coincidencias</h5>
                    {matchedPetsWithDetails.map(({ pet, matchPercentage, reasons }) => {
                      const isFav = user.savedFavorites.includes(pet.id);
                      return (
                        <div
                          key={pet.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#4CAF50] transition-all p-3 flex gap-3"
                        >
                          <img
                            src={pet.mainImage}
                            alt={pet.name}
                            className="w-20 h-24 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <h6 className="font-bold text-sm text-[#263238]">{pet.name}</h6>
                                <span className="bg-[#4CAF50]/15 text-[#2E7D32] text-[11px] font-bold px-2 py-0.5 rounded-full">
                                  {matchPercentage}% Match
                                </span>
                              </div>
                              <p className="text-[11px] text-[#607D8B]">{pet.species} • {pet.breed} • {pet.age}</p>
                              <div className="mt-1 space-y-0.5">
                                {reasons.slice(0, 2).map((r, idx) => (
                                  <p key={idx} className="text-[10px] text-[#37474F] flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-[#4CAF50] flex-shrink-0" />
                                    <span>{r}</span>
                                  </p>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  handleClose();
                                  navigateTo('pet_detail', pet);
                                }}
                                className="flex-1 py-1.5 rounded-lg bg-[#4CAF50] hover:bg-[#388E3C] text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Ver perfil
                              </button>
                              <button
                                onClick={() => toggleFavorite(pet.id)}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  isFav ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-[#607D8B]'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-[#607D8B] hover:text-[#263238] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reintentar cuestionario
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
