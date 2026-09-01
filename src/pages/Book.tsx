import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Home,
  Building2,
  SprayCan,
  HardHat,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  MessageSquare,
  Copy,
  Check,
  ShieldCheck,
  Info,
  Phone
} from 'lucide-react';
import type { BusinessSettings, Booking } from '../types';
import { submitBooking } from '../services/bookingService';

interface BookProps {
  settings: BusinessSettings;
}

export const Book: React.FC<BookProps> = ({ settings }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Form State
  const [service, setService] = useState<string>('Residential Cleaning');
  const [propertyType, setPropertyType] = useState<string>('Apartment / Flat');
  const [numberOfRooms, setNumberOfRooms] = useState<string>('2 Bedrooms');
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<string>('1 Bathroom');
  const [approximateSize, setApproximateSize] = useState<string>('Medium Space');
  const [cleaningCondition, setCleaningCondition] = useState<string>('Normal Dirt (Routine)');
  
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('08:00 AM - 11:00 AM');
  const [alternativeDate, setAlternativeDate] = useState<string>('');
  
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [locationArea, setLocationArea] = useState<string>('Bibiani');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const serviceOptions = [
    {
      id: 'residential',
      title: 'Residential Cleaning',
      desc: 'Homes, apartments, bedrooms, living rooms, and private compounds.',
      icon: <Home className="w-5 h-5 text-brand-blue" />,
      basePrice: settings.startingPrices.basicHome
    },
    {
      id: 'standard',
      title: 'Standard Home Package',
      desc: 'Full routine cleaning for 2-4 room houses and residences.',
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      basePrice: settings.startingPrices.standardHome
    },
    {
      id: 'deep',
      title: 'Deep Cleaning',
      desc: 'Heavy floor scrub, tile grout, grease removal, detailed sanitizing.',
      icon: <SprayCan className="w-5 h-5 text-indigo-600" />,
      basePrice: settings.startingPrices.deepCleaning
    },
    {
      id: 'commercial',
      title: 'Commercial & Office',
      desc: 'Workspaces, business premises, shops, clinics, reception areas.',
      icon: <Building2 className="w-5 h-5 text-purple-600" />,
      basePrice: settings.startingPrices.commercial
    },
    {
      id: 'post-construction',
      title: 'Post-Construction Cleaning',
      desc: 'Handover clean-up, paint speck scraping, cement residue removal.',
      icon: <HardHat className="w-5 h-5 text-amber-600" />,
      basePrice: settings.startingPrices.postConstruction
    }
  ];

  // Dynamic Price Estimation calculation
  const calculateEstimatedTotal = (): number => {
    let base = settings.startingPrices.basicHome;
    if (service === 'Standard Home Package') base = settings.startingPrices.standardHome;
    if (service === 'Deep Cleaning') base = settings.startingPrices.deepCleaning;
    if (service === 'Commercial & Office') base = settings.startingPrices.commercial;
    if (service === 'Post-Construction Cleaning') base = settings.startingPrices.postConstruction;

    let roomMultiplier = 0;
    if (numberOfRooms === '3 Bedrooms') roomMultiplier = 50;
    if (numberOfRooms === '4 Bedrooms') roomMultiplier = 90;
    if (numberOfRooms === '5+ Bedrooms / Large House') roomMultiplier = 140;

    let conditionMultiplier = 1;
    if (cleaningCondition.includes('Moderate')) conditionMultiplier = 1.2;
    if (cleaningCondition.includes('Heavy')) conditionMultiplier = 1.45;

    return Math.round((base + roomMultiplier) * conditionMultiplier);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotoFiles((prev) => [...prev, ...filesArray].slice(0, 5));
      
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const removePhoto = (idx: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateStep = (currentStep: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!service) errors.service = 'Please select a cleaning service.';
    }

    if (currentStep === 2) {
      if (!propertyType) errors.propertyType = 'Property type is required.';
      if (!numberOfRooms) errors.numberOfRooms = 'Number of rooms is required.';
    }

    if (currentStep === 3) {
      if (!preferredDate) errors.preferredDate = 'Please select your preferred cleaning date.';
      if (!preferredTime) errors.preferredTime = 'Please select a preferred time window.';
    }

    if (currentStep === 4) {
      if (!fullName.trim()) errors.fullName = 'Full name is required.';
      if (!phone.trim()) errors.phone = 'Valid Ghana phone number is required.';
      if (!locationArea) errors.locationArea = 'Please select your service area.';
      if (!streetAddress.trim()) errors.streetAddress = 'Landmark or street address is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const estimatedPrice = calculateEstimatedTotal();
      const combinedLocation = `${streetAddress.trim()}, ${locationArea}`;

      const bookingPayload = {
        customerInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          email: email.trim(),
          location: combinedLocation
        },
        service,
        propertyInfo: {
          propertyType,
          numberOfRooms,
          numberOfBathrooms,
          approximateSize,
          cleaningCondition
        },
        schedule: {
          preferredDate,
          preferredTime,
          alternativeDate: alternativeDate || undefined
        },
        specialInstructions: specialInstructions.trim() || undefined,
        estimatedPrice
      };

      const result = await submitBooking(bookingPayload, photoFiles);
      setSubmittedBooking(result);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit booking:', err);
      alert('Could not submit booking. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submittedBooking) {
      navigator.clipboard.writeText(submittedBooking.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const getConfirmationWhatsappUrl = (): string => {
    if (!submittedBooking) return '';
    const text = `Hello YANKEY Cleaning, I just submitted an online booking request!\n\n📋 *Reference:* ${submittedBooking.referenceNumber}\n👤 *Name:* ${submittedBooking.customerInfo.fullName}\n🧹 *Service:* ${submittedBooking.service}\n📍 *Location:* ${submittedBooking.customerInfo.location}\n📅 *Date:* ${submittedBooking.schedule.preferredDate} (${submittedBooking.schedule.preferredTime})\n💰 *Estimated Quote:* ~GH₵${submittedBooking.estimatedPrice}\n\nPlease confirm availability!`;
    return `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(text)}`;
  };

  // If already successfully submitted
  if (submittedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft-lg border border-slate-100 text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto shadow-glow-green">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Booking Request Received!
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Thank You, {submittedBooking.customerInfo.fullName}!
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
              We have received your cleaning request. Our team in Bibiani will review your requirements and contact you promptly.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Your Booking Reference Number
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-brand-navy tracking-wider">
                {submittedBooking.referenceNumber}
              </span>
              <button
                onClick={copyReference}
                className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition-colors shadow-xs"
                title="Copy reference number"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedRef && <p className="text-xs text-emerald-600 font-medium">Copied to clipboard!</p>}
          </div>

          {/* Booking Summary Box */}
          <div className="p-6 rounded-2xl bg-brand-blueLight/50 text-left border border-blue-100 space-y-3 text-xs sm:text-sm">
            <div className="font-bold text-brand-navy border-b border-blue-200/60 pb-2">
              Booking Summary:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-500 block">Service:</span>
                <strong>{submittedBooking.service}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Estimated Rate:</span>
                <strong className="text-brand-blue text-base">~ GH₵{submittedBooking.estimatedPrice}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Date & Time:</span>
                <span>{submittedBooking.schedule.preferredDate} ({submittedBooking.schedule.preferredTime})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span>{submittedBooking.customerInfo.location}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Property Spec:</span>
                <span>{submittedBooking.propertyInfo.propertyType}, {submittedBooking.propertyInfo.numberOfRooms}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Contact:</span>
                <span>{submittedBooking.customerInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="space-y-3 pt-2">
            <a
              href={getConfirmationWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Confirm via WhatsApp (Fastest Response)</span>
            </a>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Zero Obligation Until Confirmed
              </span>
              <span>•</span>
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setStep(1);
                }}
                className="text-brand-blue hover:underline font-semibold"
              >
                Submit Another Request
              </button>
              <span>•</span>
              <Link to="/" className="text-slate-600 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <section className="hero-gradient text-white py-14 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Quick & Hassle-Free
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Request A Cleaning Service
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
            Fill in the details below to receive a fast, transparent estimate and book your preferred date in Bibiani, Diaso, Goaso or Western North.
          </p>
        </div>
      </section>

      {/* Main Wizard Form Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Area (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
            {/* Step Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <span className={step >= 1 ? 'text-brand-blue font-bold' : ''}>1. Service</span>
                <span className={step >= 2 ? 'text-brand-blue font-bold' : ''}>2. Property</span>
                <span className={step >= 3 ? 'text-brand-blue font-bold' : ''}>3. Schedule</span>
                <span className={step >= 4 ? 'text-brand-blue font-bold' : ''}>4. Contact</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Choose Your Cleaning Service</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Select the service package that best fits your immediate cleaning requirements.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {serviceOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setService(opt.title)}
                        className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                          service === opt.title
                            ? 'border-brand-blue bg-blue-50/50 shadow-md ring-2 ring-brand-blue/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-100">
                              {opt.icon}
                            </div>
                            <span className="text-xs font-extrabold text-brand-navy bg-slate-100 px-2.5 py-1 rounded-full">
                              From GH₵{opt.basePrice}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-brand-navy text-base">{opt.title}</h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{opt.desc}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                          <span className={service === opt.title ? 'text-brand-blue font-bold' : 'text-slate-400'}>
                            {service === opt.title ? '✓ Selected Package' : 'Click to select'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {formErrors.service && (
                    <p className="text-xs text-rose-600 font-semibold">{formErrors.service}</p>
                  )}
                </div>
              )}

              {/* STEP 2: PROPERTY DETAILS */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Tell Us About Your Space</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      This enables us to assign the proper number of staff and specialized equipment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Property Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Property Type *
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        <option value="Apartment / Flat">Apartment / Flat</option>
                        <option value="Single Family House">Single Family House / Bungalow</option>
                        <option value="Compound House / Quarters">Compound House / Quarters</option>
                        <option value="Commercial Office / Store">Commercial Office / Store</option>
                        <option value="Newly Built / Renovated Site">Newly Built / Renovated Site</option>
                        <option value="Other Commercial Facility">Other Commercial Facility</option>
                      </select>
                    </div>

                    {/* Number of Rooms */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Number of Bedrooms / Main Rooms *
                      </label>
                      <select
                        value={numberOfRooms}
                        onChange={(e) => setNumberOfRooms(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        <option value="1 Bedroom / Studio">1 Bedroom / Studio</option>
                        <option value="2 Bedrooms">2 Bedrooms</option>
                        <option value="3 Bedrooms">3 Bedrooms</option>
                        <option value="4 Bedrooms">4 Bedrooms</option>
                        <option value="5+ Bedrooms / Large House">5+ Bedrooms / Large House</option>
                        <option value="Commercial Hall / Multiple Units">Commercial Hall / Multiple Units</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Number of Bathrooms / Toilets
                      </label>
                      <select
                        value={numberOfBathrooms}
                        onChange={(e) => setNumberOfBathrooms(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        <option value="1 Bathroom">1 Bathroom</option>
                        <option value="2 Bathrooms">2 Bathrooms</option>
                        <option value="3 Bathrooms">3 Bathrooms</option>
                        <option value="4+ Bathrooms">4+ Bathrooms</option>
                      </select>
                    </div>

                    {/* Cleaning Condition */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Current Cleaning Condition *
                      </label>
                      <select
                        value={cleaningCondition}
                        onChange={(e) => setCleaningCondition(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        <option value="Normal Dirt (Routine)">Normal Dirt (Regular maintenance)</option>
                        <option value="Moderate Dirt (Overdue clean)">Moderate Dirt (Overdue for a while)</option>
                        <option value="Heavy Soilage / Deep Grime">Heavy Soilage / Heavy Grime & Dust</option>
                        <option value="Post-Construction (Paint, Debris)">Post-Construction (Paint Specks & Debris)</option>
                      </select>
                    </div>
                  </div>

                  {/* Approximate Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Estimated Space Size
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Compact Space', 'Medium Space', 'Large Space'].map((sz) => (
                        <button
                          type="button"
                          key={sz}
                          onClick={() => setApproximateSize(sz)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                            approximateSize === sz
                              ? 'border-brand-blue bg-brand-blueLight text-brand-navy'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Select Schedule & Timing</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Choose your preferred date and window when our team can access the property.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Preferred Cleaning Date *
                      </label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                      {formErrors.preferredDate && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.preferredDate}</p>
                      )}
                    </div>

                    {/* Preferred Time Window */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Preferred Time Slot *
                      </label>
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        <option value="07:00 AM - 10:00 AM">Morning Early: 07:00 AM - 10:00 AM</option>
                        <option value="08:00 AM - 11:00 AM">Morning Standard: 08:00 AM - 11:00 AM</option>
                        <option value="11:00 AM - 02:00 PM">Midday: 11:00 AM - 02:00 PM</option>
                        <option value="02:00 PM - 05:00 PM">Afternoon: 02:00 PM - 05:00 PM</option>
                        <option value="Custom / Flexible Timing">Custom / Flexible Timing</option>
                      </select>
                    </div>

                    {/* Alternative Date */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Alternative Date (Optional fallback if first choice is booked)
                      </label>
                      <input
                        type="date"
                        value={alternativeDate}
                        onChange={(e) => setAlternativeDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Operational Notice */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Operating Days & Time:</span>
                      <span>{settings.businessHours}. For urgent emergency bookings, contact us directly via phone.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT INFORMATION & PHOTOS */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">Contact & Location Details</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Provide your location and phone number so our supervisor can confirm the appointment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kwame Mensah"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Primary Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 055 873 6867"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        WhatsApp Number (If different)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 059 574 0883"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. yourname@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                    </div>

                    {/* Service Area */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Town / Municipality *
                      </label>
                      <select
                        value={locationArea}
                        onChange={(e) => setLocationArea(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      >
                        {settings.serviceAreas.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                        <option value="Sefwi Wiawso">Sefwi Wiawso</option>
                        <option value="Bekwai / Subiri">Bekwai / Subiri</option>
                        <option value="Other Western North Location">Other Western North Location</option>
                      </select>
                    </div>

                    {/* Street Address / Landmark */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Street Address / Landmark *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Bibiani Total Filling Station"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                      />
                      {formErrors.streetAddress && (
                        <p className="text-xs text-rose-600 font-semibold mt-1">{formErrors.streetAddress}</p>
                      )}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Special Requests or Specific Areas of Attention
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Focus especially on kitchen grease and master bathroom tiles..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                    />
                  </div>

                  {/* Optional Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Optional: Upload Photos of the Space (Max 5 photos)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-slate-700">
                        Click to browse or drag photos here
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                    </div>

                    {photoPreviews.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {photoPreviews.map((preview, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full text-xs shadow-md opacity-90 hover:opacity-100"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Next: {step === 1 ? 'Property Specs' : step === 2 ? 'Schedule' : 'Contact Info'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-blue to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Booking Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Live Estimate & Info Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Estimator Card */}
            <div className="bg-gradient-to-br from-brand-navy to-brand-navyLight text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-brand-cyan tracking-wider block">
                    Real-Time Estimate
                  </span>
                  <h3 className="text-xl font-bold text-white">Price Calculation</h3>
                </div>
                <div className="p-2 rounded-xl bg-white/10 text-brand-cyan">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Selected Service:</span>
                  <span className="font-bold text-white text-right">{service}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Rooms:</span>
                  <span className="font-medium text-slate-200">{numberOfRooms}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Condition Factor:</span>
                  <span className="font-medium text-slate-200">{cleaningCondition.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Target Area:</span>
                  <span className="font-medium text-slate-200">{locationArea}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/60">
                <span className="text-xs text-slate-400 block uppercase tracking-wider">
                  Estimated Total Starting At:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-brand-cyan mt-1">
                  ~ GH₵{calculateEstimatedTotal()}
                </div>
                <p className="text-[11px] text-slate-300 mt-2 leading-tight">
                  * Final pricing may be tailored based on on-site inspection or special requirements.
                </p>
              </div>

              {/* Instant WhatsApp Quick Reach */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                    `Hello YANKEY Cleaning, I am looking to book ${service} in ${locationArea}. Could you assist me with scheduling?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask a Question on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Why Book With Us Guarantee Card */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 space-y-4 text-xs sm:text-sm">
              <h4 className="font-bold text-brand-navy uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                Our Service Guarantee
              </h4>
              <ul className="space-y-2.5 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Satisfaction:</strong> If any spot is missed, we will rectify it promptly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Trained & Vetted Staff:</strong> Trustworthy, punctual, and respectful cleaners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Transparent Rates:</strong> No hidden surprise fees upon arrival.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-4 h-4 text-brand-blue" />
                <span>Call Hotline: <strong>{settings.phone1}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
