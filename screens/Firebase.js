
/*
// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {initializeApp} from "firebase/app";
//import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr7afeCQdSGAT-3umDLtZqNiCfG7niII4",
  authDomain: "acwr-2b24a.firebaseapp.com",
  projectId: "acwr-2b24a",
  storageBucket: "acwr-2b24a.appspot.com",
  messagingSenderId: "180271356910",
  appId: "1:180271356910:web:7ea67409b3739c8c2a0cff"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = firebase.auth();
//const auth = getAuth(app);
//export {auth}
export {db, auth};
*/

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDr7afeCQdSGAT-3umDLtZqNiCfG7niII4",
  authDomain: "acwr-2b24a.firebaseapp.com",
  projectId: "acwr-2b24a",
  storageBucket: "acwr-2b24a.appspot.com",
  messagingSenderId: "180271356910",
  appId: "1:180271356910:web:7ea67409b3739c8c2a0cff"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db
}