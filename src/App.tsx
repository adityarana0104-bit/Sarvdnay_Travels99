import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FleetSection } from './components/FleetSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { InquiryModal } from './components/InquiryModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Language } from './types';
import { Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [preselectedVehicleId, setPreselectedVehicleId] = useState<string | undefined>(undefined);

  const handleOpenInquiry = (vehicleId?: string) => {
    setPreselectedVehicleId(vehicleId);
    setInquiryModalOpen(true);
  };

  const handleCloseInquiry = () => {
    setInquiryModalOpen(false);
    setPreselectedVehicleId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#001B44] text-white font-sans selection:bg-orange-500 selection:text-white flex flex-col antialiased relative overflow-x-hidden">
      {/* Background Mesh Blur Gradients */}
      <div className="fixed inset-0 opacity-40 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header
          lang={lang}
          setLang={setLang}
          onOpenInquiry={handleOpenInquiry}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />
      </div>

      {/* Main Sections */}
      <main className="flex-1 relative z-10 space-y-4">
        <HeroSection lang={lang} onOpenInquiry={handleOpenInquiry} />
        <AboutSection lang={lang} />
        <FleetSection lang={lang} onOpenInquiry={handleOpenInquiry} />
        <ServicesSection lang={lang} onOpenInquiry={handleOpenInquiry} />
        <ContactSection lang={lang} />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer lang={lang} onOpenInquiry={handleOpenInquiry} />
      </div>

      {/* Inquiry Form Modal Popup */}
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={handleCloseInquiry}
        preselectedVehicleId={preselectedVehicleId}
        lang={lang}
      />

      {/* Admin Dashboard Firestore Live Management Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        lang={lang}
      />

      {/* Floating Bottom Contact Bar for Mobile */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-30 flex items-center gap-2 p-2 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        <a
          href="tel:9356813711"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
        >
          <Phone className="w-3.5 h-3.5 text-orange-400" />
          <span>9356813711</span>
        </a>

        <a
          href="https://wa.me/919356813711?text=Hello%20Sarvdnya%20Tours%20%26%20Travels,%20I%20want%20to%20inquire%20about%20vehicle%20booking."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-emerald-600/90 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow backdrop-blur-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => handleOpenInquiry()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 transition-colors shrink-0"
        >
          बुक करा
        </button>
      </div>
    </div>
  );
}
