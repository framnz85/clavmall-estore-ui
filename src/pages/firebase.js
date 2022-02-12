import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyC_DgEQaEabrQ6ffNpcfK1GFoHmCqXoKyY",
  authDomain: "clavmall-estore.firebaseapp.com",
  projectId: "clavmall-estore",
  storageBucket: "clavmall-estore.appspot.com",
  messagingSenderId: "341421985998",
  appId: "1:341421985998:web:51a38a1d6c1c3666b5809f",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
