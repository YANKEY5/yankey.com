import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { BusinessSettings, ContactMessage } from '../types';
import { saveContactMessage } from '../services/adminService';

interface ContactProps {
  settings: BusinessSettings;
}

export const Contact: React.FC<ContactProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const whatsappUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
    'Hello YANKEY Home Cleaning and Services. I am contacting you through your official website.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const newMsg: ContactMessage = {
        id: 'msg-' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        status: 'New',
        createdAt: new Date().toISOString()
      };

      await saveContactMessage(newMsg);
      setSubmittedSuccess(true);

      const waText = `Hello YANKEY Home Cleaning! My name is ${name.trim()} (${phone.trim()}).\n\n*Message:* ${message.trim()}`;
      const waUrl = `https://wa.me/233${settings.phone1.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(waText)}`;
      
      setTimeout(() => {
        try {
          window.open(waUrl, '_blank');
        } catch {}
      }, 500);

      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error('Failed to submit contact message:', err);
      setErrorMessage('Failed to send message. Please reach out to us directly via WhatsApp or phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Header Banner */}
      <section className="hero-gradient text-white py-16 sm:py-24 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="px-3.5 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contact YANKEY Cleaning
          </h1>
          <p className="text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Have questions about our cleaning packages, need an urgent appointment, or want to schedule commercial cleaning in Western North? We are here to help.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider block">
                Direct Communication
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">
                We're Always Ready To Assist You
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Reach out through any of our channels below for quick support, advice, or schedule adjustments.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              {/* Primary Phone */}
              <a
                href={`tel:${settings.phone1.replace(/\s+/g, '')}`}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:border-brand-blue transition-all group"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-brand-blue group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Primary Hotline</span>
                  <span className="font-bold text-slate-800 text-base group-hover:text-brand-blue transition-colors">
                    {settings.phone1}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">Calls & Mobile Consultations</span>
                </div>
              </a>

              {/* WhatsApp Direct */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-emerald-200 shadow-soft hover:border-emerald-500 transition-all group"
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-600 block">WhatsApp Chat</span>
                  <span className="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors">
                    Chat with Joshua Yankey
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">Instant quotes, photos & inquiries</span>
                </div>
              </a>

              {/* Secondary Phone */}
              <a
                href={`tel:${settings.phone2.replace(/\s+/g, '')}`}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:border-brand-blue transition-all group"
              >
                <div className="p-3 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Secondary Hotline</span>
                  <span className="font-bold text-slate-800 text-base">{settings.phone2}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Backup / Alternate line</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.email}`}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:border-brand-blue transition-all group"
              >
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Official Email</span>
                  <span className="font-bold text-slate-800 text-base break-all">{settings.email}</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Invoicing, contracts & formal quotes</span>
                </div>
              </a>

              {/* Office & Hours */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Head Office:</span>
                    <span className="text-xs text-slate-600">{settings.headOffice}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60">
                  <Clock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">Business Hours:</span>
                    <span className="text-xs text-slate-600 leading-snug">{settings.businessHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-slate-100">
            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider">
                Send A Message
              </span>
              <h2 className="text-2xl font-bold text-brand-navy mt-2">Write To Our Team</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Fill out the form below and we will respond via call, WhatsApp or email within a few hours.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">Message Sent Successfully!</h3>
                  <p className="text-emerald-700 text-sm mt-1">
                    Thank you for reaching out to YANKEY Home Cleaning. Our team in Bibiani has received your note and will contact you promptly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Darko"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 055 873 6867"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. samuel@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your cleaning requirements, questions about pricing, or property location in Western North..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
