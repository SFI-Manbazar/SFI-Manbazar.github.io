// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAa0LrJUZSgVFQnCPiAv4BEcw9zPR6sPyk",
    authDomain: "sfi-manbazar-lc.firebaseapp.com",
    databaseURL: "https://sfi-manbazar-lc-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "sfi-manbazar-lc",
    storageBucket: "sfi-manbazar-lc.appspot.com",
    messagingSenderId: "779041973349",
    appId: "1:779041973349:web:903f65e78ee8c95238128c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const newsletterRef = ref(db, 'NewsLetter');

// Helper functions
function displaySuccess(message) {
    const validatorNewsletter = document.getElementById('validator-newsletter');
    validatorNewsletter.innerHTML = `<p>${message}</p>`;
    validatorNewsletter.style.color = 'green';
}

function displayError(message) {
    const validatorNewsletter = document.getElementById('validator-newsletter');
    validatorNewsletter.innerHTML = `<p>${message}</p>`;
    validatorNewsletter.style.color = 'red';
}

function textRead(text) {
    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speechSynthesis.speak(speech);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function checkEmailExists(email) {
    const snapshot = await get(newsletterRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data).some(entry => entry.email === email);
    }
    return false;
}

async function handleSubscription(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value;

    if (isValidEmail(email)) {
        const emailExists = await checkEmailExists(email);

        if (!emailExists) {
            push(newsletterRef, { email })
                .then(() => {
                    displaySuccess("Successfully Subscribed To The Newsletter!");
                    textRead("Successfully Subscribed To The Newsletter!");
                    document.getElementById('newsletterForm').reset();
                })
                .catch((error) => {
                    console.error("Error Subscribing To The Newsletter:", error);
                    displayError("An Error Occurred. Please Try Again Later.");
                    textRead("An Error Occurred. Please Try Again Later.");
                });
        } else {
            displayError("This Email Is Already Subscribed.");
            textRead("This Email Is Already Subscribed.");
        }
    } else {
        displayError("Please Enter A Valid Email Address.");
        textRead("Please Enter A Valid Email Address.");
    }
}

// Attach the event listener
document.getElementById('newsletterForm').addEventListener('submit', handleSubscription);
