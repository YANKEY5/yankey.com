import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase';
import type { Booking, BookingStatus } from '../types';

const LOCAL_BOOKINGS_KEY = 'yankey_bookings_records';

export const generateBookingReference = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `YNK-${dateStr}-${randomSuffix}`;
};

export const uploadPropertyPhotos = async (files: File[], bookingRef: string): Promise<string[]> => {
  if (files.length === 0) return [];

  if (isFirebaseConfigured) {
    try {
      const uploadPromises = files.map(async (file, idx) => {
        const fileRef = ref(storage, `bookings/${bookingRef}/${Date.now()}_${idx}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        return await getDownloadURL(snapshot.ref);
      });
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.warn('Firebase Storage upload failed, falling back to local object URLs:', error);
    }
  }

  // Fallback for preview
  return files.map(file => URL.createObjectURL(file));
};

export const submitBooking = async (
  bookingData: Omit<Booking, 'id' | 'referenceNumber' | 'status' | 'createdAt'>,
  photoFiles?: File[]
): Promise<Booking> => {
  const referenceNumber = generateBookingReference();
  const id = 'bk-' + Date.now();
  
  let photoUrls: string[] = [];
  if (photoFiles && photoFiles.length > 0) {
    photoUrls = await uploadPropertyPhotos(photoFiles, referenceNumber);
  }

  const newBooking: Booking = {
    ...bookingData,
    id,
    referenceNumber,
    photoUrls,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    try {
      const bookingDocRef = doc(db, 'bookings', id);
      await setDoc(bookingDocRef, newBooking);
    } catch (error) {
      console.error('Failed to save booking to Firestore:', error);
    }
  }

  // Save to local storage cache
  const localList: Booking[] = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  localList.unshift(newBooking);
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(localList));

  return newBooking;
};

export const getBookings = async (): Promise<Booking[]> => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: Booking[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as Booking);
      });
      if (items.length > 0) {
        return items;
      }
    } catch (error) {
      console.warn('Error fetching Firestore bookings, fallback to local:', error);
    }
  }

  const local = localStorage.getItem(LOCAL_BOOKINGS_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }
  return [];
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  const all = await getBookings();
  return all.find(b => b.id === id || b.referenceNumber === id) || null;
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  notes?: string
): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, {
        status,
        ...(notes !== undefined ? { notes } : {})
      });
    } catch (e) {
      console.warn('Firestore update failed:', e);
    }
  }

  const local: Booking[] = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  const idx = local.findIndex(b => b.id === id);
  if (idx !== -1) {
    local[idx].status = status;
    if (notes !== undefined) local[idx].notes = notes;
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(local));
  }
};

export const assignStaffToBooking = async (
  bookingId: string,
  staffId: string,
  staffName: string
): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, {
        assignedStaffId: staffId,
        assignedStaffName: staffName,
        status: 'Assigned'
      });
    } catch (e) {
      console.warn('Firestore assign staff failed:', e);
    }
  }

  const local: Booking[] = JSON.parse(localStorage.getItem(LOCAL_BOOKINGS_KEY) || '[]');
  const idx = local.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    local[idx].assignedStaffId = staffId;
    local[idx].assignedStaffName = staffName;
    local[idx].status = 'Assigned';
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(local));
  }
};
