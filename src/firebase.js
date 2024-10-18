import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBfREY9zg0hwdjAlboNfntatDCJ335pws",
  authDomain: "personal-finance-manager-d22fe.firebaseapp.com",
  projectId: "personal-finance-manager-d22fe",
  storageBucket: "personal-finance-manager-d22fe.appspot.com",
  messagingSenderId: "542332739947",
  appId: "1:542332739947:web:233e382269461bc37fec2e",
  measurementId: "G-ZRRS8YX750"
};

// Initialize Firebase for PFM
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exporting auth and db
export { auth, db };