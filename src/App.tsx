import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Pricing } from './pages/Pricing';
import { ServiceAreas } from './pages/ServiceAreas';
import { Gallery } from './pages/Gallery';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Book } from './pages/Book';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import type { BusinessSettings } from './types';
import { getBusinessSettings } from './services/settingService';
import { defaultSettings } from './services/mockData';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Component Shell
const AppLayout: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    getBusinessSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLoading(false);
    });
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-brand-navy tracking-tight">Loading YANKEY Cleaning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-brand-blue selection:text-white">
      <ScrollToTop />

      {/* Main Public Header */}
      {!isAdminRoute && <Header settings={settings} />}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/about" element={<About settings={settings} />} />
          <Route path="/services" element={<Services settings={settings} />} />
          <Route path="/pricing" element={<Pricing settings={settings} />} />
          <Route path="/service-areas" element={<ServiceAreas settings={settings} />} />
          <Route path="/gallery" element={<Gallery settings={settings} />} />
          <Route path="/faq" element={<FAQ settings={settings} />} />
          <Route path="/contact" element={<Contact settings={settings} />} />
          <Route path="/book" element={<Book settings={settings} />} />
          <Route
            path="/admin"
            element={<Admin settings={settings} onSettingsUpdate={setSettings} />}
          />
          <Route path="/login" element={<Login settings={settings} />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Home settings={settings} />} />
        </Routes>
      </main>

      {/* Main Public Footer */}
      {!isAdminRoute && <Footer settings={settings} />}

      {/* Mobile Sticky Quick Action Bar */}
      {!isAdminRoute && <MobileStickyBar settings={settings} />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
