import React, { useState } from 'react';
import { Users, Snowflake, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { VehicleCategory, Language } from '../types';
import { vehiclesData } from '../data/vehicles';
import { translations } from '../data/translations';

interface FleetSectionProps {
  lang: Language;
  onOpenInquiry: (vehicleId?: string) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ lang, onOpenInquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
  const t = translations[lang];

  const filteredVehicles = vehiclesData.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  return (
    <section id="fleet" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-orange-300 font-bold text-xs tracking-wider uppercase bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full shadow-lg">
            {t.navFleet}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight drop-shadow-md">
            {t.fleetTitle}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mt-4 rounded-full shadow-lg" />
          <p className="text-blue-100/80 text-sm sm:text-base mt-3 font-normal">
            {t.fleetSubtitle}
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border backdrop-blur-xl ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white border-orange-400/50 shadow-lg shadow-orange-500/25'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.filterAll}
          </button>
          <button
            onClick={() => setSelectedCategory('traveller')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border backdrop-blur-xl ${
              selectedCategory === 'traveller'
                ? 'bg-orange-500 text-white border-orange-400/50 shadow-lg shadow-orange-500/25'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.filterTraveller}
          </button>
          <button
            onClick={() => setSelectedCategory('cruiser')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border backdrop-blur-xl ${
              selectedCategory === 'cruiser'
                ? 'bg-orange-500 text-white border-orange-400/50 shadow-lg shadow-orange-500/25'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.filterCruiser}
          </button>
          <button
            onClick={() => setSelectedCategory('car')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border backdrop-blur-xl ${
              selectedCategory === 'car'
                ? 'bg-orange-500 text-white border-orange-400/50 shadow-lg shadow-orange-500/25'
                : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
            }`}
          >
            {t.filterCar}
          </button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => {
            const vName = lang === 'mr' ? vehicle.nameMr : vehicle.name;
            const vDesc = lang === 'mr' ? vehicle.descriptionMr : vehicle.description;
            const vIdeal = lang === 'mr' ? vehicle.idealForMr : vehicle.idealFor;
            const vFeatures = lang === 'mr' ? vehicle.featuresMr : vehicle.features;

            return (
              <div
                key={vehicle.id}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1.5 hover:border-white/30"
              >
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden bg-slate-900/50">
                  <img
                    src={vehicle.image}
                    alt={vName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001B44] via-black/30 to-transparent" />

                  {/* Seating Capacity Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>
                      {vehicle.seatingCapacity} {t.seats}
                    </span>
                  </div>

                  {/* AC / Non-AC Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {vehicle.acAvailable && (
                      <span className="bg-emerald-600/90 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1 shadow-md border border-emerald-400/30">
                        <Snowflake className="w-3 h-3 text-cyan-200" />
                        <span>AC Available</span>
                      </span>
                    )}
                    {vehicle.nonAcAvailable && (
                      <span className="bg-slate-800/90 text-gray-200 text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1 shadow-md border border-white/10">
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        <span>Non-AC Available</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-black text-white drop-shadow-md">
                      {vName}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {vDesc}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-1.5 mb-4 border-t border-b border-white/10 py-3">
                      {vFeatures.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-white/90">
                          <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Ideal For Note */}
                    <div className="bg-white/5 p-3 rounded-xl text-xs mb-6 border border-white/10">
                      <span className="font-bold text-orange-300 block mb-0.5">
                        {t.idealFor}
                      </span>
                      <span className="text-blue-100/90 font-normal">{vIdeal}</span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => onOpenInquiry(vehicle.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group/btn border border-orange-400/30"
                  >
                    <span>{t.bookNow}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
