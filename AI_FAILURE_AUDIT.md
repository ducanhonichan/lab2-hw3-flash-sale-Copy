# AI Failure Audit – High-Concurrency Flash-Sale Engine

## 1. Purpose

This document records real problems encountered while integrating AI-assisted code into the Flash-Sale application.

The objective is to demonstrate that AI-generated solutions require human review, testing, and verification before they can be considered reliable.

## 2. Failure 1 – Missing React Component Props

**Problem:** The application failed to compile after the parent component started passing `isSaleEnded` and `saleEndTime` to `FlashSaleProduct`.

**Evidence:**

```text
error TS2322:
Type '{ isSaleEnded: boolean; saleEndTime: number; }'
is not assignable to type 'IntrinsicAttributes'.

Property 'isSaleEnded' does not exist on type 'IntrinsicAttributes'.
```

**Root cause:** The actual `FlashSaleProduct.tsx` file still declared the component without props:

```tsx
export default function FlashSaleProduct() {
```

The component interface was inconsistent with the updated parent component.

**Correction:** Added a `FlashSaleProductProps` interface and updated the component to accept both properties.

**Verification:** `npm run build` completed successfully.

**Lesson learned:** AI-assisted changes across multiple files must be verified against the actual saved files, not just code shown in the editor or conversation.

## 3. Failure 2 – Sale Deadline Not Fully Integrated

**Problem:** The countdown and inventory reservation logic were initially developed separately. A countdown reaching zero did not, by itself, establish that the inventory engine would reject new reservations.

**Root cause:** UI countdown state and the inventory engine's deadline validation were not yet connected.

**Correction:**

- Passed `saleEndTime` from `App.tsx` into `FlashSaleProduct.tsx`.
- Configured the inventory machine with the sale deadline.
- Added a deadline guard to the reservation handler.
- Disabled the Reserve button when the sale ends.

**Verification:** The `runSaleDeadlineTest()` test passed, validating reservation behavior before, at, and after the deadline.

**Lesson learned:** Business rules must be enforced by the underlying engine rather than relying exclusively on UI controls.

## 4. Failure 3 – Inconsistent Saved Source Files

**Problem:** Updating the displayed code did not initially resolve the TypeScript error. Repeated builds continued to compile older component definitions.

**Evidence:** Reading the source files directly through PowerShell revealed that `App.tsx` and `FlashSaleProduct.tsx` still contained outdated code.

**Root cause:** The saved source files did not match the intended integrated implementation. The precise reason for this mismatch was not established.

**Correction:** Inspected the files with PowerShell, applied targeted replacements to the actual files, and verified the updated content.

**Verification:**

```text
vite v8.3.4 building client environment for production...
✓ 20 modules transformed.
✓ built in 425ms
```

**Lesson learned:** When AI-assisted debugging repeatedly fails, verify the exact source files consumed by the compiler before making additional speculative changes.

## 5. Final Validation

The following checks were completed:

| Validation | Result |
|---|---|
| Inventory consistency test | PASS |
| Reservation lifecycle test | PASS |
| Sale deadline test | PASS |
| TypeScript production build | PASS |
| Vite production build | PASS |

The inventory test simulates multiple reservation requests within a single JavaScript application. It demonstrates local inventory consistency but does not establish distributed concurrency safety across multiple servers.

## 6. Conclusion

This project demonstrates three important limitations of AI-assisted software development:

1. Generated components may not match their integration contracts.
2. Independently implemented features may fail to enforce shared business rules.
3. Suggested fixes must be checked against the actual saved source code.

Human validation, reproducible tests, and successful production builds were necessary to resolve these issues.

AI was used as a development assistant, while the developer remained responsible for verification and correctness.
