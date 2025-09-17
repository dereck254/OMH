// workflow.js - Ongaro Medical Hub Full Workflow

document.addEventListener("DOMContentLoaded", () => {

    // ===============================
    // Smooth Page Transition Toast
    // ===============================
    const pageLinks = document.querySelectorAll("nav a");
    pageLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const href = this.href;

            showPageToast("Please wait...");

            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        });
    });

    function showPageToast(message) {
        const existingToast = document.querySelector(".toast");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.className = "toast";
        Object.assign(toast.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 30px",
            borderRadius: "10px",
            backgroundColor: "#0077b6",
            color: "#fff",
            fontSize: "16px",
            textAlign: "center",
            zIndex: 1000,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            opacity: 0,
            transition: "opacity 0.5s"
        });
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = 1, 50);
        setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 500); }, 1500);
    }

    // ===============================
    // Admin Login with Toast
    // ===============================
    const adminForm = document.getElementById("adminLoginForm");
    if (adminForm) {
        const defaultCredentials = { username: "Dereck", password: "1234" };

        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = adminForm.username.value.trim();
            const password = adminForm.password.value.trim();

            const existingToast = document.querySelector(".toast");
            if (existingToast) existingToast.remove();

            const toast = document.createElement("div");
            toast.className = "toast";
            Object.assign(toast.style, {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "20px 30px",
                borderRadius: "10px",
                backgroundColor: "#333",
                color: "#fff",
                fontSize: "16px",
                textAlign: "center",
                zIndex: 1000,
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                opacity: 0,
                transition: "opacity 0.5s"
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.style.opacity = 1, 50);

            if (username === defaultCredentials.username && password === defaultCredentials.password) {
                toast.textContent = "✅ Login Successful!";
                toast.style.backgroundColor = "#28a745";
                setTimeout(() => {
                    toast.style.opacity = 0;
                    setTimeout(() => window.location.href = "admin-dashboard.html", 500);
                }, 2000);
            } else {
                toast.textContent = "❌ Incorrect Username or Password!";
                toast.style.backgroundColor = "#dc3545";
                setTimeout(() => {
                    toast.style.opacity = 0;
                    setTimeout(() => toast.remove(), 500);
                }, 2000);
            }
        });
    }

    // ===============================
    // Patient Registration / Edit / Delete
    // ===============================
    const patientForm = document.getElementById("patientForm");
    if (!patientForm) return;

    const hospitalNumber = document.getElementById("hospitalNumber");
    const regDate = document.getElementById("regDate");
    const patientRecords = document.getElementById("patientRecords");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const submitBtn = patientForm.querySelector("button[type='submit']");

    let editIndex = null;
    let patients = JSON.parse(localStorage.getItem("patients")) || [];

    // Get next hospital number without incrementing yet
    function getNextHospitalNumber() {
        let lastNo = parseInt(localStorage.getItem("lastHospitalNumber")) || 0;
        return "OMH-" + String(lastNo + 1).padStart(3, "0");
    }

    function renderPatients(list = patients) {
        patientRecords.innerHTML = "";
        if (list.length === 0) {
            patientRecords.innerHTML = `<tr><td colspan="10" style="text-align:center;">No patients registered yet.</td></tr>`;
            return;
        }

        list.forEach((p, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.hospitalNumber}</td>
                <td>${p.firstName}</td>
                <td>${p.lastName}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>${p.email}</td>
                <td>${p.county || ''}</td>
                <td>${p.regDate}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}" style="background-color:red;color:#fff;">Delete</button>
                </td>
            `;
            patientRecords.appendChild(tr);
        });
    }

    function showToast(message, success = true) {
        const existingToast = document.querySelector(".toast");
        if (existingToast) existingToast.remove();

        const toast = document.createElement("div");
        toast.className = "toast";
        Object.assign(toast.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 30px",
            borderRadius: "10px",
            backgroundColor: success ? "#28a745" : "#dc3545",
            color: "#fff",
            fontSize: "16px",
            textAlign: "center",
            zIndex: 1000,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            opacity: 0,
            transition: "opacity 0.5s"
        });

        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = 1, 50);
        setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 500); }, 2000);
    }

    function resetForm() {
        patientForm.reset();
        hospitalNumber.value = getNextHospitalNumber();
        regDate.value = new Date().toLocaleString();
        editIndex = null;
        submitBtn.textContent = "Register";
        submitBtn.disabled = false;
    }

    patientForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();

        if (!firstName || !lastName) { showToast("Please enter first and last name", false); return; }

        const patientData = {
            hospitalNumber: hospitalNumber.value,
            regDate: regDate.value,
            firstName,
            lastName,
            age: document.getElementById("patientAge").value,
            gender: document.getElementById("patientGender").value,
            phone: document.getElementById("patientPhone").value.trim(),
            email: document.getElementById("patientEmail").value.trim(),
            county: document.getElementById("patientAddress").value.trim()
        };

        if (!/^\d{10}$/.test(patientData.phone)) { showToast("Phone must be 10 digits", false); return; }

        submitBtn.disabled = true;
        submitBtn.textContent = editIndex === null ? "Registering..." : "Updating...";

        setTimeout(() => {
            if (editIndex === null) {
                const duplicate = patients.some(p => p.phone === patientData.phone || (patientData.email && p.email === patientData.email));
                if (duplicate) { showToast("Duplicate patient!", false); submitBtn.disabled = false; submitBtn.textContent = "Register"; return; }

                // Increment hospital number only after successful registration
                let lastNo = parseInt(localStorage.getItem("lastHospitalNumber")) || 0;
                localStorage.setItem("lastHospitalNumber", lastNo + 1);

                patients.push(patientData);
                showToast("✅ Patient registered successfully!");
            } else {
                patients[editIndex] = patientData;
                showToast("✅ Patient updated successfully!");
            }

            localStorage.setItem("patients", JSON.stringify(patients));
            renderPatients();
            resetForm();
        }, 2000);
    });

    // Edit/Delete
    patientRecords.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (e.target.classList.contains("edit-btn")) {
            editIndex = index;
            const p = patients[index];
            hospitalNumber.value = p.hospitalNumber;
            regDate.value = p.regDate;
            document.getElementById("firstName").value = p.firstName;
            document.getElementById("lastName").value = p.lastName;
            document.getElementById("patientAge").value = p.age;
            document.getElementById("patientGender").value = p.gender;
            document.getElementById("patientPhone").value = p.phone;
            document.getElementById("patientEmail").value = p.email;
            document.getElementById("patientAddress").value = p.county;
            submitBtn.textContent = "Update";
        }

        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this patient?")) {
                patients.splice(index, 1);
                localStorage.setItem("patients", JSON.stringify(patients));
                renderPatients();
                resetForm();
            }
        }
    });

    // Search
    searchBtn.addEventListener("click", () => {
        const term = searchInput.value.toLowerCase();
        const results = patients.filter(
            p => p.hospitalNumber.toLowerCase().includes(term) ||
                p.firstName.toLowerCase().includes(term) ||
                p.lastName.toLowerCase().includes(term) ||
                p.phone.includes(term)
        );
        renderPatients(results);
    });

    // Initialize
    resetForm();
    renderPatients();
});