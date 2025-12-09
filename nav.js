// nav.js - FINAL MODIFIED VERSION (Includes Canvas Logic)

// --- CANVAS BACKGROUND LOGIC START ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a page that should have the animated background
    const pageTitle = document.title;
    const excludePages = ["MindCare Login", "Mental Health Self Check"];

    if (excludePages.includes(pageTitle)) {
        return; // Skip canvas initialization on login and self-check pages
    }

    const body = document.body;
    const canvas = document.createElement('canvas');
    canvas.id = 'dynamic-bg';
    body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.005;

            if (this.alpha <= 0) {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 20;
                this.radius = Math.random() * 2 + 1;
                this.alpha = 0.5;
            }

            this.draw();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            const radius = Math.random() * 2 + 1;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const color = 'rgba(255, 255, 255, 0.5)';
            const velocity = { 
                x: (Math.random() - 0.5) * 0.05, 
                y: -Math.random() * 0.2 - 0.1 
            };
            particles.push(new Particle(x, y, radius, color, velocity));
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        // Use a semi-transparent fill for a subtle trail effect
        ctx.fillStyle = 'rgba(240, 244, 247, 0.1)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
        });
    }
    
    // Start animation if not on excluded page
    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', resizeCanvas);
});
// --- CANVAS BACKGROUND LOGIC END ---


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
            <li><a href="login.html" class="${activePage === 'login' ? 'active' : ''}">Logout</a></li>
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