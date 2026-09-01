import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar } from 'lucide-react';
import type { GalleryItem, BusinessSettings } from '../types';
import { BeforeAfterCard } from '../components/BeforeAfterCard';
import { getGalleryItems } from '../services/adminService';

interface GalleryProps {
  settings: BusinessSettings;
}

export const Gallery: React.FC<GalleryProps> = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleryItems().then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'Residential', 'Commercial', 'Deep Cleaning', 'Post-Construction'];

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.serviceType.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Real Proof of Quality
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Before & After Gallery
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Take a look at the real-life transformations achieved by YANKEY Home Cleaning and Services across Bibiani and Western North.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeFilter === cat
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading gallery transformations...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-100 max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700">No images in this category yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Check back soon as we continuously document our latest completed jobs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <BeforeAfterCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-brand-navy to-brand-blue text-white rounded-3xl p-8 sm:p-12 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Ready to see this transformation in your own space?
            </h3>
            <p className="text-slate-200 text-sm">
              Schedule your cleaning service online or request a quick estimate.
            </p>
          </div>
          <Link
            to="/book"
            className="px-6 py-3.5 rounded-xl bg-white text-brand-navy font-bold text-sm hover:bg-slate-100 transition-colors shadow-md shrink-0 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-blue" />
            <span>Book Your Space Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
