const { validateName, validateEmail, validateResponseStyle } = require('./validation');

describe('Validation Logic', () => {
  describe('validateName', () => {
    it('should return error if name is empty', () => {
      expect(validateName('')).toBe('Name is required.');
    });

    it('should return error if name is only whitespace', () => {
      expect(validateName('   ')).toBe('Name is required.');
    });

    it('should return empty string for valid name', () => {
      expect(validateName('John Doe')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should return error if email is empty', () => {
      expect(validateEmail('')).toBe('Email is required.');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address.');
      expect(validateEmail('test@test')).toBe('Please enter a valid email address.');
    });

    it('should return empty string for valid email', () => {
      expect(validateEmail('test@example.com')).toBe('');
    });
  });

  describe('validateResponseStyle', () => {
    it('should return error if response style is empty', () => {
      expect(validateResponseStyle('')).toBe('Response style is required.');
    });

    it('should return error if response style is invalid', () => {
      expect(validateResponseStyle('invalid-style')).toBe('Invalid response style selected.');
    });

    it('should return empty string for valid response styles', () => {
      expect(validateResponseStyle('concise')).toBe('');
      expect(validateResponseStyle('balanced')).toBe('');
      expect(validateResponseStyle('detailed')).toBe('');
    });
  });
});
