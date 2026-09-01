const { validateUsername, validateEmail, validatePassword } = require('./validation');

describe('Validation Logic', () => {
  describe('validateUsername', () => {
    it('should return error if username is empty', () => {
      expect(validateUsername('')).toBe('Username is required.');
    });

    it('should return error if username is too short', () => {
      expect(validateUsername('ab')).toBe('Username must be between 3 and 20 characters.');
    });

    it('should return error if username contains special characters', () => {
      expect(validateUsername('user!name')).toBe('Username can only contain letters, numbers, and underscores.');
    });

    it('should return empty string for valid username', () => {
      expect(validateUsername('valid_user123')).toBe('');
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

  describe('validatePassword', () => {
    it('should allow empty password (optional in settings)', () => {
      expect(validatePassword('')).toBe('');
    });

    it('should return error if password is too short', () => {
      expect(validatePassword('Short1!')).toBe('Password must be at least 8 characters long.');
    });

    it('should return error if password lacks lowercase letter', () => {
      expect(validatePassword('NOLOWERCASE123')).toBe('Password must contain at least one lowercase letter.');
    });

    it('should return error if password lacks uppercase letter', () => {
      expect(validatePassword('nouppercase123')).toBe('Password must contain at least one uppercase letter.');
    });

    it('should return error if password lacks a number', () => {
      expect(validatePassword('NoNumberHere')).toBe('Password must contain at least one number.');
    });

    it('should return empty string for valid password', () => {
      expect(validatePassword('ValidPass123')).toBe('');
    });
  });
});
