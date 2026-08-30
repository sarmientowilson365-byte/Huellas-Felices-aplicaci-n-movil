import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, QrCode, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VisitsScreen: React.FC = () => {
  const { visits, navigateTo, goBack } = useApp();

  return (
    <div id="visits-screen" className="pb-28 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
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
            <h1 className="text-xl font-bold text-[#263238] font-heading">Visitas Agendadas</h1>
            <p className="text-xs text-[#607D8B]">{visits.length} citas registradas</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('schedule_visit')}
          className="w-9 h-9 rounded-full bg-[#4CAF50] text-white flex items-center justify-center shadow-sm hover:bg-[#388E3C] transition-all"
          title="Agendar nueva visita"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {visits.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-2xs my-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#263238]">No tienes visitas agendadas</h3>
            <p className="text-xs text-[#607D8B] mt-1 max-w-xs mx-auto">
              Agenda una cita para visitar a las mascotas en el refugio y conocerlas en persona.
            </p>
          </div>
          <button
            onClick={() => navigateTo('schedule_visit')}
            className="px-5 py-3 rounded-xl bg-[#4CAF50] text-white font-bold text-xs shadow-md hover:bg-[#388E3C] transition-all"
          >
            Agendar Visita Ahora
          </button>
        </div>
      ) : (
        <div className="space-y-4 my-4">
          {visits.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl border border-slate-200 p-4.5 shadow-2xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={v.petImage}
                    alt={v.petName}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#263238]">{v.petName}</h4>
                    <p className="text-xs text-[#607D8B]">{v.shelterName}</p>
                  </div>
                </div>

                <span className="bg-[#4CAF50]/15 text-[#2E7D32] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  Confirmada
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-[#263238]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>{v.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-[#4CAF50]" />
                  <span>{v.time}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#607D8B] block">Código de Pase</span>
                  <span className="font-mono font-bold text-[#4CAF50]">{v.passCode}</span>
                </div>
                <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
