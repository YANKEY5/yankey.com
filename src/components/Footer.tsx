import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  Lock
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to request a cleaning service.'
  )}`;

  return (
    <footer className="bg-brand-navyDark text-slate-300 border-t border-slate-800">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navyLight border-b border-slate-700/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bibiani • Diaso • Goaso • Western North</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready for a sparkling clean space?
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Book professional home or commercial cleaning today and enjoy a healthier, fresher environment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/25"
            >
              <span>Book Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight">YANKEY</span>
                <span className="block text-xs uppercase font-semibold text-brand-cyan">
                  Home Cleaning & Services
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm italic font-medium">
              “{settings.tagline}”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Professional, reliable, and thorough cleaning services for homes, apartments, offices, and commercial properties across Western North Region, Ghana.
            </p>
            <div className="pt-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Founder: {settings.founder}</p>
              <p className="text-slate-400">Head Office: {settings.headOffice}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-blue pl-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us & Founder
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors">
                  Cleaning Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link to="/service-areas" className="text-slate-400 hover:text-white transition-colors">
                  Service Areas
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-white transition-colors">
                  Before & After Results
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Cleaning Services List */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Residential Home Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Commercial & Office Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Deep Space Sanitation
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  Post-Construction Clean-Up
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  General Routine Cleaning
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-emerald-400 transition-colors">
                  Custom Cleaning Quotation
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mt-6 mb-2 text-slate-300">
              Service Locations:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {settings.serviceAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-cyan pl-2">
              Contact Us Direct
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
                className="flex items-start gap-2.5 text-slate-300 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-brand-blue shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block font-medium">{settings.phone1}</span>
                  <span className="text-xs text-slate-400">Primary Phone / WhatsApp</span>
                </div>
              </a>

              <a
                href={`tel:${settings.phone2.replace(/\s+/g, '')}`}
                className="flex items-start gap-2.5 text-slate-300 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block font-medium">{settings.phone2}</span>
                  <span className="text-xs text-slate-400">Secondary Hotline</span>
                </div>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-2.5 text-slate-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="block font-medium break-all">{settings.email}</span>
                  <span className="text-xs text-slate-400">Official Business Email</span>
                </div>
              </a>

              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <div>
                  <span className="block font-medium">Bibiani, Ghana</span>
                  <span className="text-xs text-slate-400">Western North Region</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-brand-cyan shrink-0 mt-1" />
                <div>
                  <span className="block text-xs font-medium text-slate-300 leading-snug">
                    {settings.businessHours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 YANKEY Home Cleaning and Services. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="text-slate-400">Bibiani, Ghana</span>
            <span>•</span>
            <Link to="/admin" className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
