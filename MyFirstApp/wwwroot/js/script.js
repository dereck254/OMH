/* -------------------------
   Ongaro Medical Hub - JS
   ------------------------- */

// ---- Global Variables ----
let patientList = JSON.parse(localStorage.getItem("patients")) || [];
let hospitalCounter = localStorage.getItem("hospitalCounter")
    ? parseInt(localStorage.getItem("hospitalCounter"))
    : 1000;

// ---- Audio for Feedback ----
const successSound = new Audio("assets/sounds/success.mp3");
const errorSound = new Audio("assets/sounds/error.mp3");

// ---- Loader Control ----
function showLoader(message = "Please wait...") {
    const loaderDiv = document.createElement("div");
    loaderDiv.id = "loader-overlay";
    loaderDiv.style.position = "fixed";
    loaderDiv.style.top = "0";
    loaderDiv.style.left = "0";
    loaderDiv.style.width = "100%";
    loaderDiv.style.height = "100%";
    loaderDiv.style.background = "rgba(255,255,255,0.9)";
    loaderDiv.style.display = "flex";
    loaderDiv.style.flexDirection = "column";
    loaderDiv.style.justifyContent = "center";
    loaderDiv.style.alignItems = "center";
    loaderDiv.innerHTML = `
        <div class="loader"></div>
        <p style="margin-top:15px;font-weight:bold;">${message}</p>
    `;
    document.body.appendChild(loaderDiv);
}

function hideLoader() {
    const loaderDiv = document.getElementById("loader-overlay");
    if (loaderDiv) loaderDiv.remove();
}

// ---- Generate Unique Hospital Number ----
function generateHospitalNumber() {
    hospitalCounter++;
    localStorage.setItem("hospitalCounter", hospitalCounter);
    return "OMH" + hospitalCounter;
}

// ---- Auto Fill Date & Time ----
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return { date, time };
}

// ---- Admin Login ----
function adminLogin(event) {
    event.preventDefault();

    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    showLoader("Logging you in...");

    setTimeout(() => {
        hideLoader();
        if (username === "Dereck" && password === "1234") {
            successSound.play();
            alert("Login successful! Welcome, Admin.");
            window.location.href = "admin-dashboard.html";
        } else {
            errorSound.play();
            alert("Invalid login! Try again.");
        }
    }, 1500);
}

// ---- Register Patient ----
function registerPatient(event) {
    event.preventDefault();

    const name = document.getElementById("patient-name").value;
    const dob = document.getElementById("patient-dob").value;
    const gender = document.getElementById("patient-gender").value;

    const hospitalNumber = generateHospitalNumber();
    const { date, time } = getCurrentDateTime();

    const patient = {
        hospitalNumber,
        name,
        dob,
        gender,
        registeredDate: date,
        registeredTime: time
    };

    patientList.push(patient);
    localStorage.setItem("patients", JSON.stringify(patientList));

    showLoader("Registering patient...");

    setTimeout(() => {
        hideLoader();
        successSound.play();
        alert(`Patient registered successfully!\nHospital No: ${hospitalNumber}`);
        document.getElementById("register-form").reset();
    }, 1500);
}

// ---- Patient Login ----
function patientLogin(event) {
    event.preventDefault();

    const hospitalNo = document.getElementById("patient-hospital").value.trim();
    const dobYear = document.getElementById("patient-dob-login").value.trim();

    showLoader("Validating patient...");

    setTimeout(() => {
        hideLoader();
        const found = patientList.find(p =>
            p.hospitalNumber === hospitalNo && p.dob.includes(dobYear)
        );

        if (found) {
            successSound.play();
            alert("Login successful! Welcome " + found.name);
            window.location.href = "patient-dashboard.html";
        } else {
            errorSound.play();
            alert("Invalid details. Please try again.");
        }
    }, 1500);
}
