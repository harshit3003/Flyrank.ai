// Settings Form Validation Logic

let settingsForm, nameInput, emailInput, submitBtn, formFeedback;
if (typeof document !== 'undefined') {
    settingsForm = document.getElementById('settingsForm');
    nameInput = document.getElementById('nameInput');
    emailInput = document.getElementById('emailInput');
    submitBtn = document.getElementById('submitBtn');
    formFeedback = document.getElementById('formFeedback');
}

// Pure Validation Functions (isolated for testing)
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Update UI based on validation
function updateFieldState(input, isValid, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (!isValid) {
        input.setAttribute('aria-invalid', 'true');
        errorElement.style.display = 'block';
    } else {
        input.setAttribute('aria-invalid', 'false');
        errorElement.style.display = 'none';
    }
}

// Global Form Validity Check
function checkFormValidity() {
    const isNameValid = validateName(nameInput.value);
    const isEmailValid = validateEmail(emailInput.value);
    
    // Disable button if form is invalid (Rule 3)
    if (isNameValid && isEmailValid) {
        submitBtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'true');
    }
}

// Event Handler for Validation (covers input and blur)
function handleValidationEvent(event) {
    const target = event.target;
    
    if (target.id === 'nameInput') {
        updateFieldState(nameInput, validateName(nameInput.value), 'nameError');
    } else if (target.id === 'emailInput') {
        updateFieldState(emailInput, validateEmail(emailInput.value), 'emailError');
    }
    
    checkFormValidity();
}

// Initialization in browser environment
if (typeof window !== 'undefined' && settingsForm) {
    // Real-time validation on typing
    nameInput.addEventListener('input', handleValidationEvent);
    emailInput.addEventListener('input', handleValidationEvent);
    
    // Address edge case: validating on blur for users tabbing through without typing
    nameInput.addEventListener('blur', handleValidationEvent);
    emailInput.addEventListener('blur', handleValidationEvent);

    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Final sanity check
        const isNameValid = validateName(nameInput.value);
        const isEmailValid = validateEmail(emailInput.value);
        
        if (!isNameValid || !isEmailValid) {
            updateFieldState(nameInput, isNameValid, 'nameError');
            updateFieldState(emailInput, isEmailValid, 'emailError');
            return;
        }

        // Rule 3: Prevent double-submission states during network requests
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Saving...';
        formFeedback.textContent = '';
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Restore State on Success
        submitBtn.removeAttribute('disabled');
        submitBtn.textContent = 'Save Settings';
        formFeedback.textContent = 'Settings saved successfully!';
        formFeedback.style.color = '#28a745'; // Green text
    });
}

// Export functions for isolation tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateName, validateEmail };
}
