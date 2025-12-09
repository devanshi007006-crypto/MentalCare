// self-check.js - FINAL MODIFIED VERSION

// Handle form submission and scoring
const form = document.getElementById("assessmentForm");
const resultSection = document.getElementById("resultSection");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const guidanceMild = document.getElementById("guidanceMild");
const guidanceModerate = document.getElementById("guidanceModerate");
const guidanceSevere = document.getElementById("guidanceSevere");
const selectElements = form.querySelectorAll("select");

// --- INTERACTIVITY 1: Live Value Display ---
selectElements.forEach(select => {
    select.addEventListener("change", function() {
        const valueDisplay = document.getElementById(`value-q${select.name.slice(1)}`);
        if (valueDisplay && select.value !== "") {
            // Display the text of the selected option and the score value
            const selectedOption = select.options[select.selectedIndex];
            valueDisplay.textContent = `Selected: ${selectedOption.text} (${selectedOption.value} pts)`;
        } else if (valueDisplay) {
             // Clear the display if 'Select an option' is chosen
            valueDisplay.textContent = "";
        }
    });
});

// --- INTERACTIVITY 2: Reset Button Handler ---
const resetButton = document.getElementById("resetForm");
if (resetButton) {
    resetButton.addEventListener("click", function() {
        form.reset();
        resultSection.classList.add("hidden");
        // Clear all live feedback displays
        form.querySelectorAll(".selected-value").forEach(span => {
            span.textContent = "";
        });
        alert("Form answers have been reset.");
    });
}

// --- ORIGINAL SUBMISSION LOGIC (with added validation) ---
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Input Validation: Check if all questions have been answered
    const allAnswered = Array.from(selectElements).every(select => select.value !== "");
    if (!allAnswered) {
        alert("Please answer all questions before submitting.");
        return;
    }

    // Read values and calculate total score
    const formData = new FormData(form);
    let total = 0;
    let highRisk = false;

    for (const [key, value] of formData.entries()) {
        const num = Number(value);
        total += num;

        // Question 5 check
        if (key === "q5" && num >= 3) {
            highRisk = true;
        }
    }

    // Reset guidance visibility
    guidanceMild.classList.add("hidden");
    guidanceModerate.classList.add("hidden");
    guidanceSevere.classList.add("hidden");

    // Decide message based on score
    let level = "";
    if (highRisk || total > 7) {
        level = "severe"; 
    } else if (total <= 3) {
        level = "low";
    } else if (total <= 7) {
        level = "moderate";
    } 

    // Set texts and show appropriate guidance
    scoreText.textContent = `Your total score is ${total}. This suggests a ${level.toUpperCase()} level of emotional distress.`;

    if (level === "low") {
        messageText.textContent =
            "Your answers suggest that you may be experiencing mild or occasional challenges. Paying attention to your wellbeing and using self-care can still be very helpful.";
        guidanceMild.classList.remove("hidden");
    } else if (level === "moderate") {
        messageText.textContent =
            "Your answers suggest that stress, low mood, or anxiety may be affecting you. It could be helpful to reach out for support and talk with a professional or someone you trust.";
        guidanceModerate.classList.remove("hidden");
    } else { // severe
        messageText.textContent =
            "Your answers suggest you may be going through significant distress. Please consider reaching out to a mental health professional and to someone you trust as soon as you can.";
        guidanceSevere.classList.remove("hidden");
    }

    // Show result section
    resultSection.classList.remove("hidden");

    // Scroll to results on small screens
    resultSection.scrollIntoView({ behavior: "smooth" });
});