// Simple Test Script for settings form validation logic
// Tests are run in isolation via node

const { validateName, validateEmail } = require('./settings.js');
const assert = require('assert');

console.log("Running isolated unit tests for settings form validation...\n");

let passed = 0;
let failed = 0;

function runTest(testName, testFn) {
    try {
        testFn();
        console.log(`✅ ${testName}`);
        passed++;
    } catch (error) {
        console.error(`❌ ${testName} - FAILED`);
        console.error(`   ${error.message}`);
        failed++;
    }
}

// Test Suite: Name Validation
runTest("Name >= 2 characters should be valid", () => {
    assert.strictEqual(validateName('Alice'), true);
});

runTest("Name < 2 characters should be invalid", () => {
    assert.strictEqual(validateName('A'), false);
});

runTest("Whitespace-only name should be invalid", () => {
    assert.strictEqual(validateName('   '), false);
});

runTest("Name with padding but >= 2 chars should be valid", () => {
    assert.strictEqual(validateName('  Bo  '), true);
});

// Test Suite: Email Validation
runTest("Valid email should pass", () => {
    assert.strictEqual(validateEmail('test@example.com'), true);
});

runTest("Missing @ and domain should fail", () => {
    assert.strictEqual(validateEmail('invalid-email'), false);
});

runTest("Missing domain name should fail", () => {
    assert.strictEqual(validateEmail('test@.com'), false);
});

runTest("Missing local part should fail", () => {
    assert.strictEqual(validateEmail('@example.com'), false);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
    process.exit(1);
}
