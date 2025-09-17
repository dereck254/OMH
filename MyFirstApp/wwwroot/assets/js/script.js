// Highlight the active navigation link
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll("header nav ul li a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

// Contact form validation
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contact-form form");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = form.querySelector("input[name='name']").value.trim();
            const email = form.querySelector("input[name='email']").value.trim();
            const message = form.querySelector("textarea[name='message']").value.trim();

            if (!name || !email || !message) {
                alert("⚠️ Please fill in all fields.");
                return;
            }

            // Basic email check
            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!email.match(emailPattern)) {
                alert("⚠️ Please enter a valid email address.");
                return;
            }

            alert("✅ Thank you! Your message has been submitted.");
            form.reset();
        });
    }
});
