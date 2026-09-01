import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Target,
  Globe2,
  UserCheck,
  HeartHandshake,
  CheckCircle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface AboutProps {
  settings: BusinessSettings;
}

export const About: React.FC<AboutProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello Joshua Yankey. I would like to learn more about YANKEY Home Cleaning and Services.'
  )}`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Our Story & Purpose
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            About YANKEY Home Cleaning & Services
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
            “{settings.tagline}”
          </p>
        </div>
      </section>

      {/* Main Story & Problem Solved */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
              Who We Are & Why We Were Created
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              A Passion For Clean, Healthy & Welcoming Spaces
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>YANKEY Home Cleaning and Services</strong> was founded in Bibiani, Western North Region of Ghana, with a clear understanding of modern challenges: many individuals, families, and business owners have demanding schedules and simply do not have sufficient time or equipment to thoroughly clean and sanitize their spaces.
              </p>
              <p>
                A dirty or cluttered environment causes unnecessary stress, health concerns, and reduced productivity. We stepped in to provide professional, dependable, and thorough cleaning services that eliminate that burden for our clients.
              </p>
              <p>
                Whether it is your residential home, newly constructed property, office, or commercial workspace, we bring energy, care, and attention to detail to make your environment pristine and refreshing.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Bibiani Head Office
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Western North Coverage
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Reliable Service
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80"
                alt="YANKEY cleaning standards in Ghana"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navyDark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold text-brand-cyan block">Our Motto</span>
                <p className="text-lg font-bold">A Cleaner Space, A Healthier You!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-slate-100/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center md:text-left">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-brand-navy to-brand-blue flex items-center justify-center text-white mx-auto md:mx-0 shadow-lg mb-4">
                <UserCheck className="w-16 h-16 text-brand-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy">{settings.founder}</h3>
              <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mt-0.5">
                Founder & Lead Operator
              </p>
              <p className="text-xs text-slate-500 mt-1">YANKEY Home Cleaning and Services</p>
            </div>

            <div className="md:col-span-8 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
              <h4 className="text-xl font-bold text-brand-navy">Message From The Founder</h4>
              <p>
                “I started YANKEY Home Cleaning and Services with a simple but powerful goal: to provide honest, dependable, and high-quality cleaning that people can genuinely trust. We respect our clients' time, privacy, and properties.”
              </p>
              <p>
                “Every home and office we clean is treated with the highest level of care. We are committed to building long-term relationships with the good people and businesses of Bibiani, Diaso, Goaso, and across Ghana.”
              </p>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Standards & Commitment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-brand-blueLight text-brand-blue text-xs font-bold uppercase tracking-wider">
            Our Work Ethics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Commitment & Professional Standards
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We adhere strictly to core business principles that guarantee peace of mind for every customer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-brand-blue w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Integrity & Respect</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We treat our customers' personal spaces, equipment, and furnishings with utmost confidentiality and respect.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Customer Satisfaction</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We review every completed cleaning job with our clients to verify all agreed tasks have been thoroughly executed.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 space-y-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Punctual & Disciplined</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We arrive on time as scheduled and work efficiently without disrupting your personal or commercial activities.
            </p>
          </div>
        </div>
      </section>

      {/* Vision For The Future */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>Our Long-Term Vision</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Growing From Bibiani to Across Ghana & Beyond
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Our long-term vision is to grow YANKEY Home Cleaning and Services into one of the leading and most trusted professional cleaning companies in Ghana, setting the benchmark for hygiene, reliability, and modern cleaning standards.
            </p>
          </div>

          <Link
            to="/book"
            className="px-6 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm shrink-0 shadow-md transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book A Service Today</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
