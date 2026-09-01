import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  AlertCircle,
  ArrowRight,
  Calculator,
  MessageSquare
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface PricingProps {
  settings: BusinessSettings;
}

export const Pricing: React.FC<PricingProps> = ({ settings }) => {
  const [calcService, setCalcService] = useState('basic');
  const [calcRooms, setCalcRooms] = useState(2);
  const [calcCondition, setCalcCondition] = useState('normal');

  const pricingTiers = [
    {
      title: 'Basic Home Cleaning',
      price: settings.startingPrices.basicHome,
      badge: 'Starter',
      desc: 'Ideal for 1-2 room apartments or routine sweeping, dusting, and mopping.',
      features: [
        'Sweeping & mopping floors',
        'Dusting of accessible surfaces',
        'Basic bathroom & toilet wash',
        'Kitchen exterior surface wipe',
        'Trash collection'
      ],
      ctaService: 'Residential Cleaning'
    },
    {
      title: 'Standard Home Cleaning',
      price: settings.startingPrices.standardHome,
      badge: 'Popular',
      popular: true,
      desc: 'Comprehensive cleaning for standard 2-4 room homes and apartments.',
      features: [
        'All Basic Home features',
        'Detailed bedroom & living room clean',
        'Full bathroom scrub & sanitation',
        'Kitchen countertop & appliance wipe',
        'Door handles & switch disinfection'
      ],
      ctaService: 'Residential Cleaning'
    },
    {
      title: 'Deep Cleaning',
      price: settings.startingPrices.deepCleaning,
      badge: 'Intensive',
      desc: 'Thorough floor scrubbing, descaling, and hard-to-reach area restoration.',
      features: [
        'Heavy floor scrubbing & tile grout',
        'Deep grease removal in kitchen',
        'Sanitary ware descaling & polish',
        'Baseboards, corners & frames',
        'Behind furniture deep sanitation'
      ],
      ctaService: 'Deep Cleaning'
    },
    {
      title: 'Office / Commercial',
      price: settings.startingPrices.commercial,
      badge: 'Business',
      desc: 'Tailored maintenance for corporate offices, shops, and customer premises.',
      features: [
        'Workstation & desk wipe-down',
        'Reception & entry glass polish',
        'Office floor vacuum & mopping',
        'Staff washroom sanitation',
        'Safe waste basket disposal'
      ],
      ctaService: 'Commercial Cleaning'
    },
    {
      title: 'Post-Construction',
      price: settings.startingPrices.postConstruction,
      badge: 'Handover',
      desc: 'Heavy-duty removal of paint splatters, cement residue, and fine dust.',
      features: [
        'Cement & paint speck scraping',
        'Full glass & window washing',
        'Fine plaster dust extraction',
        'Cabinet & fixture sanitation',
        'Ready-for-move-in guarantee'
      ],
      ctaService: 'Post-Construction Cleaning'
    },
    {
      title: 'General Cleaning',
      price: settings.startingPrices.generalCleaning,
      badge: 'Routine',
      desc: 'General day-to-day tidying, compound sweeping, and quick maintenance.',
      features: [
        'Compound & room sweeping',
        'Floor washing',
        'Surface dusting',
        'Light organization'
      ],
      ctaService: 'General Cleaning'
    }
  ];

  // Simple interactive estimator calculation
  const calculateEstimate = () => {
    let base = settings.startingPrices.basicHome;
    if (calcService === 'standard') base = settings.startingPrices.standardHome;
    if (calcService === 'deep') base = settings.startingPrices.deepCleaning;
    if (calcService === 'commercial') base = settings.startingPrices.commercial;
    if (calcService === 'post') base = settings.startingPrices.postConstruction;

    // Room multiplier
    const roomFactor = calcRooms > 2 ? (calcRooms - 2) * 40 : 0;

    // Condition multiplier
    let conditionFactor = 1;
    if (calcCondition === 'moderate') conditionFactor = 1.25;
    if (calcCondition === 'heavy') conditionFactor = 1.5;

    return Math.round((base + roomFactor) * conditionFactor);
  };

  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to request a quotation for a cleaning service.'
  )}`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Honest & Transparent
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Clear Starting Pricing
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Competitive and fair rates for homes, apartments, and businesses across Bibiani, Diaso, Goaso, and Western North Region.
          </p>
        </div>
      </section>

      {/* Main Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 transition-all flex flex-col justify-between relative ${
                tier.popular
                  ? 'bg-white shadow-soft-lg border-2 border-brand-blue ring-4 ring-brand-blue/10'
                  : 'bg-white shadow-soft border border-slate-100'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-[11px] font-extrabold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Recommended Choice
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    {tier.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-brand-navy mb-1">{tier.title}</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">{tier.desc}</p>

                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500 font-medium block">Starting from:</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black text-brand-navy">GH₵{tier.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">/ service</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    What's included:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to={`/book?service=${encodeURIComponent(tier.ctaService)}`}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
                  tier.popular
                    ? 'bg-brand-blue hover:bg-blue-600 text-white shadow-md'
                    : 'bg-brand-navy hover:bg-brand-blue text-white'
                }`}
              >
                <span>Request This Service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Variables & Transportation Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-950">
              Important Pricing Note & Factors
            </h3>
          </div>

          <p className="text-amber-900 text-sm sm:text-base leading-relaxed">
            “Final prices may vary depending on property size, cleaning condition, number of rooms, required equipment, distance and scope of work. Contact us for a personalized quotation.”
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm text-amber-900">
            <div className="bg-white/80 rounded-2xl p-4 border border-amber-200">
              <span className="font-bold block mb-1">📏 Property Scope & Condition:</span>
              <span>
                Properties with heavier soilage, post-renovation dust, or extra bathrooms require additional time and cleaning materials.
              </span>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-amber-200">
              <span className="font-bold block mb-1">🚗 Transportation Consideration:</span>
              <span>
                For locations outside our immediate Bibiani service area (such as Diaso, Goaso, or further in Western North), fair transportation charges may be added to your quotation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Ballpark Estimator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-brand-blueLight text-brand-blue">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-brand-navy">Interactive Ballpark Estimator</h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Adjust the options below to calculate a quick estimate for your space before booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Service Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Service Type
              </label>
              <select
                value={calcService}
                onChange={(e) => setCalcService(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
              >
                <option value="basic">Basic Home (from GH₵150)</option>
                <option value="standard">Standard Home (from GH₵200)</option>
                <option value="deep">Deep Cleaning (from GH₵300)</option>
                <option value="commercial">Commercial/Office (from GH₵250)</option>
                <option value="post">Post-Construction (from GH₵500)</option>
              </select>
            </div>

            {/* Rooms Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Number of Rooms
              </label>
              <select
                value={calcRooms}
                onChange={(e) => setCalcRooms(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
              >
                <option value={1}>1 Room / Studio</option>
                <option value={2}>2 Rooms</option>
                <option value={3}>3 Rooms</option>
                <option value={4}>4 Rooms</option>
                <option value={5}>5+ Rooms</option>
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cleaning Condition
              </label>
              <select
                value={calcCondition}
                onChange={(e) => setCalcCondition(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
              >
                <option value="normal">Normal Routine</option>
                <option value="moderate">Moderate Dirt / Overdue</option>
                <option value="heavy">Heavy Soilage / Deep Grime</option>
              </select>
            </div>
          </div>

          {/* Result Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-navy to-brand-navyLight text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-brand-cyan block">
                Estimated Ballpark Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                ~ GH₵{calculateEstimate()}
              </div>
              <span className="text-[11px] text-slate-300">
                * Final quotation confirmed upon schedule review.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/book"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs sm:text-sm text-center shadow-md transition-colors"
              >
                Proceed to Book
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
