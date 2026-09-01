import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import type { BusinessSettings } from '../types';

interface MobileStickyBarProps {
  settings: BusinessSettings;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ settings }) => {
  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to request a cleaning service.'
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl md:hidden px-3 py-2">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy active:scale-95 transition-all text-center"
        >
          <Phone className="w-4 h-4 text-brand-blue mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight uppercase">Call Now</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95 transition-all text-center"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight uppercase">WhatsApp</span>
        </a>

        {/* Book Now Button */}
        <Link
          to="/book"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-brand-blue to-blue-700 text-white shadow-xs active:scale-95 transition-all text-center"
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight uppercase">Book Now</span>
        </Link>
      </div>
    </div>
  );
};
