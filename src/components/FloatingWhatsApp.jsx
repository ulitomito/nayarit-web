import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Send, ShieldCheck } from 'lucide-react';

const WHATSAPP_PHONE = '523111187229';

export const FloatingWhatsApp = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const getWhatsAppUrl = (text) => {
    const cleanText = text?.trim() || '';
    if (!cleanText) {
      return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
    }
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(cleanText)}`;
  };

  const options = [
    {
      id: 'properties',
      icon: '🏡',
      label: lang === 'es'
        ? 'Información sobre propiedades e inversión en Nayarit'
        : 'Info on properties & investment in Nayarit',
      template: lang === 'es'
        ? '¡Hola Nayarit Real Estate! Me gustaría recibir información sobre propiedades disponibles y oportunidades de inversión en Nayarit.'
        : 'Hello Nayarit Real Estate! I would like to receive information about available properties and investment opportunities in Nayarit.',
    },
    {
      id: 'fideicomiso',
      icon: '📜',
      label: lang === 'es'
        ? 'Asesoría sobre Fideicomisos para extranjeros'
        : 'Guidance on Bank Trusts for foreigners (Fideicomiso)',
      template: lang === 'es'
        ? '¡Hola Nayarit Real Estate! Solicito asesoría legal sobre el trámite de Fideicomiso Bancario para extranjeros en Zona Restringida de Nayarit.'
        : 'Hello Nayarit Real Estate! I need legal guidance regarding Mexican Bank Trusts (Fideicomisos) for foreign buyers in Nayarit.',
    },
    {
      id: 'appraisal',
      icon: '📊',
      label: lang === 'es'
        ? 'Solicitud de avalúo inmobiliario o comercialización'
        : 'Request a certified appraisal or brokerage',
      template: lang === 'es'
        ? '¡Hola Nayarit Real Estate! Deseo solicitar un avalúo comercial certificado o asesoría para comercializar mi propiedad en Nayarit.'
        : 'Hello Nayarit Real Estate! I would like to request a certified property appraisal or brokerage advisory in Nayarit.',
    },
    {
      id: 'legal',
      icon: '⚖️',
      label: lang === 'es'
        ? 'Consulta de certeza notarial y regularización'
        : 'Notarial title certainty inquiry',
      template: lang === 'es'
        ? '¡Hola Nayarit Real Estate! Necesito una consulta jurídica sobre certeza notarial, libertad de gravámenes y regularización de títulos.'
        : 'Hello Nayarit Real Estate! I need legal advice regarding notarial certainty, title verification, and liens in Nayarit.',
    },
  ];

  const handleSelectOption = (template) => {
    setCustomMsg(template);
    const url = getWhatsAppUrl(template);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    const messageToSend = customMsg.trim() || (lang === 'es'
      ? '¡Hola Nayarit Real Estate! Me gustaría ponerme en contacto con un asesor inmobiliario.'
      : 'Hello Nayarit Real Estate! I would like to get in touch with a real estate advisor.');
    const url = getWhatsAppUrl(messageToSend);
    window.open(url, '_blank');
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Natural Docked Chat Box (Facebook Messenger style) */}
      {isOpen ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#DFD5C4] w-[calc(100vw-2rem)] sm:w-96 max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header - Facebook / WhatsApp style */}
          <div className="bg-[#153A26] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#C59A47]/40">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="/assets/logo-emblem.jpg"
                  alt="Nayarit Real Estate"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#C59A47]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] rounded-full border-2 border-[#153A26]"></span>
              </div>
              <div className="leading-tight">
                <h4 className="font-serif font-bold text-sm text-white">
                  Nayarit Real Estate
                </h4>
                <p className="text-[11px] text-[#25D366] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
                  {lang === 'es' ? 'En línea • +52 311 118 7229' : 'Online • +52 311 118 7229'}
                </p>
              </div>
            </div>
            {/* Header close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label={lang === 'es' ? 'Cerrar chat' : 'Close chat'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3.5 bg-[#FAF7F2] space-y-3 max-h-[380px] overflow-y-auto">
            {/* Agent Welcome Message Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C59A47] shrink-0 mt-0.5">
                <img src="/assets/logo-emblem.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-[#DFD5C4] shadow-sm text-xs text-[#1A211D] max-w-[88%]">
                <p className="font-bold text-[#0B1E14] mb-1">
                  {lang === 'es' ? '¡Hola! Bienvenido a Nayarit Real Estate 👋' : 'Hello! Welcome to Nayarit Real Estate 👋'}
                </p>
                <p className="text-[#5C6B62] leading-relaxed">
                  {lang === 'es'
                    ? '¿En qué podemos asesorarte hoy? Selecciona una opción o escribe tu mensaje:'
                    : 'How can we assist you today? Choose an option or type your message:'}
                </p>
              </div>
            </div>

            {/* Quick Reply Option Chips */}
            <div className="space-y-1.5 pl-9">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.template)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#F2EBE0] border border-[#DFD5C4] text-xs font-semibold text-[#0B1E14] transition-all flex items-center justify-between group shadow-sm hover:border-[#C59A47]/60 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mr-2 overflow-hidden">
                    <span className="text-base shrink-0">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-[#C59A47] group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input Bar - Clean Messenger Dock */}
          <form onSubmit={handleSendCustom} className="p-2.5 bg-white border-t border-[#DFD5C4] flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={lang === 'es' ? 'Escribe un mensaje para WhatsApp...' : 'Type a message for WhatsApp...'}
              className="flex-1 px-3.5 py-2 rounded-full bg-[#FAF7F2] border border-[#DFD5C4] text-xs text-[#1A211D] placeholder:text-[#5C6B62]/70 focus:outline-none focus:ring-1 focus:ring-[#C59A47] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center transition-colors shrink-0 shadow-sm cursor-pointer"
              title={lang === 'es' ? 'Enviar a WhatsApp' : 'Send to WhatsApp'}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Button Trigger (Shown only when chat is closed) */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xl flex items-center justify-center relative transform hover:scale-110 transition-all border-2 border-white ring-4 ring-[#25D366]/30 cursor-pointer"
          aria-label={lang === 'es' ? 'Abrir chat de WhatsApp' : 'Open WhatsApp chat'}
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C59A47] rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white animate-bounce">
            1
          </span>
        </button>
      )}
    </div>
  );
};

