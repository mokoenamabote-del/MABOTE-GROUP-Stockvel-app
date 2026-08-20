---
name: fix-error
description: "Use when you need to diagnose and fix a runtime, build, or syntax error in this repo by reproducing the failure, isolating the cause, and applying a minimal fix."
---

# Fix Error Skill

This skill guides the agent through a structured workflow for resolving errors in the current project.

## Workflow

1. Reproduce the error
   - Ask for the exact command or action that failed.
   - Request the full error message, stack trace, or browser console output if available.
   - If no error output is provided, inspect `package.json`, `vite.config.js`, and the entry files in `src/`.

2. Inspect relevant files
   - Focus on files named in the error and the app entry points: `src/main.jsx`, `src/App.jsx`, and page components in `src/pages/`.
   - Check imports, file extensions, component names, syntax, hooks, and Vite configuration.

3. Identify the root cause
   - Differentiate between syntax problems, missing exports/imports, dependency mismatches, and runtime logic errors.
   - Validate whether the file path, case, or component signature is incorrect.

4. Apply a minimal fix
   - Make the smallest change needed to resolve the failure.
   - Preserve the repo structure and existing design intent.
   - Use consistent React/Vite conventions and avoid broad refactors.

5. Verify the solution
   - Confirm the fix by running the relevant command or re-checking the reported error path.
   - Summarize the cause and the changed files.

## Guidance

- If the error is unclear, ask the user for the exact output before editing.
- Prefer fixes in `src/` files and only change `package.json` or config files when dependencies or build settings are clearly involved.
- If a build error is due to missing packages or invalid import paths, explain the root issue clearly.
