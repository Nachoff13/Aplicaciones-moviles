import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDEMyJqmkppTL5CvssdNGsdczgQVmOK-Xk",
  authDomain: "habitos-6168a.firebaseapp.com",
  projectId: "habitos-6168a",
  storageBucket: "habitos-6168a.appspot.com",
  messagingSenderId: "865233704774",
  appId: "1:865233704774:android:cac07ccbefb5e6cb8ff747",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
export { auth }

export default firebaseApp;
