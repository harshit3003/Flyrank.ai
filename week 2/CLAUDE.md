# Project Development Rules

Based on lessons learned from previous iterations, the following concrete rules must be strictly followed:

## 1. Form Validation and Edge Cases
* **Whitespace Validation:** All required text inputs must explicitly validate against whitespace-only strings using `.trim()` (e.g., `value.trim() === ''`) rather than relying solely on regex, and must return a clear "required" error message.
* **Testing Edge Cases:** Every form field validation function must include specific unit tests in `validation.test.js` covering both completely empty strings and whitespace-only strings.

## 2. Event Binding
* **Dynamic Event Listeners:** Form event listeners must be dynamically bound based on the element's `tagName`. Do not apply a blanket `'input'` event to all fields. Specifically, use the `'change'` event for `<select>` elements and the `'input'` event for standard text inputs to ensure reliable real-time validation.

## 3. Accessibility (ARIA)
* **Error State Bindings:** Any new interactive form element (including `<select>`, `<textarea>`, etc.) must include `aria-invalid="false"` and `aria-describedby="[field]-error"` attributes. These must be linked to a dedicated `<span>` error container equipped with `role="alert"` and `aria-live="polite"`.

## 4. UI/UX Consistency
* **Custom Dropdown Styling:** Do not rely on default browser styles for `<select>` dropdown arrows, as they break the premium glassmorphism aesthetic. Always implement custom SVG-based background styling for dropdown arrows in `styles.css`.
