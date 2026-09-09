import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, X, Send, ShieldCheck } from 'lucide-react';

const WHATSAPP_LINK = 'https://wa.me/message/GWFSILZHUOI3K1';

export const FloatingWhatsApp = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleSendOption = (optionText) => {
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(optionText)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const url = `${WHATSAPP_LINK}?text=${encodeURIComponent(customMsg)}`;
    window.open(url, '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Mini Chat Card */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-[#DFD5C4] w-80 sm:w-96 overflow-hidden mb-3 animate-fade-in">
          {/* Header */}
          <div className="bg-[#153A26] text-white p-4 flex items-center justify-between border-b border-[#C59A47]/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/assets/logo-emblem.jpg"
                  alt="Nayarit Real Estate"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C59A47]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-[#153A26]"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">
                  Nayarit Real Estate
                </h4>
                <p className="text-[11px] text-[#25D366] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#25D366]" />
                  +52 (311) 118-7229
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#FAF7F2] space-y-3 max-h-80 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl border border-[#DFD5C4] shadow-sm text-xs text-[#1A211D]">
              <p className="font-semibold text-[#0B1E14] mb-1">
                {lang === 'es' ? '¡Hola! ¿En qué podemos asesorarte hoy?' : 'Hello! How can we assist you today?'}
              </p>
              <p className="text-[#5C6B62]">
                {lang === 'es'
                  ? 'Selecciona una opción para escribirnos directamente a WhatsApp:'
                  : 'Choose an option to chat directly on WhatsApp:'}
              </p>
            </div>

            {/* Preset Options */}
            <div className="space-y-2">
              {[
                lang === 'es' ? '🏡 Información sobre propiedades e inversión en Nayarit' : '🏡 Info on properties & investment in Nayarit',
                lang === 'es' ? '📜 Asesoría sobre Fideicomisos para extranjeros' : '📜 Guidance on Bank Trusts for foreigners (Fideicomiso)',
                lang === 'es' ? '📊 Solicitud de avalúo inmobiliario o comercialización' : '📊 Request a certified appraisal or brokerage',
                lang === 'es' ? '⚖️ Consulta de certeza notarial y regularización' : '⚖️ Notarial title certainty inquiry',
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendOption(opt)}
                  className="w-full text-left p-3 rounded-2xl bg-white hover:bg-[#EFE7DA] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14] transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="truncate mr-2">{opt}</span>
                  <Send className="w-3 h-3 text-[#C59A47] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom message input */}
          <form onSubmit={handleSendCustom} className="p-3 bg-white border-t border-[#DFD5C4] flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={lang === 'es' ? 'Escribe tu mensaje en WhatsApp...' : 'Type your message for WhatsApp...'}
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#1A211D] focus:outline-none focus:ring-1 focus:ring-[#C59A47]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-colors shrink-0"
              title="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xl flex items-center justify-center relative transform hover:scale-110 transition-all border-2 border-white ring-4 ring-[#25D366]/30"
        aria-label="Abrir chat de WhatsApp"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <>
            <MessageSquare className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C59A47] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white animate-bounce">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
};
