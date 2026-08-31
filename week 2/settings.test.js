const assert = require('assert');
const { validateName, validateEmail } = require('./settings');

function runTests() {
    console.log("Running validation tests...");
    
    // Name validation tests
    assert.strictEqual(validateName(''), "Name is required.");
    assert.strictEqual(validateName('   '), "Name is required.");
    assert.strictEqual(validateName('A'), "Name must be at least 2 characters long.");
    assert.strictEqual(validateName('Alice'), null);
    
    // Email validation tests
    assert.strictEqual(validateEmail(''), "Email is required.");
    assert.strictEqual(validateEmail('invalid-email'), "Please enter a valid email address.");
    assert.strictEqual(validateEmail('test@.com'), "Please enter a valid email address.");
    assert.strictEqual(validateEmail('test@domain.com'), null);
    
    console.log("All tests passed!");
}

runTests();
