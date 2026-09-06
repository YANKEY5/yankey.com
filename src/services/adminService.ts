import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type {
  Staff,
  Customer,
  Quotation,
  Invoice,
  Testimonial,
  GalleryItem,
  ContactMessage
} from '../types';
import { initialStaffList, initialGalleryItems } from './mockData';

// Storage Keys
const STAFF_KEY = 'yankey_staff_records';
const CUSTOMERS_KEY = 'yankey_customer_records';
const QUOTES_KEY = 'yankey_quotations_records';
const INVOICES_KEY = 'yankey_invoices_records';
const TESTIMONIALS_KEY = 'yankey_testimonials_records';
const GALLERY_KEY = 'yankey_gallery_records';
const MESSAGES_KEY = 'yankey_contact_messages';

// STAFF
export const getStaffList = async (): Promise<Staff[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'staff'));
      const list: Staff[] = [];
      snap.forEach(d => list.push(d.data() as Staff));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Staff fetch failed:', e);
    }
  }

  const local = localStorage.getItem(STAFF_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  localStorage.setItem(STAFF_KEY, JSON.stringify(initialStaffList));
  return initialStaffList;
};

export const saveStaffMember = async (staff: Staff): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'staff', staff.id), staff);
    } catch (e) {
      console.warn('Save staff failed in Firebase:', e);
    }
  }
  const current = await getStaffList();
  const index = current.findIndex(s => s.id === staff.id);
  if (index !== -1) {
    current[index] = staff;
  } else {
    current.push(staff);
  }
  localStorage.setItem(STAFF_KEY, JSON.stringify(current));
};

// CUSTOMERS
export const getCustomers = async (): Promise<Customer[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      const list: Customer[] = [];
      snap.forEach(d => list.push(d.data() as Customer));
      return list;
    } catch (e) {
      console.warn('Customer fetch error:', e);
    }
  }
  const local = localStorage.getItem(CUSTOMERS_KEY);
  return local ? JSON.parse(local) : [];
};

export const saveCustomer = async (customer: Customer): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'customers', customer.id), customer);
    } catch (e) {
      console.warn('Customer save error in Firebase:', e);
    }
  }
  const current = await getCustomers();
  const idx = current.findIndex(c => c.id === customer.id || c.phone === customer.phone);
  if (idx !== -1) {
    current[idx] = customer;
  } else {
    current.push(customer);
  }
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(current));
};

// QUOTATIONS
export const getQuotations = async (): Promise<Quotation[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'quotations'));
      const list: Quotation[] = [];
      snap.forEach(d => list.push(d.data() as Quotation));
      return list;
    } catch (e) {
      console.warn('Quotations fetch failed:', e);
    }
  }
  const local = localStorage.getItem(QUOTES_KEY);
  return local ? JSON.parse(local) : [];
};

export const createQuotation = async (
  data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>
): Promise<Quotation> => {
  const quotationNumber = `QTE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const quote: Quotation = {
    ...data,
    id: 'qt-' + Date.now(),
    quotationNumber,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'quotations', quote.id), quote);
    } catch (e) {
      console.warn('Create quote error in Firebase:', e);
    }
  }
  const current = await getQuotations();
  current.unshift(quote);
  localStorage.setItem(QUOTES_KEY, JSON.stringify(current));
  return quote;
};

// INVOICES
export const getInvoices = async (): Promise<Invoice[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'invoices'));
      const list: Invoice[] = [];
      snap.forEach(d => list.push(d.data() as Invoice));
      return list;
    } catch (e) {
      console.warn('Invoices fetch failed:', e);
    }
  }
  const local = localStorage.getItem(INVOICES_KEY);
  return local ? JSON.parse(local) : [];
};

export const createInvoice = async (
  data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>
): Promise<Invoice> => {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const invoice: Invoice = {
    ...data,
    id: 'inv-' + Date.now(),
    invoiceNumber,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
    } catch (e) {
      console.warn('Create invoice error in Firebase:', e);
    }
  }
  const current = await getInvoices();
  current.unshift(invoice);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(current));
  return invoice;
};

export const updateInvoiceStatus = async (
  id: string,
  paymentStatus: Invoice['paymentStatus'],
  paymentMethod?: Invoice['paymentMethod']
): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'invoices', id), {
        paymentStatus,
        ...(paymentMethod ? { paymentMethod } : {})
      });
    } catch (e) {
      console.warn('Invoice status update failed in Firebase:', e);
    }
  }
  const current = await getInvoices();
  const idx = current.findIndex(i => i.id === id);
  if (idx !== -1) {
    current[idx].paymentStatus = paymentStatus;
    if (paymentMethod) current[idx].paymentMethod = paymentMethod;
    localStorage.setItem(INVOICES_KEY, JSON.stringify(current));
  }
};

// TESTIMONIALS
export const getTestimonials = async (onlyApproved = true): Promise<Testimonial[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'testimonials'));
      const list: Testimonial[] = [];
      snap.forEach(d => {
        const item = d.data() as Testimonial;
        if (!onlyApproved || item.isApproved) {
          list.push(item);
        }
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Testimonial fetch error in Firebase:', e);
    }
  }
  const local = localStorage.getItem(TESTIMONIALS_KEY);
  const items: Testimonial[] = local ? JSON.parse(local) : [];
  return onlyApproved ? items.filter(t => t.isApproved) : items;
};

export const submitTestimonial = async (
  data: Omit<Testimonial, 'id' | 'isApproved' | 'date'>
): Promise<Testimonial> => {
  const item: Testimonial = {
    ...data,
    id: 'tst-' + Date.now(),
    isApproved: false, // Must be approved by admin
    date: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'testimonials', item.id), item);
    } catch (e) {
      console.warn('Submit testimonial failed in Firebase:', e);
    }
  }
  const current = await getTestimonials(false);
  current.unshift(item);
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(current));
  return item;
};

export const setTestimonialApproval = async (id: string, isApproved: boolean): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'testimonials', id), { isApproved });
    } catch (e) {
      console.warn('Testimonial approval error:', e);
    }
  }
  const current = await getTestimonials(false);
  const idx = current.findIndex(t => t.id === id);
  if (idx !== -1) {
    current[idx].isApproved = isApproved;
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(current));
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      console.warn('Delete testimonial error:', e);
    }
  }
  const current = await getTestimonials(false);
  const filtered = current.filter(t => t.id !== id);
  localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(filtered));
};

// GALLERY
export const getGalleryItems = async (): Promise<GalleryItem[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      const list: GalleryItem[] = [];
      snap.forEach(d => list.push(d.data() as GalleryItem));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Gallery items fetch failed:', e);
    }
  }
  const local = localStorage.getItem(GALLERY_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  localStorage.setItem(GALLERY_KEY, JSON.stringify(initialGalleryItems));
  return initialGalleryItems;
};

export const addGalleryItem = async (
  data: Omit<GalleryItem, 'id' | 'createdAt'>
): Promise<GalleryItem> => {
  const item: GalleryItem = {
    ...data,
    id: 'gal-' + Date.now(),
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'gallery', item.id), item);
    } catch (e) {
      console.warn('Gallery save error:', e);
    }
  }
  const current = await getGalleryItems();
  current.unshift(item);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(current));
  return item;
};

export const deleteGalleryItem = async (id: string): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Delete gallery error:', e);
    }
  }
  const current = await getGalleryItems();
  const filtered = current.filter(g => g.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(filtered));
};

// CONTACT MESSAGES
export const submitContactMessage = async (
  data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): Promise<ContactMessage> => {
  const msg: ContactMessage = {
    ...data,
    id: 'msg-' + Date.now(),
    status: 'New',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'contact_messages', msg.id), msg);
    } catch (e) {
      console.warn('Contact message error:', e);
    }
  }
  const local = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  local.unshift(msg);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(local));
  return msg;
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'contact_messages'));
      const list: ContactMessage[] = [];
      snap.forEach(d => list.push(d.data() as ContactMessage));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('Get messages error:', e);
    }
  }
  const local = localStorage.getItem(MESSAGES_KEY);
  return local ? JSON.parse(local) : [];
};

export const updateContactMessageStatus = async (
  id: string,
  status: ContactMessage['status']
): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await updateDoc(doc(db, 'contact_messages', id), { status });
    } catch (e) {
      console.warn('Update message status error:', e);
    }
  }
  const local: ContactMessage[] = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
  const idx = local.findIndex(m => m.id === id);
  if (idx !== -1) {
    local[idx].status = status;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(local));
  }
};

export const saveContactMessage = submitContactMessage;

export const saveQuotation = async (quote: Quotation): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'quotations', quote.id), quote);
    } catch (e) {
      console.warn('Save quotation error in Firebase:', e);
    }
  }
  const current = await getQuotations();
  const idx = current.findIndex(q => q.id === quote.id);
  if (idx !== -1) {
    current[idx] = quote;
  } else {
    current.unshift(quote);
  }
  localStorage.setItem(QUOTES_KEY, JSON.stringify(current));
};

export const saveInvoice = async (invoice: Invoice): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
    } catch (e) {
      console.warn('Save invoice error in Firebase:', e);
    }
  }
  const current = await getInvoices();
  const idx = current.findIndex(i => i.id === invoice.id);
  if (idx !== -1) {
    current[idx] = invoice;
  } else {
    current.unshift(invoice);
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(current));
};
