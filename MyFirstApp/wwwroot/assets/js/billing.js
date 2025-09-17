document.addEventListener("DOMContentLoaded", () => {
    // ======= Billing Officer Login =======
    const loginForm = document.getElementById("billingLoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (username === "Pesa" && password === "1234") {
                window.location.href = "billing-and-payment.html";
            } else {
                alert("Incorrect credentials!");
            }
        });
    }

    // ======= Billing Dashboard =======
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
            <td>${p.firstName}</td>
            <td>${p.lastName}</td>
            <td>${p.phone}</td>
            <td>${p.email}</td>
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

    // ======= Dashboard Actions =======
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
                        <head><title>Receipt</title></head>
                        <body style="font-family:Arial,sans-serif;font-size:14px;">
                        <img src="assets/images/logo.png" style="width:80px;"><h2>Ongaro Medical Hub</h2>
                        <p>Patient: ${patient.firstName} ${patient.lastName}</p>
                        <p>Hospital No: ${patient.hospitalNumber}</p>
                        <p>Phone: ${patient.phone}</p>
                        <p>Email: ${patient.email}</p>
                        <p>Reason: Consultation Fees</p>
                        <p>Amount: 1000</p>
                        <p>Status: ${patient.status}</p>
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
                payNowModal.style.display = "block";
                paymentInstructions.innerHTML = "";
            }
        });
    }

    // ======= Logout =======
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "logout.html"; // Corrected
        });
    }

    // ======= Pay Now Modal =======
    const payNowModal = document.getElementById("payNowModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const paymentInstructions = document.getElementById("paymentInstructions");

    closeModalBtn.addEventListener("click", () => {
        payNowModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === payNowModal) {
            payNowModal.style.display = "none";
        }
    });

    document.querySelectorAll(".payment-option").forEach(btn => {
        btn.addEventListener("click", () => {
            const method = btn.dataset.method;
            let instructions = "";
            switch(method) {
                case "mpesa":
                    instructions = `
                    1. Open your M-PESA menu.<br>
                    2. Select 'Lipa na M-PESA'.<br>
                    3. Enter Business Number: <strong>542542</strong>.<br>
                    4. Enter Account Number: <strong>00104276293050</strong>.<br>
                    5. Enter Amount: <strong>KES 1000</strong>.<br>
                    6. Enter PIN and confirm.<br>
                    7. Wait for confirmation SMS.`;
                    break;
                case "paybill":
                    instructions = `
                    1. Open M-PESA menu.<br>
                    2. Select 'Paybill'.<br>
                    3. Enter Business Number: <strong>8807680</strong>.<br>
                    4. Enter Account Number: <strong>Patient Name/Hospital No</strong>.<br>
                    5. Enter Amount: <strong>KES 1000</strong>.<br>
                    6. Enter PIN and confirm.<br>
                    7. Wait for confirmation SMS.`;
                    break;
                case "paypal":
                    instructions = `
                    1. Go to PayPal website or app.<br>
                    2. Send payment to: <strong>ongaromedicalhub.info@gmail.com</strong>.<br>
                    3. Enter Amount: <strong>KES 1000</strong>.<br>
                    4. Complete the transaction.<br>
                    5. Save receipt for reference.`;
                    break;
            }
            paymentInstructions.innerHTML = instructions;
        });
    });
});
