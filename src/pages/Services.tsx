import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Building2,
  SprayCan,
  HardHat,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface ServicesProps {
  settings: BusinessSettings;
}

export const Services: React.FC<ServicesProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to inquire about your cleaning services.'
  )}`;

  const services = [
    {
      id: 'residential',
      title: 'Residential Cleaning',
      subtitle: 'Complete comfort & freshness for your home',
      price: settings.startingPrices.basicHome,
      standardPrice: settings.startingPrices.standardHome,
      icon: <Home className="w-8 h-8 text-brand-blue" />,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      description: 'Reliable cleaning services for busy individuals, families, and tenants. We take care of every corner so you come home to a fresh, healthy, and spotless environment.',
      suitableFor: [
        'Houses & Compounds',
        'Apartments & Flats',
        'Bedrooms & Living Areas',
        'Kitchens & Dining Rooms',
        'Bathrooms & Toilets',
        'Rental Properties & Move-In/Out'
      ],
      included: [
        'Complete floor sweeping and mopping with quality detergents',
        'Surface wiping and dust removal on furniture and tables',
        'Bathroom disinfection, tile cleaning, and toilet sanitation',
        'Kitchen counters, sink cleaning, and exterior appliance wipe',
        'Trash bin emptying and general room tidying'
      ]
    },
    {
      id: 'commercial',
      title: 'Commercial Cleaning',
      subtitle: 'Create a clean, professional impression for your business',
      price: settings.startingPrices.commercial,
      icon: <Building2 className="w-8 h-8 text-emerald-600" />,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      description: 'Keep your workplace hygienic, organized, and inviting for clients and employees. We deliver discreet, high-standard commercial cleaning that upholds your company’s image.',
      suitableFor: [
        'Corporate Offices',
        'Retail Shops & Showrooms',
        'Business Premises & Workspaces',
        'Reception Areas & Waiting Rooms',
        'Conference & Meeting Rooms',
        'Financial & Professional Hubs'
      ],
      included: [
        'Daily or scheduled workspace and desk sanitation',
        'Floor vacuuming, sweeping, and streak-free mopping',
        'Restroom sanitizing and restocking coordination',
        'Reception area, glass doors, and entry polishing',
        'Waste management and safe disposal'
      ]
    },
    {
      id: 'deep-cleaning',
      title: 'Deep Cleaning',
      subtitle: 'Intensive restoration and thorough sanitation',
      price: settings.startingPrices.deepCleaning,
      icon: <SprayCan className="w-8 h-8 text-indigo-600" />,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      description: 'An exhaustive, comprehensive cleaning designed to tackle stubborn dirt, grime, and hard-to-reach areas that regular cleaning often misses.',
      suitableFor: [
        'Seasonal Spring Cleaning',
        'Heavily Soiled Properties',
        'Kitchens with Grease Buildup',
        'Bathrooms with Grout Stains',
        'Pre-Event / Post-Party Clean-Up'
      ],
      included: [
        'Detailed floor scrubbing and tile grout cleaning',
        'In-depth bathroom and sanitary ware descaling',
        'Deep kitchen grease removal and backsplash scrubbing',
        'Interior window frames, baseboards, and ceiling corners',
        'Behind and underneath furniture cleaning where accessible'
      ]
    },
    {
      id: 'post-construction',
      title: 'Post-Construction Cleaning',
      subtitle: 'From construction site to ready-to-occupy perfection',
      price: settings.startingPrices.postConstruction,
      icon: <HardHat className="w-8 h-8 text-amber-600" />,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'Eliminate paint splatters, plaster residue, fine cement dust, and construction debris so your new building or newly renovated space is 100% ready for occupation.',
      suitableFor: [
        'Newly Constructed Residential Buildings',
        'Renovated Properties & Extensions',
        'Commercial Fit-Outs & Construction Projects',
        'Final Handover Cleaning Before Tenancy'
      ],
      included: [
        'Cement, plaster, and paint speck removal from floors and glass',
        'Heavy fine dust vacuuming and multi-pass surface wiping',
        'Sanitation of new fixtures, cabinets, and wardrobes',
        'Tile scrubbing and grout haze removal',
        'Final detailed inspection for immediate move-in'
      ]
    },
    {
      id: 'general',
      title: 'General Cleaning',
      subtitle: 'Routine upkeep to keep your environment pristine',
      price: settings.startingPrices.generalCleaning,
      icon: <Sparkles className="w-8 h-8 text-teal-600" />,
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
      description: 'Everyday upkeep to keep your space fresh, tidy, and organized. Ideal for regular scheduled maintenance visits.',
      suitableFor: [
        'Regular Home Upkeep',
        'Small Offices & Studios',
        'Single Rooms & Compounds',
        'Periodic Maintenance'
      ],
      included: [
        'Sweeping of compound and interior rooms',
        'Mopping of hard floors',
        'Dusting of accessible surfaces',
        'General organizing and straightening up',
        'Trash collection'
      ]
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Our Professional Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Comprehensive Cleaning Solutions
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Tailored cleaning services for homes, businesses, and newly completed properties across Bibiani, Diaso, Goaso, and Western North.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Section */}
              <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 bg-slate-100 group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-navyDark/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                    Starting from GH₵{service.price}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className={`lg:col-span-7 space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                        {service.title}
                      </h2>
                      <span className="text-xs sm:text-sm font-semibold text-brand-blue">
                        {service.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
                    {service.description}
                  </p>
                </div>

                {/* Suitable For & Inclusions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-2.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-brand-blue" />
                      Ideal For:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.suitableFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-brand-blue font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      What's Included:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {service.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/book?service=${encodeURIComponent(service.title)}`}
                    className="px-6 py-3 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-brand-cyan" />
                    <span>Request This Service</span>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl border border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Note on Custom Quotes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyLight text-white rounded-3xl p-8 sm:p-10 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need a Custom or Specialized Cleaning Plan?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We provide personalized quotations for recurring contracts, industrial sites, churches, schools, and large residential estates.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-xl bg-white text-brand-navy font-bold text-sm hover:bg-slate-100 transition-colors shrink-0 shadow-md flex items-center gap-2"
          >
            <span>Contact For Custom Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
