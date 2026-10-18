# High-Concurrency Flash-Sale E-Commerce Engine

Lab 02 - Web Application Development | Homework 3

A React and TypeScript educational flash-sale application demonstrating countdown timing, inventory reservation, and stock consistency.

## 1. Objectives

- Implement a drift-resistant countdown using Date.now().
- Prevent inventory overselling in a single JavaScript simulation.
- Reserve stock temporarily before payment.
- Release stock after cancellation or reservation expiry.
- Reject new reservations after the sale deadline.
- Verify inventory consistency with reproducible tests.

## 2. Technology Stack

- React
- TypeScript
- Vite
- CSS
- Git and GitHub

## 3. Core Features

### Countdown

The useCountdown hook calculates remaining time from the current timestamp instead of decrementing a counter. This reduces accumulated timer drift.

### Inventory State Machine

The InventoryMachine supports:

- reserve(): Reserve available inventory.
- pay(): Complete a valid reservation.
- cancel(): Cancel a reservation and release stock.
- expireReservations(): Release expired reservations.
- setSaleEndTime(): Configure the sale deadline.

### User Interface

The application displays available, reserved, and sold stock. Users can reserve, pay for, or cancel a reservation.

New reservations are blocked after the sale deadline.

## 4. Project Structure

```text
src/
  components/FlashSaleProduct.tsx
  engine/inventory-machine.ts
  engine/inventory-test.ts
  hooks/useCountdown.ts
  types/flash-sale-contract.ts
  App.tsx
  main.tsx

AI_FAILURE_AUDIT.md
TASK_DECOMPOSITION.md
project-rules.md
README.md
```

## 5. Installation

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local address displayed by Vite.

## 6. Testing

Production build:

```bash
npm run build
```

ESLint:

```bash
npm run lint
```

The development application executes three checks and reports their results in the browser console:

1. Inventory consistency: 100 reservation attempts against limited stock.
2. Reservation lifecycle: payment, cancellation, and expiration.
3. Sale deadline: requests before, at, and after the deadline.

All three tests passed during development.

The production build also completed successfully.

## 7. AI Failure Audit

See AI_FAILURE_AUDIT.md for three documented development problems:

1. Missing React component props caused TypeScript error TS2322.
2. Countdown and inventory deadline validation required integration.
3. Saved source files did not match the intended updated implementation.

The audit explains the observed issues, corrections, and verification steps.

## 8. Limitations

This project is a single-browser educational simulation.

Inventory is stored in application memory. The project does not implement database transactions, persistent stock, distributed locks, or concurrency protection across multiple servers and browsers.

Production flash-sale systems require server-side inventory enforcement, transactional storage, and additional load testing.

## 9. Documentation

- project-rules.md: Development rules.
- TASK_DECOMPOSITION.md: Implementation plan.
- AI_FAILURE_AUDIT.md: AI-assisted development audit.

## 10. Conclusion

The project demonstrates flash-sale countdown logic, inventory state transitions, deadline enforcement, and automated consistency checks.

AI-assisted code was reviewed and validated through testing and production builds.
