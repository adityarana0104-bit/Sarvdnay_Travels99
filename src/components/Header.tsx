import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X, Globe, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenInquiry: (vehicleId?: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onOpenInquiry, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Info Bar */}
      <div className="bg-white/5 backdrop-blur-md text-white text-xs sm:text-sm py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="tel:9356813711"
              className="flex items-center gap-1.5 hover:text-orange-400 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>9356813711</span>
            </a>
            <a
              href="mailto:Sarvdnyatravels9499@gmail.com"
              className="hidden sm:flex items-center gap-1.5 hover:text-orange-400 transition-colors text-white/80"
            >
              <Mail className="w-3.5 h-3.5 text-orange-400" />
              <span>Sarvdnyatravels9499@gmail.com</span>
            </a>
            <div className="flex items-center gap-1 text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
              <span>{lang === 'mr' ? 'कार्यालय: बोधवड, जळगाव' : 'Office: Bodwad, Jalgaon, Maharashtra'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'mr' ? 'en' : 'mr')}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold transition-all border border-white/20 hover:border-orange-400 text-white shadow-sm"
              title="Toggle Language / भाषा बदला"
            >
              <Globe className="w-3.5 h-3.5 text-orange-300" />
              <span>{lang === 'mr' ? 'English 🌐' : 'मराठी 🚩'}</span>
            </button>

            <a
              href="https://wa.me/919356813711?text=Hello%20Sarvdnya%20Tours%20%26%20Travels,%20I%20want%20to%20inquire%20about%20vehicle%20rental."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/30 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-emerald-200" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="bg-orange-500/20 hover:bg-orange-500 border border-orange-400/40 text-orange-300 hover:text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Admin Dashboard (एडमिन लॉगिन)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`bg-[#001B44]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
          isScrolled ? 'shadow-2xl bg-[#001B44]/95 border-white/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div
            onClick={() => scrollToSection('home')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform font-black text-xl">
              S
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-none group-hover:text-orange-400 transition-colors font-['Baloo_2',sans-serif]">
                सर्वज्ञ <span className="text-orange-400 font-bold text-base sm:text-lg lg:text-xl">टूर्स & ट्रॅव्हल्स</span>
              </h1>
              <p className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5 font-medium">
                Sarvdnya Tours & Travels
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider font-semibold">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white/80 hover:text-orange-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-orange-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => scrollToSection('fleet')}
              className="text-white/80 hover:text-orange-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
            >
              {t.navFleet}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white/80 hover:text-orange-400 transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 hover:after:w-full after:transition-all"
            >
              {t.navContact}
            </button>
          </nav>

          {/* Desktop CTA Action */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:9356813711"
              className="text-right"
            >
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Call Us 24/7</p>
              <p className="text-orange-400 font-bold text-sm hover:underline">9356813711</p>
            </a>
            <button
              onClick={() => onOpenInquiry()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5 border border-orange-400/30"
            >
              {t.inquireNow}
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenInquiry()}
              className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow"
            >
              {t.inquireNow}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#001B44]/95 backdrop-blur-2xl border-t border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-orange-400 font-semibold"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-orange-400 font-semibold"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => scrollToSection('fleet')}
              className="block w-full text-left py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-orange-400 font-semibold"
            >
              {t.navFleet}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/10 hover:text-orange-400 font-semibold"
            >
              {t.navContact}
            </button>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href="tel:9356813711"
                className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>कॉल करा: 9356813711</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-colors"
              >
                {t.inquireNow}
              </button>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full bg-orange-500/20 border border-orange-400/40 text-orange-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
