// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUy2HgGFC13-grF5KWBlIRZbP19xjZBQI",
  authDomain: "aplicacion-eben-ezer.firebaseapp.com",
  projectId: "aplicacion-eben-ezer",
  storageBucket: "aplicacion-eben-ezer.appspot.com",
  messagingSenderId: "550999383648",
  appId: "1:550999383648:web:1ca8afe8c15ae6fc02ed05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export{db};
