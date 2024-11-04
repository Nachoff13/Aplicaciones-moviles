import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDEMyJqmkppTL5CvssdNGsdczgQVmOK-Xk",
  authDomain: "habitos-6168a.firebaseapp.com",
  projectId: "habitos-6168a",
  storageBucket: "habitos-6168a.appspot.com",
  messagingSenderId: "865233704774",
  appId: "1:865233704774:android:cac07ccbefb5e6cb8ff747",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth }

export default firebaseApp;
