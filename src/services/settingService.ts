import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import type { BusinessSettings } from '../types';
import { defaultSettings } from './mockData';

const SETTINGS_KEY = 'yankey_business_settings';

export const getBusinessSettings = async (): Promise<BusinessSettings> => {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'business_info');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as BusinessSettings;
      }
    } catch (error) {
      console.warn('Firebase settings read failed, using cached/default settings:', error);
    }
  }

  // Fallback to localStorage or defaults
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return defaultSettings;
};

export const updateBusinessSettings = async (settings: BusinessSettings): Promise<void> => {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'business_info');
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error('Failed to update Firestore settings:', error);
    }
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
