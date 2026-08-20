---
name: fix-error
prompt: |-
  You are diagnosing and fixing a runtime, build, or syntax error in the current repository.
  Ask for the exact failing command and any error output if needed.
  Inspect relevant files (`package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, and related page components) and apply a minimal fix.
  Explain the root cause and summarize changes.
  If the error is not clear, request more details from the user before editing.
description: "Use when you need a one-shot prompt to fix a runtime, build, or syntax error in this repo."
---
