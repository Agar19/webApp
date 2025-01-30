// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

function isValidPassword(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

// Form submission handler
document.getElementById("signup-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  let username = document.getElementById('username').value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;
  let confirmPassword = document.getElementById("signup-password-confirm").value;
  let messageElement = document.getElementById("messageSignUp");

  // Password validation
  if (!isValidPassword(password)) {
    messageElement.textContent = "Нууц үг багадаа 8 тэмдэгтээс бүрдэх ба хамгийн багадаа нэг тоо, хамгийн багадаа нэг том үсэг, багадаа нэг жижиг үсэг агуулсан байх шаардлагатай!";
    return;
  }

  // Confirm password check
  if (password !== confirmPassword) {
    messageElement.textContent = "Нууц үг таарахгүй байна!";
    return;
  }

  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // You can store additional user data (like username) in Firebase Realtime Database or Firestore here if needed
    
    console.log("Successfully created user:", user.uid);
    alert("Бүртгэл амжилттай!");
    location.reload();

  } catch (error) {
    console.error("Error:", error);
    
    // Handle specific Firebase error codes
    switch (error.code) {
      case 'auth/email-already-in-use':
        messageElement.textContent = "Имэйл хаяг бүртгэгдсэн байна!";
        break;
      case 'auth/invalid-email':
        messageElement.textContent = "Буруу имэйл хаяг!";
        break;
      case 'auth/operation-not-allowed':
        messageElement.textContent = "Имэйл/Нууц үгээр бүртгүүлэх боломжгүй байна!";
        break;
      case 'auth/weak-password':
        messageElement.textContent = "Сул нууц үг байна!";
        break;
      default:
        messageElement.textContent = "Алдаа гарлаа: " + error.message;
    }
  }
});