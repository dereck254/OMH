/* =====================================
   Ongaro Medical Hub - app.js
===================================== */

// ---------- Sound Effects ----------
const successSound = new Audio("../assets/sounds/success.mp3");
const errorSound = new Audio("../assets/sounds/error.mp3");

// ---------- Utility Functions ----------
function showLoader(message = "Please wait...") {
    const loader = document.createElement("div");
    loader.className = "loader-overlay";
    loader.innerHTML = `
    <div class="loader"></div>
    <p>${message}</p>
  `;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.querySelector(".loader-overlay");
    if (loader) loader.remove();
}

// ---------- Local Storage Helpers ----------
function getPatients() {
    return JSON.parse(localStorage.getItem("patients")) || [];
}

function savePatients(patients) {
    localStorage.setItem("patients", JSON.stringify(patients));
}

function generateHospitalNumber() {
    const patients = getPatients();
    const count = patients.length + 1;
    return `OMH${String(count).padStart(4, "0")}`;
}

// ---------- Admin Login ----------
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById("admin-username").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    showLoader("Logging you in...");

    setTimeout(() => {
        hideLoader();
        if (username === "Dereck" && password === "1234") {
            successSound.play();
            alert("Login successful! Redirecting...");
            window.location.href = "admin-dashboard.html";
        } else {
            errorSound.play();
            alert("Invalid credentials. Try again.");
        }
    }, 1500);
}

// ---------- Patient Registration ----------
function handleRegisterPatient(e) {
    e.preventDefault();
    const name = document.getElementById("patient-name").value.trim();
    const dob = document.getElementById("patient-dob").value.trim();
    const gender = document.getElementById("patient-gender").value;
    const condition = document.getElementById("patient-condition").value.trim();

    const hospitalNumber = generateHospitalNumber();
    const registrationDate = new Date();
    const registeredAt = registrationDate.toLocaleString();

    const patient = {
        hospitalNumber,
        name,
        dob,
        gender,
        condition,
        registeredAt
    };

    const patients = getPatients();
    patients.push(patient);
    savePatients(patients);

    showLoader("Registering patient...");

    setTimeout(() => {
        hideLoader();
        successSound.play();
        alert(
            `Patient Registered!\nHospital No: ${hospitalNumber}\nName: ${name}\nRegistered At: ${registeredAt}`
        );
        document.getElementById("register-form").reset();
    }, 1500);
}

// ---------- Patient Login ----------
function handlePatientLogin(e) {
    e.preventDefault();
    const hospitalNo = document.getElementById("patient-hospital-no").value.trim();
    const yearOfBirth = document.getElementById("patient-yob").value.trim();

    const patients = getPatients();
    const patient = patients.find(
        (p) => p.hospitalNumber === hospitalNo && p.dob.startsWith(yearOfBirth)
    );

    showLoader("Verifying patient...");

    setTimeout(() => {
        hideLoader();
        if (patient) {
            successSound.play();
            alert(`Welcome ${patient.name}!`);
            window.location.href = "patient-dashboard.html";
        } else {
            errorSound.play();
            alert("Invalid hospital number or year of birth.");
        }
    }, 1500);
}

// ---------- Attach Event Listeners ----------
document.addEventListener("DOMContentLoaded", () => {
    const adminLoginForm = document.getElementById("admin-login-form");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", handleAdminLogin);
    }

    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegisterPatient);
    }

    const patientLoginForm = document.getElementById("patient-login-form");
    if (patientLoginForm) {
        patientLoginForm.addEventListener("submit", handlePatientLogin);
    }
});
