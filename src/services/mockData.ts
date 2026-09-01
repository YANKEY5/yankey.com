import type { BusinessSettings, Staff, GalleryItem } from '../types';

export const defaultSettings: BusinessSettings = {
  businessName: "YANKEY Home Cleaning and Services",
  founder: "Joshua Yankey",
  businessType: "Sole Proprietorship",
  businessStatus: "New business / startup",
  headOffice: "Bibiani, Western North Region, Ghana",
  serviceAreas: [
    "Bibiani",
    "Diaso",
    "Goaso",
    "Western North Region",
    "Surrounding Communities"
  ],
  phone1: "055 873 6867",
  phone2: "059 574 0883",
  email: "joshuayankey19@gmail.com",
  tagline: "A Cleaner Space, A Healthier You!",
  businessHours: "Monday - Saturday: 7:00 AM - 6:00 PM | Sunday: By Special Appointment",
  startingPrices: {
    basicHome: 150,
    standardHome: 200,
    deepCleaning: 300,
    commercial: 250,
    postConstruction: 500,
    generalCleaning: 150
  },
  socialLinks: {
    whatsapp: "https://wa.me/233558736867",
    facebook: "",
    instagram: "",
    tiktok: ""
  }
};

export const initialStaffList: Staff[] = [
  {
    id: "stf-001",
    name: "Joshua Yankey",
    phone: "055 873 6867",
    position: "Lead Supervisor / Founder",
    status: "Active",
    assignedJobs: 12,
    completedJobs: 12
  },
  {
    id: "stf-002",
    name: "Kwame Mensah",
    phone: "059 574 0883",
    position: "Senior Cleaner",
    status: "Active",
    assignedJobs: 8,
    completedJobs: 8
  }
];

export const initialGalleryItems: GalleryItem[] = [
  {
    id: "gal-001",
    beforeImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    serviceType: "Deep Cleaning",
    location: "Bibiani Main Town",
    description: "Full deep cleaning and surface restoration of a residential living space.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-002",
    beforeImageUrl: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    serviceType: "Commercial Cleaning",
    location: "Diaso Commercial Centre",
    description: "Office sanitation, dusting, vacuuming, and conference room preparation.",
    createdAt: new Date().toISOString()
  },
  {
    id: "gal-003",
    beforeImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    afterImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    serviceType: "Post-Construction Cleaning",
    location: "Goaso Residential Project",
    description: "Post-renovation debris and residue removal for final handover.",
    createdAt: new Date().toISOString()
  }
];
