// self-check.js - FINAL MODIFIED VERSION

// Handle form submission and scoring
const form = document.getElementById("assessmentForm");
const resultSection = document.getElementById("resultSection");
const scoreText = document.getElementById("scoreText");
const messageText = document.getElementById("messageText");
const guidanceMild = document.getElementById("guidanceMild");
const guidanceModerate = document.getElementById("guidanceModerate");
const guidanceSevere = document.getElementById("guidanceSevere");
// Changed from selectElements to radioInputs
const radioInputs = form.querySelectorAll("input[type='radio']"); 

// --- INTERACTIVITY 1: Live Value Display for Radio Buttons ---
radioInputs.forEach(radio => {
    radio.addEventListener("change", function() {
        // Only run if this radio button is checked
        if (this.checked) {
            const qName = this.name; 
            const valueDisplay = document.getElementById(`value-${qName}`);
            
            if (valueDisplay) {
                // Find the text of the selected option (the sibling .option-text)
                const optionText = this.closest('.radio-option').querySelector('.option-text').textContent;
                
                // Display the selected text and the score value
                valueDisplay.textContent = `Selected: ${optionText} (${this.value} pts)`;
            }
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

// --- ORIGINAL SUBMISSION LOGIC (with updated validation and thresholds) ---
form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Input Validation: Check if all 9 questions have been answered
    // Total questions are now 9 (q1-q9)
    const allAnswered = Array.from({length: 9}, (_, i) => form.querySelector(`input[name="q${i+1}"]:checked`));
    if (allAnswered.includes(null)) {
        alert("Please answer all 9 questions before submitting.");
        return;
    }

    // Read values and calculate total score
    const formData = new FormData(form);
    let total = 0;
    let highRisk = false;
    let questionCount = 0;

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("q")) {
            questionCount++;
            const num = Number(value);
            total += num;

            // Question 5 check (suicidal/self-harm ideation)
            if (key === "q5" && num >= 3) {
                highRisk = true;
            }
        }
    }
    
    // Safety check - should always be 9 if validation passed
    if (questionCount !== 9) {
        console.error("Scoring error: Did not process 9 questions.");
        return;
    }

    // Reset guidance visibility
    guidanceMild.classList.add("hidden");
    guidanceModerate.classList.add("hidden");
    guidanceSevere.classList.add("hidden");

    // Decide message based on score (New Max Score: 28)
    // Low: 0-6 | Moderate: 7-14 | Severe: 15+ or highRisk.
    let level = "";
    if (highRisk || total > 14) { 
        level = "severe"; 
    } else if (total <= 6) {
        level = "low";
    } else { // 7 to 14
        level = "moderate";
    } 

    // Set texts and show appropriate guidance
    scoreText.textContent = `Your total score is ${total} out of 28. This suggests a ${level.toUpperCase()} level of emotional distress.`;

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
