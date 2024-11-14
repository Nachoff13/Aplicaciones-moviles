import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

console.log('FIREBASE_API_KEY:', FIREBASE_API_KEY);
console.log('FIREBASE_AUTH_DOMAIN:', FIREBASE_AUTH_DOMAIN);
console.log('FIREBASE_PROJECT_ID:', FIREBASE_PROJECT_ID);
console.log('FIREBASE_STORAGE_BUCKET:', FIREBASE_STORAGE_BUCKET);
console.log('FIREBASE_MESSAGING_SENDER_ID:', FIREBASE_MESSAGING_SENDER_ID);
console.log('FIREBASE_APP_ID:', FIREBASE_APP_ID);

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase inicializado:', app);

export { db };