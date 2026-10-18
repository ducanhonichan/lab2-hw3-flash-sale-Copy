
import { useEffect, useState } from "react";
import { InventoryMachine } from "../engine/inventory-machine";
import type {
  FlashSaleProduct as ProductType,
  InventorySnapshot,
} from "../types/flash-sale-contract";

const initialProduct: ProductType = {
  id: "FLASH-001",
  name: "Tai nghe Bluetooth Flash Sale",
  originalPrice: 1290000,
  salePrice: 499000,
  totalStock: 10,
  availableStock: 10,
  reservedStock: 0,
  soldStock: 0,
};

const machine = new InventoryMachine(initialProduct);

interface FlashSaleProductProps {
  isSaleEnded: boolean;
  saleEndTime: number;
}

export default function FlashSaleProduct({
  isSaleEnded,
  saleEndTime,
}: FlashSaleProductProps) {
  machine.setSaleEndTime(saleEndTime);
  const [snapshot, setSnapshot] = useState<InventorySnapshot>(
    () => machine.getSnapshot()
  );
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("USER-001");
  const [reservationId, setReservationId] = useState("");

  const refresh = () => {
    setSnapshot(machine.getSnapshot());
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      machine.expireReservations(Date.now());
      refresh();
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleReserve = () => {
    if (Date.now() >= saleEndTime || isSaleEnded) {
      setMessage("Flash Sale has ended. Reservations are closed.");
      return;
    }
    const result = machine.reserve(
      userId,
      1,
      Date.now(),
      30_000
    );

    setMessage(result.message);

    if (result.reservation) {
      setReservationId(result.reservation.id);
    }

    refresh();
  };

  const handlePay = () => {
    const success = machine.pay(
      reservationId,
      Date.now()
    );

    setMessage(
      success
        ? "Payment successful!"
        : "Payment failed or reservation expired."
    );

    refresh();
  };

  const handleCancel = () => {
    const success = machine.cancel(
      reservationId,
      Date.now()
    );

    setMessage(
      success
        ? "Reservation cancelled."
        : "Cannot cancel this reservation."
    );

    refresh();
  };

  const product = snapshot.product;

  return (
    <section
      style={{
        background: "#1e293b",
        color: "#fff",
        padding: "24px",
        borderRadius: "16px",
        width: "min(420px, 90vw)",
        textAlign: "left",
      }}
    >
      <h2>{product.name}</h2>

      <p>
        <del>
          {product.originalPrice.toLocaleString("vi-VN")}Ä‘
        </del>
      </p>

      <h2 style={{ color: "#facc15" }}>
        {product.salePrice.toLocaleString("vi-VN")}Ä‘
      </h2>

      <p>Available: {product.availableStock}</p>
      <p>Reserved: {product.reservedStock}</p>
      <p>Sold: {product.soldStock}</p>

      <input
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        placeholder="Customer ID"
        style={{
          padding: "10px",
          width: "100%",
          boxSizing: "border-box",
          marginBottom: "12px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleReserve} disabled={isSaleEnded || snapshot.product.availableStock === 0}>
          Reserve
        </button>

        <button
          onClick={handlePay}
          disabled={!reservationId}
        >
          Pay
        </button>

        <button
          onClick={handleCancel}
          disabled={!reservationId}
        >
          Cancel
        </button>
      </div>

      <p style={{ marginTop: "16px" }}>
        {message}
      </p>
    </section>
  );
}

