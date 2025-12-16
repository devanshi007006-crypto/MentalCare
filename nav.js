// nav.js - FINAL MODIFIED VERSION

// --- NAVIGATION RENDERING LOGIC (Original Function) ---
function renderNav(activePage) {
    const nav = document.getElementById("mainNav");
    if (!nav) return;

    // Create the HTML structure with the toggle button
    nav.innerHTML = `
        <div class="nav-brand">MindCare</div>
        <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links">☰</button>
        <ul id="nav-links" class="nav-links">
            <li><a href="home.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
            <li><a href="self-check.html" class="${activePage === 'self' ? 'active' : ''}">Self‑Check</a></li>
            <li><a href="guidance.html" class="${activePage === 'guide' ? 'active' : ''}">Guidance</a></li>
            <li><a href="resources.html" class="${activePage === 'res' ? 'active' : ''}">Resources</a></li>
            <li><a href="index.html" class="${activePage === 'login' ? 'active' : ''}">Logout</a></li>
        </ul>
    `;

    // Add event listener for the hamburger menu
    const navToggle = nav.querySelector(".nav-toggle");
    const navLinks = document.getElementById("nav-links");

    navToggle.addEventListener("click", function() {
        const isExpanded = navToggle.getAttribute("aria-expanded") === "true" || false;
        
        // Toggle the 'active-menu' class for visibility (CSS handles the display)
        navLinks.classList.toggle("active-menu");
        
        // Toggle aria-expanded for accessibility
        navToggle.setAttribute("aria-expanded", !isExpanded);
        
        // Change icon based on state (☰ or X)
        navToggle.textContent = isExpanded ? '☰' : '✕';
    });

}

