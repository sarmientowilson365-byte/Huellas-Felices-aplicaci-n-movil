import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, HelpCircle, ArrowRight, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import { AI_QUICK_PROMPTS } from '../../data/initialData';

export const AiAssistantModal: React.FC = () => {
  const { aiAssistantOpen, setAiAssistantOpen, user, pets, navigateTo } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `¡Hola ${user.name.split(' ')[0]}! 🐾 Soy **HuellasBot**, tu asesor de adopción y cuidados. ¿En qué te puedo orientar hoy? Puedo responderte sobre requisitos, ayudarte a buscar una mascota según tu hogar o explicarte el proceso de adopción.`,
      timestamp: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!aiAssistantOpen) return null;

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          context: {
            userName: user.name,
            petsCount: pets.length,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error de conexión');
      }

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Estoy aquí para ayudarte en tu proceso de adopción responsable.',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'En Huellas Felices, los pasos para adoptar son: 1) Explorar y elegir una mascota, 2) Enviar el formulario de preadopción, 3) Entrevista virtual, 4) Visita al refugio o domiciliaria, y 5) ¡Bienvenida a casa! 🐶✨ ¿Deseas ver las mascotas disponibles?',
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={() => setAiAssistantOpen(false)}
    >
      <div
        id="ai-assistant-modal-content"
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl h-[88vh] sm:h-[620px] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base leading-tight">HuellasBot IA</h3>
                <span className="bg-white/25 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> En línea
                </span>
              </div>
              <p className="text-xs text-white/90">Asistente de adopción y cuidados</p>
            </div>
          </div>

          <button
            id="close-ai-assistant-btn"
            onClick={() => setAiAssistantOpen(false)}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex-shrink-0 flex items-center justify-center mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#4CAF50] text-white rounded-br-none'
                      : 'bg-white text-[#263238] border border-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isUser ? 'text-white/70' : 'text-[#607D8B]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-[#263238] flex-shrink-0 flex items-center justify-center mt-1 text-[11px] font-bold">
                    M
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-[#607D8B]">
              <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#81C784] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#A5D6A7] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-[#607D8B] ml-1">Escribiendo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto no-scrollbar flex gap-1.5">
          {AI_QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt.query)}
              className="flex-shrink-0 text-[11px] bg-white border border-slate-200 hover:border-[#4CAF50] text-[#263238] hover:text-[#4CAF50] px-2.5 py-1 rounded-full transition-all whitespace-nowrap shadow-2xs"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            id="ai-assistant-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Pregúntale a HuellasBot..."
            className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs text-[#263238] px-3.5 py-2.5 rounded-full border border-slate-200 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#81C784]/20 outline-none transition-all"
          />
          <button
            id="send-ai-assistant-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !loading
                ? 'bg-[#4CAF50] hover:bg-[#388E3C] text-white shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
