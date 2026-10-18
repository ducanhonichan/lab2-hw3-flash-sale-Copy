
/**
 * HW3 - High-Concurrency Flash-Sale Engine
 * Contract-first TypeScript definitions
 */

export type ReservationStatus =
  | "RESERVED"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED";

export type PurchaseResultStatus =
  | "SUCCESS"
  | "OUT_OF_STOCK"
  | "ALREADY_RESERVED"
  | "SALE_ENDED";

export interface FlashSaleProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  soldStock: number;
}

export interface InventoryReservation {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  status: ReservationStatus;
  createdAt: number;
  expiresAt: number;
}

export interface PurchaseResult {
  status: PurchaseResultStatus;
  reservation?: InventoryReservation;
  message: string;
}

export interface FlashSaleConfig {
  saleStartTime: number;
  saleEndTime: number;
  reservationTimeoutMs: number;
}

export interface CountdownSnapshot {
  remainingMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface InventorySnapshot {
  product: FlashSaleProduct;
  reservations: InventoryReservation[];
}

export type InventoryEvent =
  | { type: "RESERVE"; userId: string; quantity: number }
  | { type: "PAY"; reservationId: string }
  | { type: "CANCEL"; reservationId: string }
  | { type: "EXPIRE"; reservationId: string };
