import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  DollarSign,
  TrendingUp,
  CreditCard,
  Check,
  ArrowRight,
  Database,
  CloudOff,
  AlertTriangle
} from 'lucide-react';
import { isFirebaseConfigured, firebaseConfigStatus } from '../firebase';
import type {
  BusinessSettings,
  Booking,
  BookingStatus,
  Staff,
  Customer,
  Quotation,
  Invoice,
  ContactMessage,
  AdminUser
} from '../types';
import {
  getBookings,
  updateBookingStatus,
  assignStaffToBooking
} from '../services/bookingService';
import {
  getStaffList,
  saveStaffMember,
  getCustomers,
  getQuotations,
  saveQuotation,
  getInvoices,
  saveInvoice,
  getContactMessages,
  updateContactMessageStatus
} from '../services/adminService';
import { updateBusinessSettings } from '../services/settingService';
import { getCurrentAdmin, logoutAdmin } from '../services/authService';

interface AdminProps {
  settings: BusinessSettings;
  onSettingsUpdate: (newSettings: BusinessSettings) => void;
}

export const Admin: React.FC<AdminProps> = ({ settings, onSettingsUpdate }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'billing' | 'staff' | 'customers' | 'messages' | 'settings'>('dashboard');
  
  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Booking for Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Document for Printable View (Quotation or Invoice)
  const [printableDoc, setPrintableDoc] = useState<{
    type: 'quotation' | 'invoice';
    data: Quotation | Invoice;
  } | null>(null);

  // Modals
  const [showNewStaffModal, setShowNewStaffModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPosition, setNewStaffPosition] = useState('Cleaner');

  // New Quote Form State
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState('');
  const [quoteLocation, setQuoteLocation] = useState('Bibiani');
  const [quoteService, setQuoteService] = useState('Residential Cleaning');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteLabor, setQuoteLabor] = useState(150);
  const [quoteMaterials, setQuoteMaterials] = useState(30);
  const [quoteTransport, setQuoteTransport] = useState(20);
  const [quoteDiscount, setQuoteDiscount] = useState(0);

  // New Invoice Form State
  const [invCustomerName, setInvCustomerName] = useState('');
  const [invCustomerPhone, setInvCustomerPhone] = useState('');
  const [invLocation, setInvLocation] = useState('Bibiani');
  const [invService, setInvService] = useState('Residential Cleaning');
  const [invAmount, setInvAmount] = useState(200);
  const [invPaymentMethod, setInvPaymentMethod] = useState<'Cash' | 'Mobile Money' | 'Bank Transfer'>('Mobile Money');

  // Business Settings Local Form State
  const [settingsForm, setSettingsForm] = useState<BusinessSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  useEffect(() => {
    const admin = getCurrentAdmin();
    if (!admin) {
      navigate('/login');
      return;
    }
    setCurrentUser(admin);
    loadAllData();
  }, [navigate]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [bk, stf, cust, quot, inv, msg] = await Promise.all([
        getBookings(),
        getStaffList(),
        getCustomers(),
        getQuotations(),
        getInvoices(),
        getContactMessages()
      ]);
      setBookings(bk);
      setStaffList(stf);
      setCustomers(cust);
      setQuotations(quot);
      setInvoices(inv);
      setMessages(msg);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/login');
  };

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBookingStatus(bookingId, newStatus);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  const handleAssignStaff = async (bookingId: string, staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;
    await assignStaffToBooking(bookingId, staff.id, staff.name);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, assignedStaffId: staff.id, assignedStaffName: staff.name, status: 'Assigned' }
          : b
      )
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
        status: 'Assigned'
      });
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffPhone.trim()) return;

    const newStaff: Staff = {
      id: 'stf-' + Date.now(),
      name: newStaffName.trim(),
      phone: newStaffPhone.trim(),
      position: newStaffPosition,
      status: 'Active',
      assignedJobs: 0,
      completedJobs: 0
    };

    await saveStaffMember(newStaff);
    setStaffList((prev) => [...prev, newStaff]);
    setNewStaffName('');
    setNewStaffPhone('');
    setShowNewStaffModal(false);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = quoteLabor + quoteMaterials + quoteTransport - quoteDiscount;
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newQuote: Quotation = {
      id: 'qt-' + Date.now(),
      quotationNumber: `QT-${dateStr}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: quoteCustomerName,
      customerPhone: quoteCustomerPhone,
      location: quoteLocation,
      service: quoteService,
      description: quoteDesc,
      laborCost: quoteLabor,
      materialsCost: quoteMaterials,
      transportation: quoteTransport,
      additionalCharges: 0,
      discount: quoteDiscount,
      total,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    await saveQuotation(newQuote);
    setQuotations((prev) => [newQuote, ...prev]);
    setShowNewQuoteModal(false);
    setPrintableDoc({ type: 'quotation', data: newQuote });
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const newInv: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-${dateStr}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: invCustomerName,
      customerPhone: invCustomerPhone,
      location: invLocation,
      service: invService,
      date: new Date().toISOString().split('T')[0],
      amount: invAmount,
      paymentStatus: 'Paid',
      paymentMethod: invPaymentMethod,
      createdAt: new Date().toISOString()
    };

    await saveInvoice(newInv);
    setInvoices((prev) => [newInv, ...prev]);
    setShowNewInvoiceModal(false);
    setPrintableDoc({ type: 'invoice', data: newInv });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessSettings(settingsForm);
    onSettingsUpdate(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Pre-populate quote modal from booking
  const openQuoteModalForBooking = (b: Booking) => {
    setQuoteCustomerName(b.customerInfo.fullName);
    setQuoteCustomerPhone(b.customerInfo.phone);
    setQuoteLocation(b.customerInfo.location);
    setQuoteService(b.service);
    setQuoteLabor(b.estimatedPrice || settings.startingPrices.basicHome);
    setQuoteDesc(`Cleaning service for ${b.propertyInfo.propertyType} (${b.propertyInfo.numberOfRooms}). Ref: ${b.referenceNumber}`);
    setShowNewQuoteModal(true);
    setSelectedBooking(null);
  };

  // Pre-populate invoice modal from booking
  const openInvoiceModalForBooking = (b: Booking) => {
    setInvCustomerName(b.customerInfo.fullName);
    setInvCustomerPhone(b.customerInfo.phone);
    setInvLocation(b.customerInfo.location);
    setInvService(b.service);
    setInvAmount(b.estimatedPrice || settings.startingPrices.basicHome);
    setShowNewInvoiceModal(true);
    setSelectedBooking(null);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
    const matchesSearch =
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerInfo.phone.includes(searchQuery) ||
      b.customerInfo.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalBookingsCount = bookings.length;
  const newBookingsCount = bookings.filter((b) => b.status === 'New').length;
  const activeJobsCount = bookings.filter((b) => ['Confirmed', 'Assigned', 'In Progress'].includes(b.status)).length;
  const totalRevenueBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Admin Navbar */}
      <nav className="bg-brand-navy text-white px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold">
            <Sparkles className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">YANKEY Operational Portal</span>
            <span className="text-[11px] text-brand-cyan block">Admin: {currentUser?.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isFirebaseConfigured ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Cloud Sync Active
            </span>
          ) : (
            <button
              onClick={() => setActiveTab('settings')}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] sm:text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              title="Click to view instructions to sync bookings across all devices"
            >
              <CloudOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Offline / Demo Mode</span>
              <span className="sm:hidden">Offline</span>
            </button>
          )}

          <button
            onClick={loadAllData}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cloud Sync Warning Banner when not configured */}
        {!isFirebaseConfigured && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm sm:text-base text-amber-950">
                  Why are bookings only arriving on WhatsApp and not appearing here?
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed max-w-3xl">
                  Your portal is currently in <strong>Local Storage Mode</strong> because Firebase Cloud Database environment variables are not yet configured in your Vercel project. When customers submit a booking from their device, the booking details are forwarded to your WhatsApp, but cannot sync to this portal across devices without Firebase.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Connect Firebase in Vercel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'bookings', label: `Bookings (${newBookingsCount} new)`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'billing', label: 'Quotes & Invoices', icon: <FileText className="w-4 h-4" /> },
            { id: 'staff', label: 'Staff / Cleaners', icon: <Users className="w-4 h-4" /> },
            { id: 'customers', label: 'Customers CRM', icon: <Users className="w-4 h-4" /> },
            { id: 'messages', label: `Messages (${messages.filter(m => m.status === 'New').length})`, icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'settings', label: 'Business Settings', icon: <SettingsIcon className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD METRICS & SUMMARY */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">New Requests</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{newBookingsCount}</div>
                <span className="text-xs text-amber-700 font-semibold block">Awaiting confirmation</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Jobs</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-brand-blue">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{activeJobsCount}</div>
                <span className="text-xs text-brand-blue font-semibold block">Confirmed / In progress</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">{totalBookingsCount}</div>
                <span className="text-xs text-slate-500 font-medium block">All time requests</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Revenue Billed</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800">GH₵{totalRevenueBilled}</div>
                <span className="text-xs text-emerald-600 font-semibold block">From generated invoices</span>
              </div>
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Bookings Queue (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-brand-navy text-lg">Latest Booking Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-brand-blue font-bold hover:underline"
                  >
                    View All Bookings →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className="p-4 rounded-xl border border-slate-100 hover:border-brand-blue bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-navy">{b.referenceNumber}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            b.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'Confirmed' ? 'bg-blue-100 text-brand-blue' :
                            b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">{b.customerInfo.fullName} • {b.service}</h4>
                        <p className="text-xs text-slate-500">{b.customerInfo.location} • Date: {b.schedule.preferredDate}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-800 text-sm block">~ GH₵{b.estimatedPrice}</span>
                        <span className="text-[11px] text-brand-blue font-semibold">Click to manage</span>
                      </div>
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <p className="text-center py-8 text-slate-400 text-sm">No bookings recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Quick Actions Box (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
                  <h3 className="font-bold text-brand-navy text-base">Quick Document Creator</h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setShowNewQuoteModal(true)}
                      className="w-full py-3 px-4 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Create Custom Quotation</span>
                    </button>
                    <button
                      onClick={() => setShowNewInvoiceModal(true)}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Create Official Invoice</span>
                    </button>
                    <button
                      onClick={() => setShowNewStaffModal(true)}
                      className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Cleaner / Staff</span>
                    </button>
                  </div>
                </div>

                {/* Operational Quick Contact Info */}
                <div className="bg-gradient-to-br from-brand-navy to-brand-navyLight text-white rounded-2xl p-5 space-y-3 text-xs">
                  <span className="text-brand-cyan font-bold uppercase tracking-wider block">Hotline Reference</span>
                  <p className="text-slate-300">Western North Operating Phone:</p>
                  <p className="font-bold text-base text-white">{settings.phone1}</p>
                  <p className="text-slate-300">Office: {settings.headOffice}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {['All', 'New', 'Contacted', 'Quotation Sent', 'Confirmed', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      bookingFilter === st
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search name, phone, ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Bookings Table / List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Ref #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service & Space</th>
                      <th className="py-3 px-4">Schedule</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Staff Assigned</th>
                      <th className="py-3 px-4 text-right">Estimate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">{b.referenceNumber}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{b.customerInfo.fullName}</span>
                          <span className="text-xs text-slate-500">{b.customerInfo.phone}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{b.service}</span>
                          <span className="text-xs text-slate-500">{b.propertyInfo.propertyType}, {b.propertyInfo.numberOfRooms}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-700 block">{b.schedule.preferredDate}</span>
                          <span className="text-xs text-slate-500">{b.schedule.preferredTime}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-[150px] truncate">{b.customerInfo.location}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            b.status === 'Confirmed' ? 'bg-blue-100 text-brand-blue' :
                            b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {b.assignedStaffName || <span className="text-slate-400 italic">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-800">
                          ~ GH₵{b.estimatedPrice}
                        </td>
                      </tr>
                    ))}

                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-10 text-slate-400">
                          No bookings found matching the current criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BILLING & QUOTATIONS SUITE */}
        {activeTab === 'billing' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-bold text-brand-navy text-xl">Official Quotations & Invoices</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewQuoteModal(true)}
                  className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Quotation</span>
                </button>
                <button
                  onClick={() => setShowNewInvoiceModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Invoice</span>
                </button>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">Issued Invoices</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-brand-navy">{inv.invoiceNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{inv.customerName}</td>
                        <td className="py-3 px-3 text-slate-600">{inv.service}</td>
                        <td className="py-3 px-3 text-slate-500">{inv.date}</td>
                        <td className="py-3 px-3 font-black text-slate-800">GH₵{inv.amount}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.paymentStatus} ({inv.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => setPrintableDoc({ type: 'invoice', data: inv })}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-blue font-bold text-xs transition-colors"
                            title="Print / View Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-slate-400">No invoices generated yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quotations List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-2">Issued Quotations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Quote #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Valid Until</th>
                      <th className="py-2.5 px-3">Total Cost</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-mono font-bold text-brand-navy">{q.quotationNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{q.customerName}</td>
                        <td className="py-3 px-3 text-slate-600">{q.service}</td>
                        <td className="py-3 px-3 text-slate-500">{q.validUntil}</td>
                        <td className="py-3 px-3 font-black text-slate-800">GH₵{q.total}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setPrintableDoc({ type: 'quotation', data: q })}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-brand-blue font-bold text-xs transition-colors"
                            title="Print / View Quotation"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {quotations.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400">No quotations generated yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-brand-navy text-xl">Cleaning Staff Directory</h3>
                <p className="text-xs text-slate-500">Manage cleaners, supervisors, and their job allocations.</p>
              </div>
              <button
                onClick={() => setShowNewStaffModal(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((stf) => (
                <div key={stf.id} className="bg-white rounded-2xl border border-slate-200 shadow-soft p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{stf.name}</h4>
                      <span className="text-xs font-semibold text-brand-blue block">{stf.position}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      stf.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {stf.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{stf.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned</span>
                      <strong className="text-sm font-black text-slate-800">{stf.assignedJobs}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50">
                      <span className="text-emerald-700 block text-[10px] uppercase font-bold">Completed</span>
                      <strong className="text-sm font-black text-emerald-800">{stf.completedJobs}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`tel:${stf.phone.replace(/\s+/g, '')}`}
                      className="flex-1 py-2 text-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/233${stf.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER CRM */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-brand-navy text-lg border-b border-slate-100 pb-2">Customer Client Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Customer Name</th>
                    <th className="py-2.5 px-3">Phone / WhatsApp</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Total Bookings</th>
                    <th className="py-2.5 px-3">Total Spent</th>
                    <th className="py-2.5 px-3 text-right">Reach Customer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-bold text-slate-800">{c.fullName}</td>
                      <td className="py-3 px-3 text-slate-600">{c.phone}</td>
                      <td className="py-3 px-3 text-slate-600">{c.location}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{c.totalBookings}</td>
                      <td className="py-3 px-3 font-black text-slate-800">GH₵{c.totalSpent}</td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={`https://wa.me/233${c.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400">No customer profiles saved yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-brand-navy text-lg border-b border-slate-100 pb-2">Website Contact Inquiries</h3>
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                    <div>
                      <span className="font-bold text-slate-800 text-base">{m.name}</span>
                      <span className="text-xs text-slate-500 ml-2">({m.phone}{m.email ? ` • ${m.email}` : ''})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        m.status === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed">{m.message}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/233${m.phone.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                          `Hello ${m.name}, thank you for contacting YANKEY Home Cleaning. We received your message!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${m.phone.replace(/\s+/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>

                    {m.status === 'New' && (
                      <button
                        onClick={async () => {
                          await updateContactMessageStatus(m.id, 'Replied');
                          setMessages((prev) =>
                            prev.map((item) => (item.id === m.id ? { ...item, status: 'Replied' } : item))
                          );
                        }}
                        className="text-xs text-slate-500 hover:text-brand-blue font-semibold"
                      >
                        Mark as Replied
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <p className="text-center py-8 text-slate-400 text-sm">No incoming contact messages yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: BUSINESS SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-brand-navy text-xl">Business Profile & Pricing Settings</h3>
              <p className="text-xs text-slate-500">Edit your live starting rates, contact hotlines, and service areas across Western North.</p>
            </div>

            {settingsSavedToast && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings updated and saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Starting Prices Group */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
                  Starting Prices (Ghana Cedis - GH₵)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Basic Home (GH₵)</label>
                    <input
                      type="number"
                      value={settingsForm.startingPrices.basicHome}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          startingPrices: { ...settingsForm.startingPrices, basicHome: Number(e.target.value) }
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Standard Home (GH₵)</label>
                    <input
                      type="number"
                      value={settingsForm.startingPrices.standardHome}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          startingPrices: { ...settingsForm.startingPrices, standardHome: Number(e.target.value) }
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Deep Cleaning (GH₵)</label>
                    <input
                      type="number"
                      value={settingsForm.startingPrices.deepCleaning}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          startingPrices: { ...settingsForm.startingPrices, deepCleaning: Number(e.target.value) }
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Commercial / Office (GH₵)</label>
                    <input
                      type="number"
                      value={settingsForm.startingPrices.commercial}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          startingPrices: { ...settingsForm.startingPrices, commercial: Number(e.target.value) }
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Post-Construction (GH₵)</label>
                    <input
                      type="number"
                      value={settingsForm.startingPrices.postConstruction}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          startingPrices: { ...settingsForm.startingPrices, postConstruction: Number(e.target.value) }
                        })
                      }
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3">
                  Contact Information & Hotlines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Primary Hotline</label>
                    <input
                      type="text"
                      value={settingsForm.phone1}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone1: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Secondary Hotline</label>
                    <input
                      type="text"
                      value={settingsForm.phone2}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone2: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Business Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Head Office Location</label>
                    <input
                      type="text"
                      value={settingsForm.headOffice}
                      onChange={(e) => setSettingsForm({ ...settingsForm, headOffice: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white font-bold text-sm shadow-md transition-all"
                >
                  Save Business Settings
                </button>
              </div>
            </form>

            {/* Cloud Database (Firebase) & Vercel Setup Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-black text-brand-navy text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-brand-blue" />
                    Cloud Database (Firebase) & Live Sync Status
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect Firebase to receive customer bookings directly on this dashboard from any phone or computer.
                  </p>
                </div>
                <div>
                  {isFirebaseConfigured ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Live Cloud Sync Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                      <CloudOff className="w-4 h-4 text-amber-600" />
                      Local Demo Mode (No Cloud DB)
                    </span>
                  )}
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_API_KEY</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasApiKey ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Configured</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_PROJECT_ID</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasProjectId ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> {firebaseConfigStatus.projectId}</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_AUTH_DOMAIN</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasAuthDomain ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Configured</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_STORAGE_BUCKET</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasStorageBucket ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Configured</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_MESSAGING_SENDER_ID</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasMessagingSenderId ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Configured</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">VITE_FIREBASE_APP_ID</div>
                  <div className="font-bold font-mono">
                    {firebaseConfigStatus.hasAppId ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Configured</span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Missing in Vercel</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-100 space-y-3 text-xs text-slate-700">
                <h5 className="font-bold text-sm text-brand-navy flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                  Quick 4-Step Setup to Receive Bookings on this Dashboard
                </h5>
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  <li>
                    Go to <strong><a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-brand-blue underline font-semibold">console.firebase.google.com</a></strong> and click <strong>Add project</strong> (e.g. named <code>yankey-cleaning</code>).
                  </li>
                  <li>
                    In the left menu, click <strong>Build &gt; Firestore Database &gt; Create Database</strong> (choose Test Mode so read/write is enabled).
                  </li>
                  <li>
                    Click the <strong>Project settings gear &gt; General</strong>, scroll down to <strong>Your apps</strong>, click the <strong>Web (&lt;/&gt;)</strong> icon to register the web app and copy the <code>firebaseConfig</code> keys.
                  </li>
                  <li>
                    In your <strong><a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-blue underline font-semibold">Vercel Dashboard</a> &gt; Project &gt; Settings &gt; Environment Variables</strong>, add the 6 keys listed above, then go to <strong>Deployments</strong> and click <strong>Redeploy</strong>.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-blue uppercase block">
                  Reference: {selectedBooking.referenceNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-navy">
                  {selectedBooking.customerInfo.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`tel:${selectedBooking.customerInfo.phone.replace(/\s+/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer</span>
              </a>
              <a
                href={`https://wa.me/233${selectedBooking.customerInfo.phone.replace(/\s+/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                  `Hello ${selectedBooking.customerInfo.fullName}, this is Joshua Yankey from YANKEY Home Cleaning regarding your booking ref: ${selectedBooking.referenceNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </a>
              <button
                onClick={() => openQuoteModalForBooking(selectedBooking)}
                className="px-3.5 py-2 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Quote</span>
              </button>
              <button
                onClick={() => openInvoiceModalForBooking(selectedBooking)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Generate Invoice</span>
              </button>
            </div>

            {/* Booking Specs Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Service Required:</span>
                <strong className="text-brand-navy">{selectedBooking.service}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Estimated Starting Price:</span>
                <strong className="text-emerald-700 text-base">~ GH₵{selectedBooking.estimatedPrice}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Scheduled Date & Slot:</span>
                <span>{selectedBooking.schedule.preferredDate} ({selectedBooking.schedule.preferredTime})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Location Address:</span>
                <span>{selectedBooking.customerInfo.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Property Details:</span>
                <span>{selectedBooking.propertyInfo.propertyType}, {selectedBooking.propertyInfo.numberOfRooms}, {selectedBooking.propertyInfo.numberOfBathrooms}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase font-bold">Condition:</span>
                <span>{selectedBooking.propertyInfo.cleaningCondition}</span>
              </div>
            </div>

            {selectedBooking.specialInstructions && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block">Special Notes from Customer:</span>
                <p className="mt-0.5">{selectedBooking.specialInstructions}</p>
              </div>
            )}

            {/* Uploaded Photos Preview */}
            {selectedBooking.photoUrls && selectedBooking.photoUrls.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase text-slate-600 block mb-2">Uploaded Property Photos:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.photoUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 block hover:opacity-90">
                      <img src={url} alt="Property space" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status & Staff Assignment Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Status
                </label>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as BookingStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assign Staff Cleaner
                </label>
                <select
                  value={selectedBooking.assignedStaffId || ''}
                  onChange={(e) => handleAssignStaff(selectedBooking.id, e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="">-- Choose Cleaner --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.position})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE QUOTATION / INVOICE MODAL */}
      {printableDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between no-print border-b border-slate-200 pb-4">
              <span className="font-bold text-brand-navy text-lg">
                Official Document Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-brand-navy text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:bg-brand-navyLight"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setPrintableDoc(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div id="printable-document" className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl space-y-8 text-slate-800">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-brand-navy pb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">YANKEY</h2>
                  <p className="text-xs uppercase font-bold text-brand-blue">Home Cleaning & Services</p>
                  <p className="text-xs text-slate-500 mt-1">{settings.headOffice}</p>
                  <p className="text-xs text-slate-500">Phone: {settings.phone1} / {settings.phone2}</p>
                  <p className="text-xs text-slate-500">Email: {settings.email}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-md bg-brand-navy text-white text-xs font-black uppercase tracking-wider block">
                    {printableDoc.type === 'quotation' ? 'OFFICIAL QUOTATION' : 'OFFICIAL INVOICE'}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 block mt-2">
                    {printableDoc.type === 'quotation'
                      ? (printableDoc.data as Quotation).quotationNumber
                      : (printableDoc.data as Invoice).invoiceNumber}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    Date: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="grid grid-cols-2 gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Client Information:</span>
                  <strong className="text-base text-slate-900 block">{printableDoc.data.customerName}</strong>
                  <p className="text-slate-600">{printableDoc.data.customerPhone}</p>
                  <p className="text-slate-600">{printableDoc.data.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 uppercase font-bold text-[10px] block">Service Details:</span>
                  <strong className="text-slate-900 block">{printableDoc.data.service}</strong>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs sm:text-sm border-t border-b border-slate-200">
                <thead className="text-slate-500 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5">Description</th>
                    <th className="py-2.5 text-right">Amount (GH₵)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printableDoc.type === 'quotation' ? (
                    <>
                      <tr>
                        <td className="py-2">Labor & Cleaning Operations ({(printableDoc.data as Quotation).service})</td>
                        <td className="py-2 text-right">GH₵{(printableDoc.data as Quotation).laborCost}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Cleaning Materials & Detergents</td>
                        <td className="py-2 text-right">GH₵{(printableDoc.data as Quotation).materialsCost}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Transportation & Mobilization</td>
                        <td className="py-2 text-right">GH₵{(printableDoc.data as Quotation).transportation}</td>
                      </tr>
                      {(printableDoc.data as Quotation).discount > 0 && (
                        <tr className="text-emerald-700">
                          <td className="py-2">Promotional Discount</td>
                          <td className="py-2 text-right">-GH₵{(printableDoc.data as Quotation).discount}</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td className="py-2">
                        {(printableDoc.data as Invoice).service} - Full Execution & Sanitation
                      </td>
                      <td className="py-2 text-right">GH₵{(printableDoc.data as Invoice).amount}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Total Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between font-black text-base sm:text-lg text-brand-navy border-t-2 border-brand-navy pt-2">
                    <span>Total Amount:</span>
                    <span>
                      GH₵
                      {printableDoc.type === 'quotation'
                        ? (printableDoc.data as Quotation).total
                        : (printableDoc.data as Invoice).amount}
                    </span>
                  </div>
                  {printableDoc.type === 'invoice' && (
                    <div className="text-right text-xs font-bold text-emerald-700">
                      Payment Status: {(printableDoc.data as Invoice).paymentStatus} ({(printableDoc.data as Invoice).paymentMethod})
                    </div>
                  )}
                </div>
              </div>

              {/* Signatures & Notice */}
              <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-8 text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-700">Authorized Signature:</p>
                  <p className="mt-6 border-b border-slate-300 w-48"></p>
                  <p className="text-[11px] mt-1">Joshua Yankey, Lead Supervisor</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">Thank you for your business!</p>
                  <p className="text-[11px] mt-1">“{settings.tagline}”</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW STAFF MODAL */}
      {showNewStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-brand-navy text-lg">Add New Cleaner / Staff</h3>
              <button onClick={() => setShowNewStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Kofi Annan"
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="e.g. 055 123 4567"
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Position</label>
                <select
                  value={newStaffPosition}
                  onChange={(e) => setNewStaffPosition(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium"
                >
                  <option value="Cleaner">Cleaner</option>
                  <option value="Senior Cleaner">Senior Cleaner</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Driver / Logistics">Driver / Logistics</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-navy text-white font-bold text-sm hover:bg-brand-navyLight"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: NEW QUOTATION MODAL */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-brand-navy text-lg">Create Quotation</h3>
              <button onClick={() => setShowNewQuoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={quoteCustomerName}
                  onChange={(e) => setQuoteCustomerName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={quoteCustomerPhone}
                  onChange={(e) => setQuoteCustomerPhone(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={quoteLocation}
                  onChange={(e) => setQuoteLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
                <input
                  type="text"
                  value={quoteService}
                  onChange={(e) => setQuoteService(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Labor Cost (GH₵)</label>
                  <input
                    type="number"
                    value={quoteLabor}
                    onChange={(e) => setQuoteLabor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Materials (GH₵)</label>
                  <input
                    type="number"
                    value={quoteMaterials}
                    onChange={(e) => setQuoteMaterials(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transport (GH₵)</label>
                  <input
                    type="number"
                    value={quoteTransport}
                    onChange={(e) => setQuoteTransport(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount (GH₵)</label>
                  <input
                    type="number"
                    value={quoteDiscount}
                    onChange={(e) => setQuoteDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 flex justify-between">
                <span>Calculated Total:</span>
                <span>GH₵{quoteLabor + quoteMaterials + quoteTransport - quoteDiscount}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-blue text-white font-bold text-xs sm:text-sm hover:bg-blue-600"
              >
                Generate & Preview Quotation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW INVOICE MODAL */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-brand-navy text-lg">Create Invoice</h3>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={invCustomerName}
                  onChange={(e) => setInvCustomerName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  value={invCustomerPhone}
                  onChange={(e) => setInvCustomerPhone(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service</label>
                <input
                  type="text"
                  value={invService}
                  onChange={(e) => setInvService(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (GH₵)</label>
                <input
                  type="number"
                  value={invAmount}
                  onChange={(e) => setInvAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={invPaymentMethod}
                  onChange={(e) => setInvPaymentMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                >
                  <option value="Mobile Money">Mobile Money (MoMo)</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 mt-2"
              >
                Generate & Preview Invoice
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
