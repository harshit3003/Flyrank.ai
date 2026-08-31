# AI Prompting Workflow Comparison

This document compares two different approaches to generating a settings form using an AI assistant, specifically contrasting a vague prompt against a precise, constraint-driven prompt.

## Round One: Vague Prompt
**Prompt used:** "Write a settings form."

The initial output was predictably simplistic. The AI generated a basic HTML structure (`settings.html`) containing an uncontrolled form with standard inputs (`text`, `email`, `select`). 
* **Correctness:** While functionally rendering inputs, there was no validation mechanism other than native browser types. Submitting the form triggered a basic `alert()` which is insufficient for production.
* **Accessibility:** No ARIA attributes were used. Labels lacked explicit `for` attributes to bind them to input `id`s, which fails standard WCAG guidelines for screen readers. 
* **Edge Cases:** The form allowed submitting empty or whitespace-only inputs. It didn't handle saving states, loading states, or provide feedback on successful save. 
* **Review Effort:** Fixing this output would require a near-complete rewrite to make it production-ready. The code is only useful as a low-fidelity wireframe.

## Round Two: Precise Prompt
**Prompt used:** "Write a settings form with name, email, and notification preferences. It needs to have real-time validation, accessible ARIA attributes (`aria-invalid`, `aria-describedby`), error messages below inputs, a submit button that disables when invalid or loading, and include a unit test or verification script."

The output this time yielded a much more robust setup consisting of `settings.html`, `settings.js`, and `settings.test.js`.
* **Correctness:** The JavaScript logic actively tests against regex patterns and character length constraints before allowing submission. By separating the logic into `settings.js`, we successfully ran isolated tests via `node settings.test.js`.
* **Accessibility:** Elements properly leverage `aria-required`, `aria-invalid`, `role="alert"`, and explicit `id`/`for` bindings. Screen readers are properly notified when error messages dynamically appear. 
* **Edge Cases:** The submit button dynamically disables itself if fields are invalid or while simulating a network request, successfully preventing double-submissions. 
* **Review Effort:** The review effort was drastically reduced. One AI mistake I caught during this round was that it initially relied solely on the `input` event for validation. This meant a user tabbing through the form without typing wouldn't see error states. I recognized this flaw and ensured `blur` events were also mapped to the `handleValidation` logic. Still, having the unit tests provided immediate confidence in the core logic.

## Conclusion
While the second approach felt slower upfront due to formulating a dense, multi-constraint prompt, it was significantly faster end-to-end. The "vague" round required extensive manual labor to patch architectural gaps, whereas the "precise" round delivered a near-production-ready feature that proved its own correctness. Writing constraints pays dividends in reducing review and refactor time.
