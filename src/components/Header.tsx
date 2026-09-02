import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  Calendar
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface HeaderProps {
  settings: BusinessSettings;
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Service Areas', path: '/service-areas' },
    { name: 'Before & After', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to request a cleaning service.'
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 shadow-xs transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-brand-navy text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
              Serving Bibiani, Diaso, Goaso & Western North Region
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium">{settings.businessHours}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-brand-cyan transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone1}</span>
            </a>
            <span className="text-slate-400">|</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-navy to-brand-blue flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-7 h-7 text-brand-cyan" />
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-brand-navy tracking-tight group-hover:text-brand-blue transition-colors">
                YANKEY
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-blue">
                Home Cleaning & Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-brand-blue bg-brand-blueLight/60 font-semibold'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Cleaning</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/book"
              className="sm:hidden px-3.5 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold shadow-xs"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-blue bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <a
              href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm"
            >
              <Phone className="w-4 h-4 text-brand-navy" />
              <span>Call: {settings.phone1}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-navy text-white font-bold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4 text-brand-cyan" />
              <span>Request Cleaning Online</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
