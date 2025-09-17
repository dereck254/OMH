document.addEventListener("DOMContentLoaded", () => {
    // ======= Login Forms =======
    const doctorLoginForm = document.getElementById("doctorLoginForm");
    const nurseLoginForm = document.getElementById("nurseLoginForm");
    const pharmacistLoginForm = document.getElementById("pharmacistLoginForm");
    const labLoginForm = document.getElementById("labLoginForm");
    const patientLoginForm = document.getElementById("patientLoginForm");

    const loginForms = [
        { form: doctorLoginForm, redirect: "doctor-dashboard.html" },
        { form: nurseLoginForm, redirect: "nurse-dashboard.html" },
        { form: pharmacistLoginForm, redirect: "pharmacist-dashboard.html" },
        { form: labLoginForm, redirect: "lab-dashboard.html" },
        { form: patientLoginForm, redirect: "patient-dashboard.html" }
    ];

    loginForms.forEach(obj => {
        if (obj.form) {
            obj.form.addEventListener("submit", (e) => {
                e.preventDefault();
                let username, password;
                if (obj.form.id === "patientLoginForm") {
                    username = document.getElementById("hospitalNumber").value.trim();
                    password = document.getElementById("firstName").value.trim();
                    let patients = JSON.parse(localStorage.getItem("patients")) || [];
                    const patient = patients.find(p => p.hospitalNumber === username && p.firstName.toLowerCase() === password.toLowerCase());
                    if (!patient) {
                        alert("Hospital number or first name incorrect!");
                        return;
                    }
                    // store logged in patient info
                    localStorage.setItem("loggedPatient", JSON.stringify(patient));
                } else {
                    username = document.getElementById("username").value.trim();
                    password = document.getElementById("password").value.trim();
                }
                if (username && password) {
                    window.location.href = obj.redirect;
                } else {
                    alert("Please enter credentials!");
                }
            });
        }
    });

    // ======= Logout Buttons =======
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "logout.html";
        });
    }

    // ======= Patient Dashboard =======
    const patientNameEl = document.getElementById("patientName");
    const hospitalNumberEl = document.getElementById("hospitalNumber");
    const paymentStatusEl = document.getElementById("paymentStatus");
    const consultationRecordsEl = document.getElementById("consultationRecords");
    const labTestsEl = document.getElementById("labTests");

    const loggedPatient = JSON.parse(localStorage.getItem("loggedPatient"));
    if (loggedPatient) {
        if (patientNameEl) patientNameEl.textContent = loggedPatient.firstName;
        if (hospitalNumberEl) hospitalNumberEl.textContent = loggedPatient.hospitalNumber;
        if (paymentStatusEl) paymentStatusEl.textContent = loggedPatient.status || "Unpaid";

        // display full patient data
        if (consultationRecordsEl) {
            consultationRecordsEl.innerHTML = `
                <p>Full Name: ${loggedPatient.firstName} ${loggedPatient.lastName}</p>
                <p>Phone: ${loggedPatient.phone}</p>
                <p>Email: ${loggedPatient.email || "N/A"}</p>
                <p>Address: ${loggedPatient.address || "N/A"}</p>
            `;
        }

        if (labTestsEl) {
            labTestsEl.innerHTML = loggedPatient.labTests ? loggedPatient.labTests.join("<br>") : "No lab tests assigned.";
        }
    }

    // ======= Patients Table for Billing / Dashboard =======
    const patientTable = document.getElementById("patientTable")?.getElementsByTagName('tbody')[0];
    let patients = JSON.parse(localStorage.getItem("patients")) || [];

    function renderPatients() {
        if (!patientTable) return;
        patientTable.innerHTML = "";
        if (patients.length === 0) {
            patientTable.innerHTML = `<tr><td colspan="6" style="text-align:center;">No patients registered yet.</td></tr>`;
            return;
        }
        patients.forEach((p, idx) => {
            patientTable.innerHTML += `
                <tr>
                    <td>${p.hospitalNumber}</td>
                    <td>${p.firstName} ${p.lastName}</td>
                    <td>${p.phone}</td>
                    <td>${p.status || "Unpaid"}</td>
                    <td>
                        <button class="pay-btn" data-index="${idx}">Pay Now</button>
                        <button class="mark-paid-btn" data-index="${idx}">Mark Paid</button>
                        <button class="mark-unpaid-btn" data-index="${idx}">Mark Unpaid</button>
                        <button class="print-btn" data-index="${idx}">Print</button>
                    </td>
                </tr>
            `;
        });
    }

    renderPatients();

    // ======= Actions =======
    if (patientTable) {
        patientTable.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            if (index === undefined) return;
            const patient = patients[index];

            if (e.target.classList.contains("mark-paid-btn")) {
                patient.status = "Paid";
                localStorage.setItem("patients", JSON.stringify(patients));
                renderPatients();
            }

            if (e.target.classList.contains("mark-unpaid-btn")) {
                patient.status = "Unpaid";
                localStorage.setItem("patients", JSON.stringify(patients));
                renderPatients();
            }

            if (e.target.classList.contains("print-btn")) {
                const receipt = `
                    <html>
                        <head><title>Payment Receipt</title></head>
                        <body style="font-family:Arial,sans-serif;font-size:14px;">
                        <h2 style="text-align:center;">Payment Receipt</h2>
                        <hr>
                        <img src="assets/images/logo.png" style="width:80px;"><h3>Ongaro Medical Hub</h3>
                        <hr>
                        <p>Patient: ${patient.firstName} ${patient.lastName}</p>
                        <p>Hospital No: ${patient.hospitalNumber}</p>
                        <p>Phone: ${patient.phone}</p>
                        <p>Email: ${patient.email || 'N/A'}</p>
                        <p>Reason: Consultation Fees</p>
                        <p>Amount: 1000</p>
                        <p>Status: ${patient.status}</p>
                        <hr>
                        </body>
                    </html>`;
                const printWin = window.open('', '', 'width=300,height=400');
                printWin.document.write(receipt);
                printWin.document.close();
                printWin.focus();
                printWin.print();
                printWin.close();
            }

            if (e.target.classList.contains("pay-btn")) {
                patient.status = "Paid";
                localStorage.setItem("patients", JSON.stringify(patients));
                renderPatients();
                alert("Payment recorded successfully! Billing office notified.");
            }
        });
    }
});