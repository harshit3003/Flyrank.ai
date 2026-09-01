function validateUsername(username) {
  if (!username) return 'Username is required.';
  if (username.length < 3 || username.length > 20) return 'Username must be between 3 and 20 characters.';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
  return '';
}

function validateEmail(email) {
  if (!email) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return '';
}

function validatePassword(password) {
  // Optional in settings form
  if (!password) return ''; 
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/(?=.*[0-9])/.test(password)) return 'Password must contain at least one number.';
  return '';
}

// Export for Jest testing if running in Node, otherwise available globally in the browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateUsername, validateEmail, validatePassword };
}
