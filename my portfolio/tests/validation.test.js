import test from 'node:test';
import assert from 'node:assert/strict';
import { validateField } from '../assets/js/validation.js';

test('validateField - returns valid for correct input', () => {
    const mockInput = {
        validity: {
            valueMissing: false,
            typeMismatch: false
        },
        type: 'text'
    };

    const result = validateField(mockInput);
    assert.equal(result.isValid, true);
    assert.equal(result.errorMessage, '');
});

test('validateField - returns error when value is missing', () => {
    const mockInput = {
        validity: {
            valueMissing: true,
            typeMismatch: false
        },
        type: 'text'
    };

    const result = validateField(mockInput);
    assert.equal(result.isValid, false);
    assert.equal(result.errorMessage, 'This field is required.');
});

test('validateField - returns error when email is invalid format', () => {
    const mockInput = {
        validity: {
            valueMissing: false,
            typeMismatch: true
        },
        type: 'email'
    };

    const result = validateField(mockInput);
    assert.equal(result.isValid, false);
    assert.equal(result.errorMessage, 'Please enter a valid email address.');
});
