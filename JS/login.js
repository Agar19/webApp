import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTmypgngOoyeoXmENLJbscrhptMOtauk4",
  authDomain: "foodcraft-71ecb.firebaseapp.com",
  projectId: "foodcraft-71ecb",
  storageBucket: "foodcraft-71ecb.firebasestorage.app",
  messagingSenderId: "54647240044",
  appId: "1:54647240044:web:6959fb7f2fdbef41fdef49",
  measurementId: "G-DD2ZYX9K31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

//if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    window.location.href = '/pages/mainPage'; // to main page if already logged in
  }
});

// Add IDs to your form elements
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  const emailInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  
  // Add IDs to the form elements
  emailInput.id = 'login-email';
  passwordInput.id = 'login-password';
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.id = 'messageLogin';
  messageElement.style.color = 'red';
  messageElement.style.marginTop = '10px';
  messageElement.style.textAlign = 'center';
  form.appendChild(messageElement);

  // Handle form submission
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const messageElement = document.getElementById('messageLogin');
    
    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save remember me preference if checked
      const rememberMe = document.querySelector('input[type="checkbox"]').checked;
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true');
      } else {
        localStorage.removeItem('rememberUser');
      }
      
      // Redirect to main page
      window.location.href = '/pages/mainPage';
      
    } catch (error) {
      console.error("Error:", error);
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/invalid-email':
          messageElement.textContent = "Буруу имэйл хаяг!";
          break;
        case 'auth/user-disabled':
          messageElement.textContent = "Энэ хэрэглэгчийн эрх хаагдсан байна!";
          break;
        case 'auth/user-not-found':
          messageElement.textContent = "Бүртгэлгүй имэйл хаяг байна!";
          break;
        case 'auth/wrong-password':
          messageElement.textContent = "Буруу нууц үг!";
          break;
        default:
          messageElement.textContent = "Нэвтрэхэд алдаа гарлаа: " + error.message;
      }
    }
  });
  
  // Handle "Forgot password" link
  const forgotPasswordLink = document.querySelector('a[href="#"]');
  forgotPasswordLink.addEventListener('click', function(event) {
    event.preventDefault();
    // You can implement password reset functionality here
    alert("Password reset functionality will be implemented here");
  });
});

// Check if user was remembered
if (localStorage.getItem('rememberUser') === 'true') {
  document.querySelector('input[type="checkbox"]').checked = true;
}