import React from 'react';
import { ShieldCheck, Snowflake, Clock, Award, ChevronRight, PhoneCall, CalendarCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeroSectionProps {
  lang: Language;
  onOpenInquiry: (vehicleId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onOpenInquiry }) => {
  const t = translations[lang];

  return (
    <section id="home" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center text-white overflow-hidden py-12">
      {/* Background Image with Deep Blue Glass Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1920&auto=format&fit=crop"
          alt="Tourist Vehicles Sarvdnya Tours & Travels"
          className="w-full h-full object-cover object-center scale-105 transform filter brightness-75"
          referrerPolicy="no-referrer"
        />
        {/* Layered Gradient Overlays for Frosted Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001B44]/95 via-[#001B44]/80 to-[#000d24]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001B44] via-transparent to-[#001B44]/60" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center text-center">
        {/* Top Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-orange-300 px-5 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-xl animate-fade-in">
          <Award className="w-4 h-4 text-orange-400" />
          <span>{t.tagline}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl drop-shadow-lg">
          {t.headline}
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-xl text-blue-100/90 max-w-3xl font-normal leading-relaxed">
          {t.subheadline}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Book Now Button */}
          <button
            onClick={() => onOpenInquiry()}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-base sm:text-lg font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/45 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group border border-orange-400/30"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>{t.bookNow}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Inquire Now Button */}
          <button
            onClick={() => onOpenInquiry()}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white text-base sm:text-lg font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>{t.inquireNow}</span>
          </button>

          {/* Quick Call Direct Link */}
          <a
            href="tel:9356813711"
            className="w-full sm:w-auto bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md text-white text-base sm:text-lg font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-blue-400/40 shadow-lg"
          >
            <PhoneCall className="w-5 h-5 text-orange-400" />
            <span>9356813711</span>
          </a>
        </div>

        {/* Feature Highlights Bar */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 text-left hover:bg-white/15 transition-all shadow-lg">
            <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl shrink-0 border border-orange-500/30">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{t.heroFeature1}</p>
              <p className="text-[11px] text-blue-200/80">आपल्या आवडीनुसार</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 text-left hover:bg-white/15 transition-all shadow-lg">
            <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl shrink-0 border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{t.heroFeature2}</p>
              <p className="text-[11px] text-blue-200/80">सुरक्षित व सोयीस्कर</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 text-left hover:bg-white/15 transition-all shadow-lg">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 border border-emerald-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{t.heroFeature3}</p>
              <p className="text-[11px] text-blue-200/80">दिवस-रात्र तत्पर</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3 text-left hover:bg-white/15 transition-all shadow-lg">
            <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{t.heroFeature4}</p>
              <p className="text-[11px] text-blue-200/80">वाजवी व पारदर्शक</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
