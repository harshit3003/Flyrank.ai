# Round 2 (Precise Prompt) - Audit Record

**Implementation Time:**
~2 minutes (Formulating the prompt, generating, and placing in separate files).

**Bugs/Fixes:**
- No significant structural bugs initially, but caught that validation was originally only tied to the `input` event, which missed keyboard users navigating via `Tab`. 
- Fix applied: Explicitly bound `blur` events to the same validation logic in `settings.js`.

**Review Time:**
~2 minutes. Having the `settings.test.js` file meant I could independently verify the validation logic (`node settings.test.js`) without needing to click around the DOM. 

**Accessibility Issues:**
- **Resolved:** ARIA roles (`aria-invalid`, `aria-describedby`, `aria-required`) are now properly wired up.
- **Resolved:** Labels have explicit `for` attributes connecting to `id`s.
- **Resolved:** Errors use `role="alert"` so assistive tech reads them aloud dynamically.

**Missing Edge Cases:**
- **Resolved:** The submit button dynamically disables if any input is invalid or while simulating network load.
- **Resolved:** The JavaScript validations correctly trim whitespace using `.trim()`, preventing users from submitting blank spaces.
- **Resolved:** Successful form submission provides a non-intrusive banner (`div.success-message`) rather than blocking the main thread with a popup alert.
