import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { createInquiry } from '../services/inquiryService';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && mobileNumber.trim()) {
      setIsSubmitting(true);
      try {
        await createInquiry({
          vehicleName: 'General Inquiry',
          vehicleType: 'General',
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          additionalRequirements: message.trim(),
          source: 'contact_section',
        });
      } catch (err) {
        console.error('Failed to save contact inquiry to Firestore:', err);
      } finally {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          setFullName('');
          setMobileNumber('');
          setMessage('');
          setSubmitted(false);
        }, 4000);
      }
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-300 font-bold text-xs tracking-wider uppercase bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
            {t.navContact}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight drop-shadow-md">
            {t.contactTitle}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full shadow-lg" />
          <p className="text-blue-100/80 text-sm sm:text-base mt-3 font-normal">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Cards Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 text-white">
              <h3 className="text-2xl font-black text-white border-b border-white/15 pb-4">
                {t.brandName}
              </h3>

              {/* Phone Card */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20 text-orange-400 rounded-2xl shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/70 uppercase tracking-wider">
                    {t.phoneLabel}
                  </p>
                  <a
                    href="tel:9356813711"
                    className="text-lg sm:text-xl font-extrabold text-white hover:text-orange-400 transition-colors block mt-0.5"
                  >
                    9356813711
                  </a>
                  <p className="text-xs text-blue-100/70 mt-0.5">24x7 कॉल / बुकिंग सेवा उपलब्ध</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20 text-orange-400 rounded-2xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/70 uppercase tracking-wider">
                    {t.emailLabel}
                  </p>
                  <a
                    href="mailto:Sarvdnyatravels9499@gmail.com"
                    className="text-sm sm:text-base font-bold text-white hover:text-orange-400 transition-colors break-all block mt-0.5"
                  >
                    Sarvdnyatravels9499@gmail.com
                  </a>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20 text-emerald-400 rounded-2xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/70 uppercase tracking-wider">
                    {t.addressLabel}
                  </p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {t.addressValue}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 border border-white/20 text-sky-400 rounded-2xl shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-200/70 uppercase tracking-wider">
                    कामाची वेळ
                  </p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    सोमवार - रविवार: २४ तास (24/7 Service)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://wa.me/919356813711?text=Hello%20Sarvdnya%20Tours%20%26%20Travels,%20I%20want%20to%20inquire%20about%20vehicle%20booking."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm border border-emerald-400/30"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t.whatsappBtn}</span>
              </a>

              <a
                href="tel:9356813711"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm border border-orange-400/30"
              >
                <Phone className="w-5 h-5" />
                <span>{t.directCallBtn}</span>
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-2xl p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl text-white">
            <h3 className="text-2xl font-black text-white mb-2">
              {t.contactFormTitle}
            </h3>
            <p className="text-blue-100/80 text-sm mb-6">
              तुमची माहिती खाली लिहा, आमचा प्रतिनिधी तुमच्याशी त्वरित संपर्क करेल.
            </p>

            {submitted ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 p-6 rounded-2xl text-center space-y-2 animate-scale-up backdrop-blur-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="font-bold text-base">{t.msgSuccess}</p>
                <p className="text-xs text-emerald-200">
                  सर्वज्ञ टूर्स & ट्रॅव्हल्स शी संपर्क साधल्याबद्दल धन्यवाद!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    {t.fieldName} <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Full Name.."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    {t.fieldMobile} <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter Your Mobile Number.."
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    {t.fieldMessage}
                  </label>
                  <textarea
                    rows={4}
                    placeholder="तुमच्या प्रवासाचे ठिकाण, तारीख, अपेक्षित गाडी आणि इतर काही विशेष आवश्यकता असल्यास नमूद करा..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-sm border border-orange-400/30 hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.btnSendMessage}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
