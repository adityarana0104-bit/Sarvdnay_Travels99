import React from 'react';
import { UserCheck, Sparkles, Tag, Clock, ShieldCheck, HeartHandshake, CheckCircle2, Award } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface AboutSectionProps {
  lang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const features = [
    {
      icon: <UserCheck className="w-6 h-6 text-orange-400" />,
      title: t.feat1Title,
      desc: t.feat1Desc,
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-300" />,
      title: t.feat2Title,
      desc: t.feat2Desc,
    },
    {
      icon: <Tag className="w-6 h-6 text-emerald-400" />,
      title: t.feat3Title,
      desc: t.feat3Desc,
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-400" />,
      title: t.feat4Title,
      desc: t.feat4Desc,
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-300" />,
      title: t.feat5Title,
      desc: t.feat5Desc,
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-orange-400" />,
      title: t.feat6Title,
      desc: t.feat6Desc,
    },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-300 font-bold text-xs tracking-wider uppercase bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
            {t.navAbout}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight drop-shadow-md">
            {t.aboutTitle}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full shadow-lg" />
          <p className="text-blue-100/80 text-sm sm:text-base mt-3 font-normal">
            {t.aboutSubtitle}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t.estdBadge} (ESTD. 2013)</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              {t.brandName} - <span className="text-orange-400">{t.tagline}</span>
            </h3>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed font-normal">
              {t.aboutContent} सन २०१३ पासून (Since 2013) अविरतपणे ग्राहकांच्या विश्वासाला पात्र ठरत आम्ही सुरक्षित व सोयीस्कर ट्रॅव्हल्स सेवा पुरवत आहोत.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 text-white font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                <span>१००% सुरक्षित व वातानुकूलित गाड्या</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                <span>वेळेवर पिकअप व सुरक्षित ड्रॉप सेवा</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                <span>लहान व मोठ्या ग्रुपसाठी योग्य गाड्या</span>
              </div>
              <div className="flex items-center gap-2.5 text-white font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                <span>संपूर्ण महाराष्ट्र व भारतभरात सेवा</span>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl" />
            <h4 className="text-xl font-bold mb-6 text-orange-300 border-b border-white/15 pb-3">
              आमची वैशिष्ट्ये आणि विश्वास
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl sm:text-4xl font-black text-amber-300">
                  {t.statHappyClients}
                </p>
                <p className="text-xs sm:text-sm text-blue-100/80 mt-1">{t.statHappyClientsLabel}</p>
              </div>

              <div>
                <p className="text-3xl sm:text-4xl font-black text-amber-300">
                  {t.statToursCompleted}
                </p>
                <p className="text-xs sm:text-sm text-blue-100/80 mt-1">{t.statToursCompletedLabel}</p>
              </div>

              <div>
                <p className="text-3xl sm:text-4xl font-black text-amber-300">
                  {t.statVehicles}
                </p>
                <p className="text-xs sm:text-sm text-blue-100/80 mt-1">{t.statVehiclesLabel}</p>
              </div>

              <div>
                <p className="text-3xl sm:text-4xl font-black text-amber-300">
                  {t.statYearsExp}
                </p>
                <p className="text-xs sm:text-sm text-blue-100/80 mt-1">{t.statYearsExpLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 flex items-start gap-4"
            >
              <div className="p-3 bg-white/10 border border-white/20 rounded-2xl shrink-0">{feat.icon}</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">{feat.title}</h4>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
