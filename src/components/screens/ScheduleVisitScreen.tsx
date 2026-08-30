import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Users,
  MessageSquare,
  CheckCircle2,
  QrCode,
  MapPin,
  Sparkles,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pet, ShelterVisit } from '../../types';

export const ScheduleVisitScreen: React.FC = () => {
  const { activePet, pets, user, addVisit, goBack, navigateTo } = useApp();

  const petToVisit: Pet = activePet || pets[0];

  // Calendar dates generation (next 10 days)
  const today = new Date();
  const availableDates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return {
      fullDate: d.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
      dayName: d.toLocaleDateString('es-EC', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('es-EC', { month: 'short' }),
    };
  });

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:30 PM',
    '04:00 PM',
    '05:15 PM',
  ];

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].fullDate);
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[1]);
  const [visitorName, setVisitorName] = useState<string>(user.name);
  const [phone, setPhone] = useState<string>(user.phone);
  const [visitorCount, setVisitorCount] = useState<number>(2);
  const [comments, setComments] = useState<string>('Deseamos conocer su comportamiento y cómo convive.');
  const [confirmedVisit, setConfirmedVisit] = useState<ShelterVisit | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit = addVisit({
      petId: petToVisit.id,
      petName: petToVisit.name,
      petImage: petToVisit.mainImage,
      shelterName: petToVisit.shelterName,
      date: selectedDate,
      time: selectedTime,
      visitorName,
      phone,
      visitorCount,
      comments,
    });
    setConfirmedVisit(newVisit);
  };

  return (
    <div id="schedule-visit-screen" className="pb-24 pt-2 px-4 bg-[#F8FAFC] text-[#263238] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 py-2">
        <button
          id="schedule-back-btn"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#263238] flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#263238] font-heading">Agendar Visita</h1>
          <p className="text-xs text-[#607D8B]">Conoce a tu futura mascota en persona</p>
        </div>
      </div>

      {confirmedVisit ? (
        /* Confirmation Pass Card */
        <div className="my-4 bg-white rounded-3xl border border-[#C8E6C9] p-6 shadow-lg text-center space-y-5 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center mx-auto ring-8 ring-[#E8F5E9]/50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="bg-[#4CAF50]/15 text-[#2E7D32] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Visita Confirmada
            </span>
            <h2 className="text-xl font-extrabold text-[#263238] mt-2 font-heading">
              ¡Tu cita está lista!
            </h2>
            <p className="text-xs text-[#607D8B] mt-1">
              Presenta este pase de acceso digital en la entrada del refugio.
            </p>
          </div>

          {/* Ticket Visual */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-300 text-left space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <img
                src={petToVisit.mainImage}
                alt={petToVisit.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm text-[#263238]">{petToVisit.name}</h4>
                <p className="text-xs text-[#607D8B]">{petToVisit.shelterName}</p>
                <span className="text-[10px] text-[#4CAF50] font-semibold">📍 {petToVisit.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-[#607D8B] font-medium block">Fecha</span>
                <span className="font-bold text-[#263238]">{confirmedVisit.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#607D8B] font-medium block">Hora</span>
                <span className="font-bold text-[#263238]">{confirmedVisit.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#607D8B] font-medium block">Titular</span>
                <span className="font-bold text-[#263238]">{confirmedVisit.visitorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#607D8B] font-medium block">Acompañantes</span>
                <span className="font-bold text-[#263238]">{confirmedVisit.visitorCount} personas</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#607D8B] block">Código de Pase</span>
                <span className="text-sm font-mono font-bold text-[#4CAF50]">{confirmedVisit.passCode}</span>
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              id="view-all-visits-btn"
              onClick={() => navigateTo('visits')}
              className="w-full py-3 rounded-xl bg-[#4CAF50] text-white font-bold text-xs shadow-md hover:bg-[#388E3C] transition-all"
            >
              Ver mis visitas agendadas
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="w-full py-2 text-xs text-[#607D8B] hover:text-[#263238] font-semibold"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleConfirm} className="space-y-5 my-3">
          {/* Target Pet Banner */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-2xs">
            <img
              src={petToVisit.mainImage}
              alt={petToVisit.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#263238]">{petToVisit.name}</h3>
                <span className="text-[10px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold">
                  {petToVisit.species}
                </span>
              </div>
              <p className="text-xs text-[#607D8B]">{petToVisit.breed}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">🏢 {petToVisit.shelterName}</p>
            </div>
          </div>

          {/* 1. Date Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#4CAF50]" />
              Seleccionar Fecha
            </label>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
              {availableDates.map((item) => {
                const isSelected = selectedDate === item.fullDate;
                return (
                  <button
                    key={item.fullDate}
                    type="button"
                    onClick={() => setSelectedDate(item.fullDate)}
                    className={`flex-shrink-0 w-16 py-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-md scale-105 font-bold'
                        : 'bg-white text-[#263238] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-white/80' : 'text-[#607D8B]'}`}>
                      {item.dayName}
                    </span>
                    <span className="text-base font-extrabold my-0.5">{item.dayNum}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#607D8B]'}`}>
                      {item.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Time Slot Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#607D8B] mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#4CAF50]" />
              Seleccionar Horario
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 text-center rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-xs'
                        : 'bg-white text-[#263238] border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Visitor Information Fields */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#607D8B]">Datos del Visitante</h3>

            <div>
              <label className="block text-xs font-bold text-[#263238] mb-1">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-bold text-[#263238] mb-1">Nº Visitantes</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                  <select
                    value={visitorCount}
                    onChange={(e) => setVisitorCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none"
                  >
                    <option value={1}>1 persona</option>
                    <option value={2}>2 personas</option>
                    <option value={3}>3 personas</option>
                    <option value={4}>4+ personas</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#263238] mb-1">Comentarios o preguntas</label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-[#607D8B] absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ej. Si iremos con niños o deseamos ver compatibilidad con otra mascota..."
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:border-[#4CAF50] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="confirm-visit-btn"
            className="w-full py-3.5 rounded-xl bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold text-sm shadow-md shadow-[#4CAF50]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar visita</span>
          </button>
        </form>
      )}
    </div>
  );
};
