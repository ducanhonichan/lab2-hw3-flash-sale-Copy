
# Project Rules – HW3

## Project Overview

High-Concurrency Flash-Sale E-Commerce Engine

## 1. Technology Stack
- React
- TypeScript
- Vite
- Browser APIs

## 2. Contract-First Development
- Define TypeScript interfaces and types before implementation.
- Separate business logic from React UI components.
- Avoid using `any`.
- Validate code using TypeScript and ESLint.

## 3. Countdown Timer
- Calculate remaining time using Date.now().
- Avoid relying on interval tick counts for elapsed time.
- Prevent negative countdown values.
- Clean up timers when components unmount.

## 4. Inventory Lock State Machine
- Define explicit inventory reservation states.
- Validate state transitions.
- Prevent stock from becoming negative.
- Support reservation expiration.
- Handle successful and failed payments.
- Release reserved stock when appropriate.

## 5. Concurrency and Data Consistency
- Prevent duplicate reservations.
- Handle competing purchase requests consistently.
- Avoid overselling available inventory.
- Use deterministic tests for concurrent operations.

## 6. React Architecture
- Separate UI, state machine, and inventory logic.
- Use React state only for information required by the UI.
- Clean up subscriptions and timers.
- Keep business logic testable independently.

## 7. Testing
- Test countdown expiration.
- Test successful inventory reservation.
- Test out-of-stock behavior.
- Test reservation timeout.
- Test payment success and failure.
- Test concurrent purchase requests.
- Run ESLint and production build.

## 8. AI-Assisted Development
- Review AI-generated code critically.
- Document at least three genuine AI implementation issues.
- Explain each issue, correction, and verification.
- Maintain at least eight meaningful Conventional Commits.
- Capture screenshots of implementation and test results.
