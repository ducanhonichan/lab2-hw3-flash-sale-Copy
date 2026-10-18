
import type {
  FlashSaleProduct,
  InventoryReservation,
  InventorySnapshot,
  PurchaseResult,
} from "../types/flash-sale-contract";

export class InventoryMachine {
  private product: FlashSaleProduct;
  private reservations = new Map<string, InventoryReservation>();
  private nextReservationId = 1;

  // Sale deadline is optional to preserve existing tests.
  private saleEndTime: number | null = null;

  constructor(product: FlashSaleProduct) {
    if (
      !Number.isSafeInteger(product.totalStock) ||
      product.totalStock < 0 ||
      product.availableStock !== product.totalStock ||
      product.reservedStock !== 0 ||
      product.soldStock !== 0
    ) {
      throw new Error("Invalid initial inventory");
    }

    this.product = { ...product };
  }

  // Set the deadline used by the inventory engine.
  setSaleEndTime(endTime: number): void {
    if (!Number.isFinite(endTime)) {
      throw new Error("Invalid sale end time");
    }

    this.saleEndTime = endTime;
  }

  getSnapshot(): InventorySnapshot {
    return {
      product: { ...this.product },
      reservations: Array.from(
        this.reservations.values(),
        (reservation) => ({ ...reservation })
      ),
    };
  }

  reserve(
    userId: string,
    quantity: number,
    now: number,
    expiresInMs: number
  ): PurchaseResult {
    if (
      !userId.trim() ||
      !Number.isSafeInteger(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(now) ||
      !Number.isFinite(expiresInMs) ||
      expiresInMs <= 0
    ) {
      throw new Error("Invalid reservation request");
    }

    // Release reservations that have already expired.
    this.expireReservations(now);

    // Reject new reservations after the sale deadline.
    if (
      this.saleEndTime !== null &&
      now >= this.saleEndTime
    ) {
      return {
        status: "SALE_ENDED",
        message:
          "Flash Sale has ended. New reservations are closed.",
      };
    }

    const existing = Array.from(
      this.reservations.values()
    ).find(
      (reservation) =>
        reservation.userId === userId &&
        reservation.status === "RESERVED"
    );

    if (existing) {
      return {
        status: "ALREADY_RESERVED",
        message: "User already has an active reservation",
      };
    }

    if (this.product.availableStock < quantity) {
      return {
        status: "OUT_OF_STOCK",
        message: "Not enough inventory available",
      };
    }

    const reservation: InventoryReservation = {
      id: `RES-${this.nextReservationId++}`,
      productId: this.product.id,
      userId,
      quantity,
      status: "RESERVED",
      createdAt: now,
      expiresAt: now + expiresInMs,
    };

    this.product.availableStock -= quantity;
    this.product.reservedStock += quantity;

    this.reservations.set(
      reservation.id,
      reservation
    );

    return {
      status: "SUCCESS",
      reservation: { ...reservation },
      message: "Inventory reserved successfully",
    };
  }

  pay(reservationId: string, now: number): boolean {
    this.expireReservations(now);

    const reservation =
      this.reservations.get(reservationId);

    if (
      !reservation ||
      reservation.status !== "RESERVED"
    ) {
      return false;
    }

    // Existing valid reservations can still be paid
    // after the sale closes, before their own expiry.
    reservation.status = "PAID";

    this.product.reservedStock -=
      reservation.quantity;

    this.product.soldStock +=
      reservation.quantity;

    return true;
  }

  cancel(
    reservationId: string,
    now: number
  ): boolean {
    this.expireReservations(now);

    const reservation =
      this.reservations.get(reservationId);

    if (
      !reservation ||
      reservation.status !== "RESERVED"
    ) {
      return false;
    }

    reservation.status = "CANCELLED";

    this.product.reservedStock -=
      reservation.quantity;

    this.product.availableStock +=
      reservation.quantity;

    return true;
  }

  expireReservations(now: number): number {
    let expiredCount = 0;

    for (const reservation of
      this.reservations.values()) {
      if (
        reservation.status === "RESERVED" &&
        now >= reservation.expiresAt
      ) {
        reservation.status = "EXPIRED";

        this.product.reservedStock -=
          reservation.quantity;

        this.product.availableStock +=
          reservation.quantity;

        expiredCount++;
      }
    }

    return expiredCount;
  }
}
    