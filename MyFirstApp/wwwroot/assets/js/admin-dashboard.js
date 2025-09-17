// admin-dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    const dashboardTableBody = document.querySelector("#dashboardPatients tbody");
    if (!dashboardTableBody) return;

    let patients = JSON.parse(localStorage.getItem("patients")) || [];

    function renderDashboardPatients(list = patients) {
        dashboardTableBody.innerHTML = "";
        if (list.length === 0) {
            dashboardTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No patients registered yet.</td></tr>`;
            return;
        }

        list.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.hospitalNumber}</td>
                <td>${p.firstName}</td>
                <td>${p.lastName}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>${p.regDate}</td>
            `;
            dashboardTableBody.appendChild(tr);
        });
    }

    // Initial render
    renderDashboardPatients();

    // Listen for live updates from workflow.js
    window.addEventListener("patientsUpdated", () => {
        patients = JSON.parse(localStorage.getItem("patients")) || [];
        renderDashboardPatients();
    });
});
