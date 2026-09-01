import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface ServiceAreasProps {
  settings: BusinessSettings;
}

export const ServiceAreas: React.FC<ServiceAreasProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to know if you can clean my property in my location.'
  )}`;

  const locations = [
    {
      id: 'bibiani',
      name: 'Bibiani (Head Office & Primary Hub)',
      tagline: 'Fastest Response & Zero Long-Distance Surcharges',
      desc: 'Bibiani is our primary base of operations. We provide comprehensive daily residential, commercial, deep cleaning, and post-construction services across all neighborhoods and suburbs in Bibiani.',
      highlights: [
        'Rapid deployment & flexible same-day/next-day scheduling',
        'Serving all residential estates, apartments, and private homes',
        'Offices, shops, banks, and commercial premises across Bibiani town',
        'No distance transport surcharge within standard municipal zone'
      ]
    },
    {
      id: 'diaso',
      name: 'Diaso & Surrounding Communities',
      tagline: 'Reliable Cleaning For Homes & Local Businesses',
      desc: 'We regularly dispatch our cleaning teams to Diaso for thorough residential and commercial cleaning projects. We ensure the same high standard of hygiene and care.',
      highlights: [
        'Scheduled deep cleaning and routine home maintenance',
        'Shop, office, and business premise sanitization',
        'Post-construction handover cleans for new buildings',
        'Nominal and transparent transportation fee included in quote'
      ]
    },
    {
      id: 'goaso',
      name: 'Goaso & Environs',
      tagline: 'Professional Cleaning Solutions for Goaso',
      desc: 'Our cleaning professionals readily travel to Goaso for residential apartments, executive homes, business facilities, and special post-renovation cleaning projects.',
      highlights: [
        'Dedicated full-day and multi-day deep cleaning teams',
        'Residential move-in / move-out cleaning services',
        'Commercial and administrative workspace cleaning',
        'Clear upfront distance travel estimate with zero hidden fees'
      ]
    },
    {
      id: 'western-north',
      name: 'Western North Region & Nearby Towns',
      tagline: 'Expanding Professional Hygiene Across the Region',
      desc: 'From mining communities to commercial towns across Western North Region, YANKEY is committed to bringing top-tier professional cleaning right to your doorstep.',
      highlights: [
        'Large-scale commercial and residential project cleaning',
        'Post-construction cleaning for institutional & private developments',
        'Custom corporate maintenance contracts',
        'Direct coordination with our head office in Bibiani'
      ]
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Where We Clean
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Service Areas
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Headquartered in Bibiani, proudly serving Diaso, Goaso, and communities across the Western North Region of Ghana.
          </p>
        </div>
      </section>

      {/* Main Service Area Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {locations.map((loc, idx) => (
            <div
              key={loc.id}
              id={loc.id}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-brand-blue">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Location Profile #{idx + 1}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                  {loc.name}
                </h2>
                <p className="text-emerald-700 font-semibold text-xs sm:text-sm">
                  {loc.tagline}
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {loc.desc}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Service Capabilities in this area:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {loc.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to={`/book?location=${encodeURIComponent(loc.name.split(' ')[0])}`}
                    className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Calendar className="w-4 h-4 text-brand-cyan" />
                    <span>Book in {loc.name.split(' ')[0]}</span>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Confirm Location</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center space-y-4 text-xs text-slate-600">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-blue shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Operating Hours</span>
                    <span>{settings.businessHours}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Pricing Transparency</span>
                    <span>Transparent quotation with distance logistics accounted for.</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Distance & Travel Charge Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200 text-blue-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-brand-navy">
              Live in a nearby community not explicitly listed above?
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              We frequently service towns and settlements near Bibiani, Diaso, and Goaso. Send us your location on WhatsApp and we will confirm scheduling right away.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shrink-0 shadow-md transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Location on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
