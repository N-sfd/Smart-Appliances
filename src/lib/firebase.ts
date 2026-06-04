import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Firestore } from 'firebase/firestore';
import { ServiceRequest } from '../data/services';

// ─────────────────────────────────────────────────────────────────────────────
// Fill in your Firebase project config from:
// Firebase Console → Project Settings → Your apps → Web app → SDK setup & config
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const isConfigured = Boolean(firebaseConfig.apiKey);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

// Saves a service request to Firestore (if configured) and always to localStorage.
export async function saveServiceRequest(request: ServiceRequest): Promise<void> {
  if (db) {
    await addDoc(collection(db, 'serviceRequests'), {
      ...request,
      // Omit base64 image from Firestore to keep document size small
      imageUrl: null,
    });
  }
}

export { db };
