import React, { useState } from 'react';
import { Sparkles, MapPin, Tag } from 'lucide-react';
import type { GalleryItem } from '../types';

interface BeforeAfterCardProps {
  item: GalleryItem;
}

export const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({ item }) => {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-slate-100 flex flex-col group">
      {/* Image Container with Toggle Controls */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden select-none">
        <img
          src={showAfter ? item.afterImageUrl : item.beforeImageUrl}
          alt={`${item.serviceType} cleaning result`}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105 transform duration-500"
          loading="lazy"
        />

        {/* State Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md ${
              showAfter
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {showAfter ? '✨ AFTER CLEANING' : '⚠️ BEFORE CLEANING'}
          </span>
        </div>

        {/* Interactive View Toggle Buttons */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex justify-center">
          <div className="inline-flex rounded-xl p-1 bg-black/60 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setShowAfter(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !showAfter
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white hover:text-slate-200'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showAfter
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-white hover:text-slate-200'
              }`}
            >
              After
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-navy bg-brand-blueLight px-2.5 py-1 rounded-md">
              <Tag className="w-3 h-3 text-brand-blue" />
              {item.serviceType}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 text-rose-400" />
              {item.location}
            </span>
          </div>

          <p className="text-slate-700 text-sm font-medium mt-1 leading-snug">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Job Result
          </span>
          <span>Click buttons to compare</span>
        </div>
      </div>
    </div>
  );
};
