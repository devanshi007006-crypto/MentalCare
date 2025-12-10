// login.js

// Define demo credentials and strong password requirements
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "StrongPass123!"; // Must meet the strong password criteria below

// Get elements
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberMeCheckbox = document.getElementById("rememberMe");
const passwordHint = document.getElementById("password-hint");
const forgotPasswordLink = document.getElementById("forgotPassword");
const signUpLink = document.getElementById("signUp");


/**
 * Enforces strong password requirements.
 * @param {string} password - The password string to validate.
 * @returns {string|null} - Error message if invalid, or null if valid.
 */
function validatePassword(password) {
    const minLength = 5;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }
    if (!hasUpper) {
        return "Password must include an uppercase letter.";
    }
    if (!hasLower) {
        return "Password must include a lowercase letter.";
    }
    if (!hasNumber) {
        return "Password must include a number.";
    }
    if (!hasSymbol) {
        return "Password must include a symbol (e.g., !, @, #).";
    }
    return null; // Valid
}

// --- INITIAL LOAD CHECK (REMEMBER ME) ---
if (localStorage.getItem('rememberedUsername')) {
    usernameInput.value = localStorage.getItem('rememberedUsername');
    rememberMeCheckbox.checked = true;
}


// --- EVENT LISTENERS ---

// 1. Form Submission
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const u = usernameInput.value.trim();
    const p = passwordInput.value.trim();
    
    // 1a. Validate Password Strength (even though we use a demo pass)
    const passwordError = validatePassword(p);
    if (passwordError) {
        passwordHint.textContent = passwordError;
        passwordHint.classList.remove("hidden");
        return; // Stop login process
    } else {
        passwordHint.classList.add("hidden");
    }

    // 1b. Validate Demo Credentials
    if (u === DEMO_USERNAME && p === DEMO_PASSWORD) {
        
        // Handle "Remember Me" functionality
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', u);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // Redirect to home page
        alert("Login Successful! Welcome to MindCare.");
        window.location.href = "home.html";
    } else {
        alert("Login Failed: Incorrect username or password, or password does not meet strength requirements.");
    }
});

// 2. Auxiliary Link Placeholders (In a real app, these would navigate or trigger modals)
forgotPasswordLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Functionality not available in this demo. In a real application, this would take you to a password reset page.");
});

signUpLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert("Functionality not available in this demo. In a real application, this would take you to a registration page.");
});