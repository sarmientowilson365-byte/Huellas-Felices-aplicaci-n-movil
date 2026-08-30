import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Home,
  MessageCircle,
  Phone,
  Sparkles,
  ChevronRight,
  AlertCircle,
  FileText,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStage } from '../../types';

export const ApplicationStatusScreen: React.FC = () => {
  const {
    activeApplication,
    applications,
    updateApplicationStage,
    goBack,
    navigateTo,
    setAiAssistantOpen,
  } = useApp();

  const app = activeApplication || applications[0];

  if (!app) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-[#607D8B]">No tienes solicitudes de adopción registradas aún.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-[#4CAF50] text-white text-xs font-semibold rounded-xl"
        >
          Explorar Mascotas
        </button>
      </div>
    );
  }

  const stages: { stage: ApplicationStage; title: string; desc: string; icon: any }[] = [
    {
      stage: 'enviada',
      title: '1. Solicitud enviada',
      desc: 'Formulario recibido correctamente y registrado en la base de datos.',
      icon: FileText,
    },
    {
      stage: 'en_revision',
      title: '2. En revisión',
      desc: 'El comité del refugio evalúa la compatibilidad de vivienda y rutina.',
      icon: Clock,
    },
    {
      stage: 'entrevista',
      title: '3. Entrevista',
      desc: 'Conversación virtual o telefónica para coordinar detalles y resolver dudas.',
      icon: MessageCircle,
    },
    {
      stage: 'visita_domiciliaria',
      title: '4. Visita domiciliaria',
      desc: 'Inspección del entorno y cerramientos seguros para la mascota.',
      icon: Building,
    },
    {
      stage: 'aprobada',
      title: '5. ¡Aprobada y entrega!',
      desc: 'Firma de contrato de adopción y bienvenida de la mascota a tu familia.',
      icon: UserCheck,
    },
  ];

  const stageOrder: ApplicationStage[] = ['enviada', 'en_revision', 'entrevista', 'visita_domiciliaria', 'aprobada'];
  const currentStageIdx = stageOrder.indexOf(app.currentStage);

  return (
    <div id="application-status-screen" className="pb-28 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Top Header */}
      <div className="flex items-center gap-3 py-2">
        <button
          id="status-back-btn"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#263238] flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#263238] font-heading">Estado de Solicitud</h1>
          <p className="text-xs text-[#607D8B]">Seguimiento en tiempo real</p>
        </div>
      </div>

      {/* Pet Summary Card */}
      <div className="my-3 bg-white p-4 rounded-3xl border border-slate-200 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <img
            src={app.petImage}
            alt={app.petName}
            className="w-14 h-14 rounded-2xl object-cover"
          />
          <div>
            <span className="text-[10px] text-[#607D8B] font-semibold block uppercase">Candidato a adoptar</span>
            <h3 className="font-bold text-base text-[#263238]">{app.petName}</h3>
            <p className="text-xs text-[#607D8B]">{app.petBreed}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Fecha de inicio</span>
          <span className="text-xs font-bold text-[#263238]">{app.submittedDate}</span>
          <span className="mt-1 block text-[10px] font-bold text-[#4CAF50] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
            ID #{app.id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#263238] font-heading">Línea de Tiempo del Proceso</h3>
          <span className="text-xs font-bold text-[#4CAF50] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
            Etapa {currentStageIdx + 1} de 5
          </span>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {stages.map((item, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const isPending = idx > currentStageIdx;
            const Icon = item.icon;

            return (
              <div key={item.stage} className="relative group">
                {/* Timeline Dot Icon */}
                <div
                  className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#4CAF50] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#81C784] text-white ring-4 ring-[#E8F5E9] animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-[11px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#E8F5E9]/50 border-[#81C784] shadow-xs'
                      : isCompleted
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-white border-dashed border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-[#2E7D32]' : isCompleted ? 'text-[#263238]' : 'text-slate-500'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-white bg-[#4CAF50] px-2 py-0.5 rounded-full">
                        En curso
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-[#4CAF50]">
                        ✓ Completado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#607D8B] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Simulator Stage Selector */}
        <div className="pt-3 border-t border-slate-100 space-y-2 bg-slate-50 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#607D8B]">Simulador de Etapas (Demostración):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stageOrder.map((stg) => (
              <button
                key={stg}
                onClick={() => updateApplicationStage(app.id, stg)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  app.currentStage === stg
                    ? 'bg-[#4CAF50] text-white font-bold shadow-2xs'
                    : 'bg-white border border-slate-200 text-[#607D8B] hover:text-[#263238]'
                }`}
              >
                {stg === 'enviada' && '1. Enviada'}
                {stg === 'en_revision' && '2. Revisión'}
                {stg === 'entrevista' && '3. Entrevista'}
                {stg === 'visita_domiciliaria' && '4. Visita'}
                {stg === 'aprobada' && '5. Aprobada'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coordinator Contact & Assistant */}
      <div className="my-4 bg-white p-4 rounded-3xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#263238]">Asistencia de Adopción</h4>
              <p className="text-[10px] text-[#607D8B]">Coordinación Huellas Felices</p>
            </div>
          </div>

          <button
            onClick={() => setAiAssistantOpen(true)}
            className="text-xs font-bold text-[#4CAF50] hover:underline flex items-center gap-1"
          >
            Preguntar a HuellasBot →
          </button>
        </div>
      </div>
    </div>
  );
};
