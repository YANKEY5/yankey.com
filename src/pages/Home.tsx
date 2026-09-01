import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Home as HomeIcon,
  Building2,
  SprayCan,
  HardHat,
  ChevronRight,
  Star,
  Users,
  Award
} from 'lucide-react';
import type { BusinessSettings, GalleryItem, Testimonial } from '../types';
import { BeforeAfterCard } from '../components/BeforeAfterCard';
import { getGalleryItems, getTestimonials } from '../services/adminService';

interface HomeProps {
  settings: BusinessSettings;
}

export const Home: React.FC<HomeProps> = ({ settings }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getGalleryItems().then((items) => setGallery(items.slice(0, 3)));
    getTestimonials(true).then((items) => setTestimonials(items));
  }, []);

  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I would like to request a cleaning service.'
  )}`;

  const servicesList = [
    {
      title: 'Residential Cleaning',
      icon: <HomeIcon className="w-6 h-6 text-brand-blue" />,
      desc: 'Complete cleaning for houses, apartments, bedrooms, kitchens, bathrooms, and rental properties.',
      price: settings.startingPrices.basicHome,
      badge: 'Most Popular',
      link: '/services'
    },
    {
      title: 'Commercial Cleaning',
      icon: <Building2 className="w-6 h-6 text-emerald-600" />,
      desc: 'Sanitation and maintenance for offices, shops, business premises, reception areas, and workspaces.',
      price: settings.startingPrices.commercial,
      badge: 'Business',
      link: '/services'
    },
    {
      title: 'Deep Cleaning',
      icon: <SprayCan className="w-6 h-6 text-indigo-600" />,
      desc: 'Intensive floor scrubbing, grout cleaning, appliances, hard-to-reach areas, and detailed sanitization.',
      price: settings.startingPrices.deepCleaning,
      badge: 'Thorough',
      link: '/services'
    },
    {
      title: 'Post-Construction Cleaning',
      icon: <HardHat className="w-6 h-6 text-amber-600" />,
      desc: 'Debris, paint specks, dust removal, and final handover cleaning for newly built or renovated properties.',
      price: settings.startingPrices.postConstruction,
      badge: 'Heavy Duty',
      link: '/services'
    }
  ];

  const whyChoosePoints = [
    {
      title: 'Reliable',
      desc: 'We respect agreed schedules and customer commitments with punctuality.',
      icon: <Clock className="w-6 h-6 text-brand-blue" />
    },
    {
      title: 'Professional',
      desc: 'We maintain professional standards in communication, ethics, and service delivery.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Affordable',
      desc: 'We provide competitive cleaning solutions with transparent starting rates.',
      icon: <Award className="w-6 h-6 text-indigo-600" />
    },
    {
      title: 'Quality',
      desc: 'We pay close attention to every detail, ensuring no corner is missed.',
      icon: <Sparkles className="w-6 h-6 text-amber-600" />
    },
    {
      title: 'Convenient',
      desc: 'Customers can easily request services through WhatsApp or our website booking.',
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Customer Focused',
      desc: 'We listen to customers and tailor our cleaning packages to your specific needs.',
      icon: <Users className="w-6 h-6 text-blue-600" />
    }
  ];

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Contact Us',
      desc: 'Send us a message or request a cleaning service online in just 2 minutes.'
    },
    {
      number: '02',
      title: 'Get a Quote',
      desc: 'We assess your cleaning needs, property size, and provide a clear quotation.'
    },
    {
      number: '03',
      title: 'We Clean',
      desc: 'Our trained cleaning team arrives on schedule and performs the agreed work.'
    },
    {
      number: '04',
      title: 'Enjoy Your Clean Space',
      desc: 'We inspect the work with you to ensure you are completely satisfied with the freshness.'
    }
  ];

  const faqItems = [
    {
      q: 'Do I need to provide cleaning equipment?',
      a: 'We bring our standard cleaning tools and supplies. If you have specific preferred detergents or machines for delicate surfaces, you are also welcome to let us know.'
    },
    {
      q: 'How much does cleaning cost?',
      a: `Our starting prices begin at GH₵${settings.startingPrices.basicHome} for basic home cleaning. Final prices vary based on property size, condition, and distance from Bibiani.`
    },
    {
      q: 'Do you operate outside Bibiani?',
      a: 'Yes! We actively serve Bibiani, Diaso, Goaso, and surrounding communities across the Western North Region.'
    },
    {
      q: 'How do I book a cleaning service?',
      a: 'You can book directly through our online booking form on this website or simply send us a message on WhatsApp at 055 873 6867.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden hero-gradient text-white pt-12 pb-20 sm:pt-20 sm:pb-32">
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Service Area Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-brand-cyan tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Serving Bibiani, Diaso, Goaso & Surrounding Communities</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                A Cleaner Space, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-brand-cyan via-blue-200 to-emerald-400 bg-clip-text text-transparent">
                  A Healthier You!
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Professional home and commercial cleaning services you can trust. We help busy individuals, families and businesses keep their spaces clean, fresh and welcoming.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-blue to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-base shadow-glow-blue hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>BOOK A CLEANING</span>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-glow-green hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>WHATSAPP US</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Reliable & Punctual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Residential & Commercial</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                    alt="Professional cleaning service in Bibiani"
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navyDark/90 via-transparent to-transparent" />
                  
                  {/* Overlay Floater */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block">
                        YANKEY Cleaning Team
                      </span>
                      <span className="text-sm font-semibold text-emerald-700">
                        Bibiani & Western North Region
                      </span>
                    </div>
                    <Link
                      to="/about"
                      className="p-2 rounded-xl bg-brand-blueLight text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
                      aria-label="Learn about YANKEY"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Badge Float */}
                <div className="absolute -top-4 -left-4 bg-emerald-600 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border-2 border-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / PROBLEM & SOLUTION OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block mb-1">
              Why We Started
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Giving You More Time For What Matters
            </h2>
          </div>
          <div className="lg:col-span-2 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            <p>
              Many people and businesses in Bibiani, Diaso, Goaso and Western North are busy with work and daily responsibilities, leaving little time to properly deep clean and maintain their homes or workplaces.
            </p>
            <p className="font-medium text-slate-800">
              <strong>YANKEY Home Cleaning and Services</strong> provides reliable, professional cleaning that saves you time while giving you a healthier, more comfortable environment.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR CLEANING SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-brand-blueLight text-brand-blue text-xs font-bold uppercase tracking-wider">
            Our Core Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Professional Cleaning Solutions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From routine home sweeps to deep commercial sanitization and post-construction cleaning, we do it all with care and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-slate-100 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {service.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {service.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-400 font-medium">Starting from:</span>
                  <span className="text-lg font-extrabold text-brand-navy">
                    GH₵{service.price}
                  </span>
                </div>

                <Link
                  to="/book"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-blue text-white text-xs font-bold transition-colors"
                >
                  <span>Request This Service</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-navy transition-colors"
          >
            <span>View All Detailed Services & Inclusions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. WHY CHOOSE YANKEY */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-brand-cyan text-xs font-bold uppercase tracking-wider">
              The YANKEY Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Choose YANKEY Home Cleaning
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              We stand out through integrity, consistent high quality, and customer-first commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoosePoints.map((pt, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700 hover:border-slate-500 transition-all group"
              >
                <div className="p-3 rounded-2xl bg-slate-700/60 w-fit mb-5 group-hover:scale-110 transition-transform">
                  {pt.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{pt.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BEFORE & AFTER GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Real Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight mt-2">
              Before & After Transformations
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              See the difference our thorough cleaning makes on real properties.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-navy transition-colors shrink-0"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gallery.map((item) => (
            <BeforeAfterCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 STEPS) */}
      <section className="bg-gradient-to-b from-brand-blueLight/50 to-white py-16 sm:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-brand-blue text-white text-xs font-bold uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Getting your home or commercial premises cleaned is quick, transparent, and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {howItWorksSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="text-4xl font-black text-brand-blue/20 mb-4 group-hover:text-brand-blue transition-colors">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white font-bold text-sm shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-brand-cyan" />
              <span>Get Started & Book Online</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SERVICE AREAS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy via-brand-navyLight to-brand-navy text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
              Locations Covered
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Serving Bibiani & Across Western North Region
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Our main head office is located in Bibiani. We also readily travel to serve homes and businesses in Diaso, Goaso, and surrounding communities.
            </p>
            <p className="text-xs text-slate-400 italic">
              * Note: For locations outside the core Bibiani area, transparent transportation charges may apply based on distance.
            </p>

            <div className="pt-2">
              <Link
                to="/service-areas"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-navy font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                <span>Explore Service Areas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
            {settings.serviceAreas.map((area, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{area}</h4>
                  <span className="text-xs text-slate-300">Cleaning Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Honest reviews from customers who have experienced the YANKEY standard of cleanliness.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto shadow-soft border border-slate-100 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Reviews in Progress</h3>
            <p className="text-slate-500 text-sm italic">
              “Our customer reviews will appear here as we serve more customers.”
            </p>
            <p className="text-xs text-slate-400">
              Have we cleaned for you recently? Leave your feedback to help us grow!
            </p>
            <Link
              to="/contact"
              className="inline-block pt-2 text-xs font-bold text-brand-blue hover:underline"
            >
              Submit Your Review →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic mb-4">“{t.review}”</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{t.customerName}</span>
                  <span className="text-slate-400">{t.serviceReceived}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 9. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-brand-blueLight text-brand-blue text-xs font-bold uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100"
            >
              <h3 className="text-base font-bold text-brand-navy mb-2">{item.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-brand-navy transition-colors"
          >
            <span>View All Frequently Asked Questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-brand-navy via-brand-blue to-blue-700 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Let Us Make Your Space Shine Today
            </h2>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
              Experience the fresh and healthy difference of YANKEY Home Cleaning and Services. Call us or request a free quote online.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/book"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-brand-navy font-extrabold text-sm hover:bg-slate-100 shadow-lg transition-all"
              >
                REQUEST CLEANING NOW
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
