export interface BusinessSettings {
  businessName: string;
  founder: string;
  businessType: string;
  businessStatus: string;
  headOffice: string;
  serviceAreas: string[];
  phone1: string;
  phone2: string;
  email: string;
  tagline: string;
  businessHours: string;
  startingPrices: {
    basicHome: number;
    standardHome: number;
    deepCleaning: number;
    commercial: number;
    postConstruction: number;
    generalCleaning: number;
  };
  socialLinks: {
    whatsapp: string;
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  location: string;
  totalBookings: number;
  totalSpent: number;
  lastServiceDate?: string;
  notes?: string;
  createdAt: string;
}

export type BookingStatus =
  | 'New'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  referenceNumber: string;
  customerInfo: {
    fullName: string;
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
  };
  service: string;
  propertyInfo: {
    propertyType: string;
    numberOfRooms: string;
    numberOfBathrooms: string;
    approximateSize: string;
    cleaningCondition: string;
  };
  schedule: {
    preferredDate: string;
    preferredTime: string;
    alternativeDate?: string;
  };
  specialInstructions?: string;
  photoUrls?: string[];
  status: BookingStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  quotationId?: string;
  invoiceId?: string;
  estimatedPrice?: number;
  notes?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  position: string;
  status: 'Active' | 'Inactive';
  assignedJobs: number;
  completedJobs: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  bookingId?: string;
  bookingRef?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  location: string;
  service: string;
  description: string;
  laborCost: number;
  materialsCost: number;
  transportation: number;
  additionalCharges: number;
  discount: number;
  total: number;
  validUntil: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId?: string;
  bookingRef?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  location: string;
  service: string;
  date: string;
  amount: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Other';
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  review: string;
  rating: number;
  serviceReceived: string;
  photoUrl?: string;
  isApproved: boolean;
  date: string;
}

export interface GalleryItem {
  id: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  serviceType: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: string;
}
