
import { InventoryMachine } from "./inventory-machine";
import type { FlashSaleProduct } from "../types/flash-sale-contract";

export function runInventoryTest(): void {
  const product: FlashSaleProduct = {
    id: "FLASH-001",
    name: "Flash Sale Test Product",
    originalPrice: 1000000,
    salePrice: 499000,
    totalStock: 10,
    availableStock: 10,
    reservedStock: 0,
    soldStock: 0,
  };

  const machine = new InventoryMachine(product);

  const now = Date.now();
  const results = [];

  // Simulate 100 customers competing for 10 items.
  for (let i = 1; i <= 100; i++) {
    results.push(
      machine.reserve(
        `USER-${i}`,
        1,
        now,
        60_000
      )
    );
  }

  const successful = results.filter(
    (result) => result.status === "SUCCESS"
  ).length;

  const rejected = results.filter(
    (result) => result.status === "OUT_OF_STOCK"
  ).length;

  const snapshot = machine.getSnapshot();
  const inventory = snapshot.product;

  const total =
    inventory.availableStock +
    inventory.reservedStock +
    inventory.soldStock;

  console.log("=== INVENTORY CONCURRENCY TEST ===");
  console.log("Total purchase attempts:", results.length);
  console.log("Successful reservations:", successful);
  console.log("Rejected reservations:", rejected);
  console.log("Available stock:", inventory.availableStock);
  console.log("Reserved stock:", inventory.reservedStock);
  console.log("Sold stock:", inventory.soldStock);
  console.log("Total stock invariant:", total);

  const passed =
    successful === 10 &&
    rejected === 90 &&
    inventory.availableStock === 0 &&
    inventory.reservedStock === 10 &&
    inventory.soldStock === 0 &&
    total === inventory.totalStock;

  console.log(
    passed
      ? "PASS: No overselling detected."
      : "FAIL: Inventory inconsistency detected."
  );

  if (!passed) {
    throw new Error("Inventory concurrency test failed");
  }
}






export function runReservationLifecycleTest(): void {
  const product: FlashSaleProduct = {
    id: "FLASH-LIFECYCLE",
    name: "Lifecycle Test Product",
    originalPrice: 1000000,
    salePrice: 499000,
    totalStock: 3,
    availableStock: 3,
    reservedStock: 0,
    soldStock: 0,
  };

  const machine = new InventoryMachine(product);
  const now = Date.now();

  // Test 1: Successful payment
  const first = machine.reserve("USER-A", 1, now, 60_000);
  const paid = first.reservation
    ? machine.pay(first.reservation.id, now + 1_000)
    : false;

  // Test 2: Cancellation releases inventory
  const second = machine.reserve("USER-B", 1, now, 60_000);
  const cancelled = second.reservation
    ? machine.cancel(second.reservation.id, now + 2_000)
    : false;

  // Test 3: Expired reservation releases inventory
  const third = machine.reserve("USER-C", 1, now, 5_000);
  const expiredCount = machine.expireReservations(now + 6_000);

  const snapshot = machine.getSnapshot();
  const stock = snapshot.product;

  const passed =
    paid &&
    cancelled &&
    third.status === "SUCCESS" &&
    expiredCount === 1 &&
    stock.availableStock === 2 &&
    stock.reservedStock === 0 &&
    stock.soldStock === 1 &&
    stock.availableStock +
      stock.reservedStock +
      stock.soldStock === stock.totalStock;

  console.log("=== RESERVATION LIFECYCLE TEST ===");
  console.log("Payment successful:", paid);
  console.log("Cancellation successful:", cancelled);
  console.log("Expired reservations:", expiredCount);
  console.log("Available stock:", stock.availableStock);
  console.log("Reserved stock:", stock.reservedStock);
  console.log("Sold stock:", stock.soldStock);
  console.log(
    passed
      ? "PASS: Reservation lifecycle is consistent."
      : "FAIL: Reservation lifecycle is inconsistent."
  );

  if (!passed) {
    throw new Error("Reservation lifecycle test failed");
  }
}
