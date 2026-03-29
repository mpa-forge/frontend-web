## 1. Define the new stack contract

- [x] 1.1 Add delta specs for the Bun toolchain baseline, testing baseline, and
      Zustand state baseline
- [x] 1.2 Update the existing runtime and container delta specs for the Bun
      migration

## 2. Implement the repo-local stack expansion

- [x] 2.1 Switch package-management and repo scripts from npm to Bun and update
      the tool pins, lockfile, and Make targets
- [x] 2.2 Update the container build and repo docs to match the Bun baseline
- [x] 2.3 Add Vitest and Playwright configuration with lightweight initial tests
- [x] 2.4 Add a small Zustand store and route the current runtime shell through
      it

## 3. Realign shared documentation

- [x] 3.1 Update shared planning docs that still lock npm as the frontend
      package-manager baseline

## 4. Validate and finalize

- [x] 4.1 Run the strongest repo-local validation available for the changed
      stack and fix issues
- [x] 4.2 Update the OpenSpec task checklist to reflect the completed work
