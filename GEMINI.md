# Antigravity AI Rules

## Stack
- Node.js LTS
- Git for version control
- Vanilla HTML/CSS/JS or modern framework (React/Next.js)

## Conventions
- Use Conventional Commits for all commit messages.
- Maintain a clean and visually appealing aesthetic for user interfaces.
- Write clear and concise code with appropriate documentation.

## Project Rules
1. **Forms require validation scripts**: All form inputs must have associated real-time validation logic tested in isolation (e.g., in a separate `*.test.js` file).
2. **Accessibility attributes are mandatory**: All interactive elements and forms must include proper ARIA roles (`aria-invalid`, `aria-describedby`) and explicit `for`/`id` bindings.
3. **Prevent double-submission states**: All form submit buttons must dynamically disable during network requests and invalid states to prevent erroneous submissions.
