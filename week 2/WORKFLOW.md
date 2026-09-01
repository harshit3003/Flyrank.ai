# Engineering Case Study: AI Workflow Experiment

This case study compares two AI-driven iterations (Round 1 and Round 2) of a Premium Account Settings form to evaluate the impact of vague versus specification-driven prompting.

## Feature Overview
Both rounds aimed to build a glassmorphism-styled account settings form with real-time validation and accessible error handling.

## Approach Differences
Round 1 relied on a vague prompt, leading the AI to infer standard but unrequested fields like `username` and `password`. Round 2 utilized a precise specification, resulting in an exact implementation of a `name` text input, an `email` field, and a `responseStyle` dropdown (`<select>`).

## Code-Level and Correctness Differences
In Round 1 (`validation.js`), the AI generated a complex, unprompted password regex and a username validator that failed to explicitly handle whitespace strings, returning a confusing "Username can only contain letters..." error. Round 2 replaced these with a `validateName` function that explicitly checks `name.trim() === ''` and a `validateResponseStyle` function that strictly checks against an array of valid styles (`['concise', 'balanced', 'detailed']`).

## Edge Cases, Error Handling, and Testing
Round 2 significantly improved edge case handling. The `trim()` check in Round 2 instantly surfaces a clear "Name is required" error for whitespace-only inputs. Consequently, `validation.test.js` in Round 2 includes a specific unit test (`it('should return error if name is only whitespace')`) to verify this behavior, which was completely absent in Round 1.

## Accessibility and UI/UX
Both rounds achieved strong accessibility by mapping `aria-invalid` and `aria-describedby` to `aria-live="polite"` error spans. However, Round 2 demonstrated better maintainability and UI polish. In `styles.css`, Round 2 successfully grouped `<input>` and `<select>` selectors and implemented a custom SVG background arrow for the `<select>` element to preserve the premium glassmorphism aesthetic over default browser styles.

## Review and Fixing Effort
* **Round 1:** Generation time: [Time Generation Round 1], Review time: [Time Review Round 1], Fixing time: [Time Fixing Round 1].
* **Round 2:** Generation time: [Time Generation Round 2], Review time: [Time Review Round 2], Fixing time: [Time Fixing Round 2].

## AI Mistake Caught
During the Round 2 review, a structural mistake from Round 1 was identified: `main.js` indiscriminately attached an `'input'` event listener to all form fields. This is unreliable for dropdowns. Round 2 fixed this by dynamically checking the element type (`inputs[key].tagName === 'SELECT' ? 'change' : 'input'`), properly binding the `'change'` event to the `<select>` element.

## Conclusion
This experiment demonstrated that vague prompting forces the AI to invent requirements, leading to bloated code, missed edge cases, and incorrect architectural assumptions (like blanket `'input'` events). Specification-driven AI development yields targeted, testable, and robust code, drastically reducing the review and fixing effort required to achieve production readiness.
