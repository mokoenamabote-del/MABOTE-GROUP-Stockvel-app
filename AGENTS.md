# AI Agent Instructions for MABOTE GROUP HOLDINGS Stockvel App

## Purpose
This repository contains the skeleton of a frontend stockvel app for MABOTE GROUP HOLDINGS. The app currently includes a README and placeholder `src` files, but source content and package metadata are not present.

## Key project areas
- `README.md` — high-level app purpose and feature list.
- `src/App.js` — main application entry point.
- `src/App.css` — app styling.
- `src/pages/` — page-level modules for login, admin dashboard, member dashboard, registration, and plans.
- `src/components/` — shared UI component folder (currently empty).
- `srs/` — system requirements or documentation artifacts.

## Agent guidance
- Treat this repo as a frontend app scaffold. The file names strongly imply React-style page components, but the source files are currently empty.
- Do not make assumptions about package tooling, build commands, or runtime environment until `package.json`, `package-lock.json`, `yarn.lock`, or other config files are available.
- Ask the user for missing repository setup details before adding or modifying features.
- Preserve existing structure and keep changes aligned with the app's stated goals: member registration, group management, monthly contributions, funeral grocery plans, payments, and notifications.
- If you add new files, keep them organized under `src/`, with pages in `src/pages/` and reusable UI pieces in `src/components/`.

## Development notes
- There is no detected `package.json`, so do not run `npm install`, `npm test`, or similar commands without confirmation.
- If asked to implement features, first request the frontend framework and package config.

## Skills
- `fix-error` — use when diagnosing and repairing runtime, build, or syntax errors in this repo. It follows a structured workflow of reproducing the issue, inspecting relevant files, applying a minimal fix, and verifying the result.

## When to create additional customization
- If the repo gains real source code and build scripts, add `.github/copilot-instructions.md` or expand `AGENTS.md` with build/test commands and project conventions.
- If a backend or API layer is added, create separate instructions for API usage and data models.
