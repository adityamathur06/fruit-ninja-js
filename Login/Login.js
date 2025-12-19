// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuP-F1PY1eWkRAdjv1yI4JNECR4MkWShM",
  authDomain: "fruit-ninja-461d5.firebaseapp.com",
  projectId: "fruit-ninja-461d5",
  storageBucket: "fruit-ninja-461d5.firebasestorage.app",
  messagingSenderId: "845356521543",
  appId: "1:845356521543:web:a8fdac1f1ea69fcef87962",
  measurementId: "G-1G7YET3TXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

console.log(app);


const signUp = document.getElementById("signup-button");
const signIn = document.getElementById("signin-button");

if (signUp) {
  signUp.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.getElementById("rEmail").value;
    const password = document.getElementById("rPassword").value;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
        };

        setDoc(doc(db, "users", user.uid), userData)
          .then(() => {
            localStorage.setItem("loggedInUserId", user.uid);
            window.alert("Sign up successful");
            window.location.href = "Login.html";
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
  
        if (errorCode === "auth/email-already-in-use") {
          alert("Email already in use");
        } else {
          alert(errorMessage);
        }
      })
  });
}

if (signIn) {
  signIn.addEventListener("click", (event) => {
    event.preventDefault();
    
    const email = document.getElementById("lEmail").value;
    const password = document.getElementById("lPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.alert("Login Successful");
        window.location.href = "../main.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);

        if (errorCode === "auth/user-not-found") {
          alert("User not found");
        } else if (errorCode === "auth/invalid-credential") {
          alert("Incorrect email or password");
        }
        else {
          alert(errorMessage);
        }
      })
  });
}