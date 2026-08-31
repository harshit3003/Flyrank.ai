/**
 * Validates a name string.
 * @param {string} name - The name to validate.
 * @returns {string|null} - Error message if invalid, null if valid.
 */
function validateName(name) {
    if (!name || name.trim().length === 0) {
        return "Name is required.";
    }
    if (name.trim().length < 2) {
        return "Name must be at least 2 characters long.";
    }
    return null;
}

/**
 * Validates an email string.
 * @param {string} email - The email to validate.
 * @returns {string|null} - Error message if invalid, null if valid.
 */
function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return "Email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }
    return null;
}

// Export for testing if running in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateName, validateEmail };
}
