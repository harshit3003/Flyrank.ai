function validateName(name) {
  if (!name || name.trim() === '') return 'Name is required.';
  return '';
}

function validateEmail(email) {
  if (!email) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return '';
}

function validateResponseStyle(style) {
  const validStyles = ['concise', 'balanced', 'detailed'];
  if (!style) return 'Response style is required.';
  if (!validStyles.includes(style)) return 'Invalid response style selected.';
  return '';
}

// Export for Jest testing if running in Node, otherwise available globally in the browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateName, validateEmail, validateResponseStyle };
}
