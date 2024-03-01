// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjJLkYgPeoTffA1hjYvE_Ny9Gp2W41k_U",
  authDomain: "ebentizer.firebaseapp.com",
  projectId: "ebentizer",
  storageBucket: "ebentizer.appspot.com",
  messagingSenderId: "826182261195",
  appId: "1:826182261195:web:cb7f4e5c48aadd13c5be4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export{db};
