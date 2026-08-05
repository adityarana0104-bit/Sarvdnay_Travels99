import React from 'react';
import { Phone, Mail, MapPin, Heart, ChevronRight, MessageSquare, Facebook, Instagram, Youtube } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  lang: Language;
  onOpenInquiry: (vehicleId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenInquiry }) => {
  const t = translations[lang];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#00122e]/90 backdrop-blur-2xl text-blue-100/80 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg font-black text-lg">
                S
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{t.brandName}</h3>
                <p className="text-xs text-orange-400 font-medium">{t.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-blue-100/70 leading-relaxed">
              आपल्या प्रवासाचा विश्वासू साथी. AC आणि Non-AC वाहनांच्या माध्यमातून सुरक्षित, आरामदायी आणि वाजवी दरात प्रवास सुविधा.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919356813711"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 text-emerald-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 text-blue-400 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 text-pink-400 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 text-red-400 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-4 border-orange-500 pl-2">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.navHome}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.navAbout}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('fleet')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.navFleet}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                  <span>{t.navContact}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInquiry()}
                  className="hover:text-orange-300 transition-colors flex items-center gap-1.5 font-bold text-orange-400"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>गाडी बुकिंग ऑनलाईन</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-4 border-sky-400 pl-2">
              {t.ourServices}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100/70">
              <li>• धार्मिक तीर्थयात्रा (अष्टविनायक, ज्योतिर्लिंग)</li>
              <li>• कौटुंबिक सहली व प्रेक्षणीय स्थळे</li>
              <li>• लग्न समारंभ व वऱ्हाडी गाड्या</li>
              <li>• कॉर्पोरेट व ऑफिस ट्रिप्स</li>
              <li>• २४ तास पिकअप आणि ड्रॉप सेवा</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 border-l-4 border-emerald-400 pl-2">
              संपर्क माहिती
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <a href="tel:9356813711" className="hover:text-orange-400 transition-colors font-bold text-white">
                  9356813711
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <a
                  href="mailto:Sarvdnyatravels9499@gmail.com"
                  className="hover:text-orange-400 transition-colors break-all text-blue-100/90"
                >
                  Sarvdnyatravels9499@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-blue-100/70">महाराष्ट्र, भारत</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100/60 gap-4">
          <p>© 2026 सर्वज्ञ टूर्स & ट्रॅव्हल्स. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>सुरक्षित आणि आनंददायी प्रवासासाठी कटिबद्ध</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
