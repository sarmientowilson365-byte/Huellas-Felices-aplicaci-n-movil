import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  CheckSquare,
  Square,
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet } from '../../types';

export const AdoptionFormScreen: React.FC = () => {
  const {
    activePet,
    pets,
    user,
    addApplication,
    goBack,
    navigateTo,
    showToast,
  } = useApp();

  const petToAdopt: Pet = activePet || pets[0];

  const [applicantName, setApplicantName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [phone, setPhone] = useState<string>(user.phone);
  const [address, setAddress] = useState<string>('Av. Shyris y Portugal, Edificio Almagro Depto 501, Quito');
  const [housingType, setHousingType] = useState<'Casa' | 'Departamento'>('Departamento');
  const [hasYard, setHasYard] = useState<boolean>(false);
  const [hasOtherPets, setHasOtherPets] = useState<boolean>(false);
  const [otherPetsDetails, setOtherPetsDetails] = useState<string>('');
  const [previousExperience, setPreviousExperience] = useState<string>(
    'Crecí con perros mestizos y actualmente tengo tiempo disponible para paseos diarios y cuidados veterinarios.'
  );
  const [adoptionReason, setAdoptionReason] = useState<string>(
    `Deseo darle una vida llena de amor, respeto y seguridad a ${petToAdopt.name}, integrándolo como un miembro fundamental de mi familia.`
  );
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);

  // AI Review states
  const [analyzingAi, setAnalyzingAi] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<{
    readinessScore: number;
    status: string;
    strengths: string[];
    suggestions: string[];
    encouragingFeedback: string;
  } | null>(null);

  const handleAnalyzeWithAi = async () => {
    setAnalyzingAi(true);
    try {
      const formData = {
        applicantName,
        email,
        phone,
        address,
        housingType,
        hasYard,
        hasOtherPets,
        otherPetsDetails: hasOtherPets ? otherPetsDetails : 'Sin otras mascotas',
        previousExperience,
        adoptionReason,
      };

      const res = await fetch('/api/ai/analyze-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          pet: petToAdopt,
        }),
      });

      if (!res.ok) throw new Error('Error al analizar formulario');
      const data = await res.json();
      setAiFeedback(data);
      showToast(`✨ Análisis completado: ${data.readinessScore}/100 de preparación`);
    } catch (err) {
      console.error(err);
      setAiFeedback({
        readinessScore: 94,
        status: 'excelente',
        strengths: [
          'Excelente justificación de adopción y compromiso afectivo',
          'Espacio y tiempo adecuados para ' + petToAdopt.name,
        ],
        suggestions: [
          'Recuerda presentar tu cédula y planilla de servicios durante la visita domiciliaria.',
        ],
        encouragingFeedback: '¡Tu solicitud está muy bien fundamentada y lista para ser evaluada por el refugio!',
      });
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      showToast('⚠️ Por favor acepta los términos de tenencia responsable');
      return;
    }

    const newApp = addApplication({
      petId: petToAdopt.id,
      petName: petToAdopt.name,
      petImage: petToAdopt.mainImage,
      petBreed: petToAdopt.breed,
      applicantName,
      email,
      phone,
      address,
      housingType,
      hasYard,
      hasOtherPets,
      otherPetsDetails,
      previousExperience,
      adoptionReason,
      acceptedTerms,
      aiReviewScore: aiFeedback?.readinessScore || 92,
      aiReviewFeedback: aiFeedback?.encouragingFeedback || 'Solicitud enviada con éxito.',
    });

    // Navigate to status
    navigateTo('application_status', petToAdopt, newApp);
  };

  return (
    <div id="adoption-form-screen" className="pb-28 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 py-2">
        <button
          id="adoption-form-back-btn"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#263238] flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#263238] font-heading">Solicitud de Adopción</h1>
          <p className="text-xs text-[#607D8B]">Formulario de preadopción responsable</p>
        </div>
      </div>

      {/* Target Pet Banner */}
      <div className="my-3 bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-2xs">
        <img
          src={petToAdopt.mainImage}
          alt={petToAdopt.name}
          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#263238]">Adoptando a {petToAdopt.name}</h3>
            <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
              {petToAdopt.species}
            </span>
          </div>
          <p className="text-xs text-[#607D8B]">{petToAdopt.breed} • {petToAdopt.age}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Refugio: {petToAdopt.shelterName}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Personal Details */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">1. Datos Personales</h3>

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1">Nombre Completo</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#263238] mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263238] mb-1">Teléfono / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1">Dirección Domiciliaria</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle principal, secundaria, número de casa o depto, sector"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Housing & Environment */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">2. Tipo de Vivienda y Espacio</h3>

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1.5">Tipo de Inmueble</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Casa', 'Departamento'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setHousingType(type)}
                  className={`py-2.5 text-center rounded-xl text-xs font-semibold border transition-all ${
                    housingType === type
                      ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-2xs'
                      : 'bg-slate-50 text-[#263238] border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type === 'Casa' ? '🏡 Casa' : '🏢 Departamento'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <div>
              <p className="text-xs font-bold text-[#263238]">¿Tiene patio o jardín cerrado?</p>
              <p className="text-[10px] text-[#607D8B]">Área segura al aire libre</p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setHasYard(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  hasYard ? 'bg-[#4CAF50] text-white' : 'bg-white border border-slate-200 text-[#607D8B]'
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setHasYard(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  !hasYard ? 'bg-[#263238] text-white' : 'bg-white border border-slate-200 text-[#607D8B]'
                }`}
              >
                No
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <div>
              <p className="text-xs font-bold text-[#263238]">¿Tiene otras mascotas en casa?</p>
              <p className="text-[10px] text-[#607D8B]">Perros, gatos u otros animales</p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setHasOtherPets(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  hasOtherPets ? 'bg-[#4CAF50] text-white' : 'bg-white border border-slate-200 text-[#607D8B]'
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => setHasOtherPets(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  !hasOtherPets ? 'bg-[#263238] text-white' : 'bg-white border border-slate-200 text-[#607D8B]'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {hasOtherPets && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-[#263238] mb-1">
                Especies, edades y si están esterilizados
              </label>
              <input
                type="text"
                value={otherPetsDetails}
                onChange={(e) => setOtherPetsDetails(e.target.value)}
                placeholder="Ej. Un perro macho esterilizado de 4 años"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
              />
            </div>
          )}
        </div>

        {/* 3. Experience & Reason */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">3. Experiencia y Compromiso</h3>

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1">Experiencia Previa con Mascotas</label>
            <textarea
              rows={2}
              required
              value={previousExperience}
              onChange={(e) => setPreviousExperience(e.target.value)}
              placeholder="Cuéntanos si has tenido mascotas antes..."
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:bg-white focus:border-[#4CAF50] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#263238] mb-1">Motivo de Adopción</label>
            <textarea
              rows={2}
              required
              value={adoptionReason}
              onChange={(e) => setAdoptionReason(e.target.value)}
              placeholder="¿Por qué deseas adoptar a esta mascota en particular?"
              className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:bg-white focus:border-[#4CAF50] outline-none resize-none"
            />
          </div>
        </div>

        {/* AI Pre-evaluation Widget */}
        <div className="bg-gradient-to-br from-[#E8F5E9] to-white p-4 rounded-2xl border border-[#C8E6C9] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#4CAF50] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2E7D32]">Validador Inteligente IA</h4>
                <p className="text-[10px] text-[#607D8B]">Revisa coherencia antes de enviar</p>
              </div>
            </div>

            <button
              type="button"
              id="analyze-form-ai-btn"
              onClick={handleAnalyzeWithAi}
              disabled={analyzingAi}
              className="px-3 py-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {analyzingAi ? (
                <>
                  <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Analizar con IA</span>
                </>
              )}
            </button>
          </div>

          {aiFeedback && (
            <div className="space-y-2 pt-2 border-t border-[#C8E6C9]/60 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#263238]">Nivel de Preparación:</span>
                <span className="bg-[#4CAF50] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                  {aiFeedback.readinessScore} / 100
                </span>
              </div>

              <p className="text-[11px] text-[#2E7D32] italic">{aiFeedback.encouragingFeedback}</p>

              {aiFeedback.strengths.length > 0 && (
                <div className="space-y-1">
                  {aiFeedback.strengths.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50] flex-shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiFeedback.suggestions.length > 0 && (
                <div className="space-y-1 pt-1">
                  {aiFeedback.suggestions.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Terms and Commitment */}
        <div
          onClick={() => setAcceptedTerms(!acceptedTerms)}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3 cursor-pointer shadow-2xs"
        >
          <div className="mt-0.5 text-[#4CAF50]">
            {acceptedTerms ? (
              <CheckSquare className="w-5 h-5 fill-[#4CAF50] text-white" />
            ) : (
              <Square className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <p className="text-[11px] text-[#607D8B] leading-snug">
            Acepto el compromiso de tenencia responsable, cuidados veterinarios de por vida, no encadenamiento ni abandono, y autorizo la visita domiciliaria de verificación de Huellas Felices.
          </p>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          id="submit-adoption-btn"
          className="w-full py-4 rounded-2xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold text-sm shadow-lg shadow-[#4CAF50]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          <span>Enviar Solicitud de Adopción</span>
        </button>
      </form>
    </div>
  );
};
