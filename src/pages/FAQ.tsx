import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquare,
  Calendar
} from 'lucide-react';
import type { BusinessSettings } from '../types';

interface FAQProps {
  settings: BusinessSettings;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC<FAQProps> = ({ settings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndices, setOpenIndices] = useState<{ [key: number]: boolean }>({ 0: true });

  const categories = [
    'All',
    'General & Services',
    'Pricing & Payment',
    'Booking & Schedule',
    'Service Areas',
    'Trust & Safety'
  ];

  const faqList: FAQItem[] = [
    {
      category: 'General & Services',
      question: 'What cleaning services does YANKEY provide?',
      answer: 'We provide residential cleaning (apartments, bungalows, compound houses), deep cleaning (intensive floor scrubbing, tile grout, and grease sanitation), commercial and office cleaning, post-construction / post-renovation cleaning, and routine general cleaning.'
    },
    {
      category: 'General & Services',
      question: 'Do you bring your own cleaning detergents and equipment?',
      answer: 'Yes! Our cleaning technicians arrive fully equipped with professional cleaning supplies, disinfectants, floor polishers/scrubbers, vacuum cleaners, and protective gear. If you prefer us to use specific client-provided solutions, we can gladly accommodate your preference.'
    },
    {
      category: 'General & Services',
      question: 'What is the difference between standard cleaning and deep cleaning?',
      answer: 'Standard cleaning handles routine maintenance: sweeping, dusting accessible surfaces, mopping, washing basic bathroom facilities, and wiping kitchen exterior surfaces. Deep cleaning involves heavy tile scrubbing, descaling lime deposits, sanitizing inside appliances upon request, baseboards, behind large furniture, and removing stubborn dirt build-up.'
    },
    {
      category: 'Pricing & Payment',
      question: 'How are your cleaning prices calculated?',
      answer: `Our prices start from GH₵${settings.startingPrices.basicHome} for basic residential apartments and vary based on space size (number of rooms/bathrooms), property condition, and required service type. You can use our online price calculator or request a custom quote for an exact quote.`
    },
    {
      category: 'Pricing & Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Mobile Money (MTN MoMo, Telecel Cash, AT Money), direct bank transfers, and cash payments upon completed job inspection and customer approval.'
    },
    {
      category: 'Pricing & Payment',
      question: 'Do you provide formal invoices or quotations for businesses?',
      answer: 'Yes, we provide official branded quotations and invoices complete with itemized breakdowns for corporate offices, shops, institutions, and residential clients.'
    },
    {
      category: 'Booking & Schedule',
      question: 'How far in advance should I book a cleaning appointment?',
      answer: 'We recommend booking 24 to 48 hours in advance to guarantee your preferred time slot. However, we also do our best to accommodate same-day or emergency requests within Bibiani based on crew availability.'
    },
    {
      category: 'Booking & Schedule',
      question: 'Do I need to be present while the cleaners work?',
      answer: 'You do not have to be present the entire time. Many of our clients let our supervisor into the property, leave for work or errands, and return for the final inspection before handover. Our staff are vetted, reliable, and closely supervised.'
    },
    {
      category: 'Booking & Schedule',
      question: 'Can I reschedule or cancel my booking?',
      answer: 'Yes. We ask that you notify us at least 12 hours prior to the scheduled start time via WhatsApp or phone call so we can adjust the crew schedule without hassle.'
    },
    {
      category: 'Service Areas',
      question: 'Which towns and regions do you serve?',
      answer: `We are based in Bibiani and provide active daily cleaning coverage across Bibiani, Diaso, Goaso, Sefwi Wiawso, Bekwai, and surrounding communities throughout the Western North Region.`
    },
    {
      category: 'Service Areas',
      question: 'Is there a transportation fee for locations outside Bibiani town?',
      answer: 'Within central Bibiani town, standard travel is included. For surrounding towns like Diaso, Goaso, or further districts, a modest transparent transportation allowance is included directly in your quotation upfront.'
    },
    {
      category: 'Trust & Safety',
      question: 'Are your cleaners vetted and trustworthy?',
      answer: 'Absolutely. Every team member undergoes background checks, reference verification, and intensive training on safety, customer confidentiality, and respect for client property. Joshua Yankey or a designated supervisor oversees all major operations.'
    },
    {
      category: 'Trust & Safety',
      question: 'What happens if I am not completely satisfied with the cleaning?',
      answer: 'Customer satisfaction is our utmost priority. If any designated area does not meet your expectations, notify our team supervisor during or immediately after the job, and we will reclean that spot promptly at no extra charge.'
    }
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello Joshua Yankey. I have a question about YANKEY Home Cleaning services that was not on the website.'
  )}`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Help & Answers
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Find immediate answers about our cleaning packages, pricing, coverage areas across Western North, and service procedures.
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions (e.g. pricing, Bibiani, deep cleaning, chemicals)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 text-sm font-medium shadow-lg focus:outline-hidden focus:ring-2 focus:ring-brand-cyan"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter & FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = !!openIndices[idx];
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-brand-navy hover:text-brand-blue transition-colors select-none"
                  >
                    <span className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-brand-blue' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-brand-cyan">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-brand-blue">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
              <p className="text-base font-semibold">No questions matched your search query "{searchQuery}".</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-brand-blue font-bold hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyLight text-white rounded-3xl p-8 sm:p-10 shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold text-brand-cyan tracking-wider">
              Need Personal Assistance?
            </span>
            <h3 className="text-2xl font-bold text-white">Have a specific or custom cleaning request?</h3>
            <p className="text-slate-300 text-sm max-w-md">
              Chat directly with Joshua Yankey or call our hotline for immediate advice and scheduling.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Online</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
