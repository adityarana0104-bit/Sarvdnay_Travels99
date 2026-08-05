import React from 'react';
import { Compass, Palmtree, Church, Building2, Heart, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ServicesSectionProps {
  lang: Language;
  onOpenInquiry: (vehicleId?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ lang, onOpenInquiry }) => {
  const t = translations[lang];

  const services = [
    {
      icon: <Church className="w-8 h-8 text-orange-500" />,
      title: t.service1Title,
      desc: t.service1Desc,
      bg: 'bg-orange-50',
    },
    {
      icon: <Palmtree className="w-8 h-8 text-emerald-600" />,
      title: t.service2Title,
      desc: t.service2Desc,
      bg: 'bg-emerald-50',
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      title: t.service3Title,
      desc: t.service3Desc,
      bg: 'bg-rose-50',
    },
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: t.service4Title,
      desc: t.service4Desc,
      bg: 'bg-blue-50',
    },
  ];

  return (
    <section className="py-20 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-300 font-bold text-xs tracking-wider uppercase bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
            विशेष सेवा
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight drop-shadow-md">
            {t.servicesTitle}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full shadow-lg" />
          <p className="text-blue-100/80 text-sm sm:text-base mt-3 font-normal">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 hover:border-white/40 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-5 shadow-inner border border-white/20">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{srv.title}</h3>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              <button
                onClick={() => onOpenInquiry()}
                className="w-full bg-white/10 hover:bg-orange-500 text-white font-semibold text-xs py-3 rounded-xl transition-all border border-white/20 hover:border-orange-400 flex items-center justify-center gap-1.5 shadow"
              >
                <span>गाडी बुकिंग चौकशी</span>
                <Compass className="w-3.5 h-3.5 text-orange-300" />
              </button>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="mt-16 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              तुमच्या प्रवासासाठी सर्वोत्तम वाहन हवे आहे?
            </h3>
            <p className="text-blue-100/80 text-sm sm:text-base">
              आत्ताच आम्हाला कॉल करा किंवा ऑनलाईन चौकशी फॉर्म भरा. वाजवी दरात त्वरित गाडी कन्फर्मेशन!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:9356813711"
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl text-center shadow-lg transition-colors flex items-center justify-center gap-2 border border-orange-400/30"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>९३५६८१३७११ वर कॉल करा</span>
            </a>
            <button
              onClick={() => onOpenInquiry()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-sm px-6 py-3.5 rounded-xl text-center transition-colors backdrop-blur-md"
            >
              {t.inquireNow}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
