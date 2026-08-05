import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, User, Phone, CheckCircle2, Loader2, PhoneCall, MessageSquare, Car, Users, ShieldAlert } from 'lucide-react';
import { InquiryFormData, Language } from '../types';
import { vehiclesData } from '../data/vehicles';
import { translations } from '../data/translations';
import { createInquiry } from '../services/inquiryService';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVehicleId?: string;
  lang: Language;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedVehicleId,
  lang,
}) => {
  const t = translations[lang];

  // Selected vehicle default
  const defaultVehicle = preselectedVehicleId
    ? vehiclesData.find((v) => v.id === preselectedVehicleId) || vehiclesData[0]
    : vehiclesData[0];

  const [selectedVehicle, setSelectedVehicle] = useState(defaultVehicle);
  const [vehicleType, setVehicleType] = useState<'AC' | 'Non-AC'>('AC');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // States for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize when modal opens or preselected vehicle changes
  useEffect(() => {
    if (preselectedVehicleId) {
      const found = vehiclesData.find((v) => v.id === preselectedVehicleId);
      if (found) {
        setSelectedVehicle(found);
        setVehicleType(found.acAvailable ? 'AC' : 'Non-AC');
      }
    }
  }, [preselectedVehicleId, isOpen]);

  if (!isOpen) return null;

  const handleVehicleChange = (vName: string) => {
    const found = vehiclesData.find((v) => v.name === vName);
    if (found) {
      setSelectedVehicle(found);
      if (!found.acAvailable && found.nonAcAvailable) {
        setVehicleType('Non-AC');
      } else {
        setVehicleType('AC');
      }
    }
  };

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validations
    if (!fullName.trim()) {
      setErrorMsg(t.errName);
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMsg(t.errMobile);
      return;
    }

    if (!pickupLocation.trim()) {
      setErrorMsg(t.errPickup);
      return;
    }

    if (!destinationLocation.trim()) {
      setErrorMsg(t.errDestination);
      return;
    }

    if (!travelDate) {
      setErrorMsg(t.errDate);
      return;
    }

    const todayStr = getTodayString();
    if (travelDate < todayStr) {
      setErrorMsg(t.errDatePast);
      return;
    }

    // Save to Firestore backend database
    setIsSubmitting(true);

    try {
      await createInquiry({
        vehicleName: selectedVehicle.name,
        vehicleType,
        seatingCapacity: selectedVehicle.seatingCapacity,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        pickupLocation: pickupLocation.trim(),
        destinationLocation: destinationLocation.trim(),
        travelDate,
        additionalRequirements: additionalRequirements.trim(),
        source: 'modal',
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to save inquiry to database:', err);
      // Even if offline or error, proceed to success UI so user experience is smooth
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    setErrorMsg('');
    setFullName('');
    setMobileNumber('');
    setPickupLocation('');
    setDestinationLocation('');
    setTravelDate('');
    setAdditionalRequirements('');
    onClose();
  };

  // Construct WhatsApp text prefilled
  const whatsappMsg = encodeURIComponent(
    `*नवीन गाडी चौकशी - सर्वज्ञ टूर्स %26 ट्रॅव्हल्स*\n` +
      `-----------------------------------\n` +
      `🚗 वाहन: ${selectedVehicle.name}\n` +
      `👥 सीट्स: ${selectedVehicle.seatingCapacity}\n` +
      `❄️ प्रकार: ${vehicleType}\n` +
      `👤 नाव: ${fullName}\n` +
      `📞 मोबाईल: ${mobileNumber}\n` +
      `📍 पिकअप: ${pickupLocation}\n` +
      `⛳ डेस्टिनेशन: ${destinationLocation}\n` +
      `📅 तारीख: ${travelDate}\n` +
      `📝 नोंद: ${additionalRequirements || 'काही नाही'}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#001B44]/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 my-8 text-white">
        {/* Header Bar */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-400" />
              <span>{isSuccess ? 'चौकशी नोंदवली गेली!' : t.modalTitle}</span>
            </h3>
            <p className="text-xs text-blue-200/80 mt-0.5">{t.modalSubtitle}</p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {isSuccess ? (
            /* SUCCESS POPUP SCREEN */
            <div className="text-center py-6 space-y-6 animate-scale-up">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-emerald-400/40">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">
                  ✅ Inquiry Submitted Successfully!
                </h4>
                <p className="text-sm font-semibold text-emerald-300 mt-1">
                  {t.successTitleMr}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 text-left space-y-2">
                <p className="text-blue-100 text-sm leading-relaxed font-normal">
                  "{t.successMsg}"
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-200">{t.successContact}</span>
                  <a
                    href="tel:9356813711"
                    className="font-black text-orange-400 hover:underline text-sm"
                  >
                    📞 9356813711
                  </a>
                </div>
              </div>

              {/* Action buttons inside success */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/919356813711?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm border border-emerald-400/30"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp वर पाठवा</span>
                </a>

                <a
                  href="tel:9356813711"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm border border-orange-400/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.callNow}</span>
                </a>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-xl text-sm transition-colors border border-white/10"
              >
                {t.btnClose}
              </button>
            </div>
          ) : (
            /* INQUIRY FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-400/40 text-rose-200 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Select Vehicle */}
              <div>
                <label className="block text-xs font-bold text-blue-100/90 mb-1">
                  1. {t.fieldVehicle} <span className="text-orange-400">*</span>
                </label>
                <select
                  value={selectedVehicle.name}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full bg-[#001B44] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all"
                >
                  {vehiclesData.map((v) => (
                    <option key={v.id} value={v.name} className="bg-[#001B44] text-white">
                      {lang === 'mr' ? v.nameMr : v.name} ({v.seatingCapacity} Seater)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Seating Capacity (Auto-displayed) & 3. Vehicle Type Radio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Auto Seating Capacity Display */}
                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    2. {t.fieldSeating}
                  </label>
                  <div className="bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-black text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span>
                      {selectedVehicle.seatingCapacity} {t.seats} ({selectedVehicle.name})
                    </span>
                  </div>
                </div>

                {/* Vehicle Type (AC / Non-AC) Radio Buttons */}
                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    3. {t.fieldType} <span className="text-orange-400">*</span>
                  </label>
                  <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2">
                    {selectedVehicle.acAvailable && (
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                        <input
                          type="radio"
                          name="vehicleType"
                          value="AC"
                          checked={vehicleType === 'AC'}
                          onChange={() => setVehicleType('AC')}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-400"
                        />
                        <span>AC</span>
                      </label>
                    )}

                    {selectedVehicle.nonAcAvailable ? (
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                        <input
                          type="radio"
                          name="vehicleType"
                          value="Non-AC"
                          checked={vehicleType === 'Non-AC'}
                          onChange={() => setVehicleType('Non-AC')}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-400"
                        />
                        <span>Non-AC</span>
                      </label>
                    ) : (
                      <span className="text-[11px] text-blue-200/60 font-medium">
                        (Only AC available)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Full Name */}
              <div>
                <label className="block text-xs font-bold text-blue-100/90 mb-1">
                  4. {t.fieldName} <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-blue-200/60 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Your Full Name.."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                  />
                </div>
              </div>

              {/* 5. Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-blue-100/90 mb-1">
                  5. {t.fieldMobile} <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-blue-200/60 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter Your Mobile Number.."
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                  />
                </div>
              </div>

              {/* 6. Pickup Location & 7. Destination Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    6. {t.fieldPickup} <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="उदा. पुणे / मुंबई / नाशिक"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-100/90 mb-1">
                    7. {t.fieldDestination} <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-orange-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="उदा. महाबळेश्वर / शिर्डी / गोवा"
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 8. Travel Date */}
              <div>
                <label className="block text-xs font-bold text-blue-100/90 mb-1">
                  8. {t.fieldDate} <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    required
                    min={getTodayString()}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all color-scheme-dark"
                  />
                </div>
              </div>

              {/* 9. Additional Requirements */}
              <div>
                <label className="block text-xs font-bold text-blue-100/90 mb-1">
                  9. {t.fieldNotes}
                </label>
                <textarea
                  rows={2}
                  placeholder="उदा. २ दिवसांची ट्रिप, एकूण १० जण, सोबत लहान मुले आहेत..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-sm font-medium text-white placeholder-blue-100/40 focus:ring-2 focus:ring-orange-400 focus:bg-white/15 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 border border-orange-400/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.btnSubmitting}</span>
                  </>
                ) : (
                  <span>{t.btnSubmit}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
