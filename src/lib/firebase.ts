import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { ServiceRequest } from '../data/services';
import { persistServiceRequest } from './serviceRequests';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'smartappliances-8e53c',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const isConfigured =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.storageBucket) &&
  Boolean(firebaseConfig.messagingSenderId) &&
  Boolean(firebaseConfig.appId);

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch {
    // Firebase not available - will use localStorage fallback
    app = null;
    db = null;
  }
}

const COLLECTION = 'serviceRequests';

export async function saveServiceRequest(request: ServiceRequest): Promise<void> {
  await persistServiceRequest(request);

  if (db) {
    try {
      await addDoc(collection(db, COLLECTION), request);
    } catch {
      // Firestore error - silently fail, localStorage handles persistence
    }
  }
}

export async function fetchServiceRequests(): Promise<ServiceRequest[]> {
  if (db) {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ServiceRequest));
    } catch {
      return [];
    }
  }
  return [];
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest['status'],
): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Silently fail
    }
  }
}

export async function updateServiceRequestNotes(id: string, notes: string): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        notes,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Silently fail
    }
  }
}

export async function updateTechnicianStatus(
  id: string,
  techStatus: ServiceRequest['technicianStatus'],
): Promise<void> {
  if (db) {
    try {
      await updateDoc(doc(db, COLLECTION, id), {
        technicianStatus: techStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      // Silently fail
    }
  }
}

export { app, db };
