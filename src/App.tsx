
import { useState } from "react";
import { useCountdown } from "./hooks/useCountdown";

function App() {
  const [endTime, setEndTime] = useState(
    () => Date.now() + 5 * 60 * 1000
  );

  const { hours, minutes, seconds, isExpired } =
    useCountdown(endTime);

  const formatTime = (value: number) =>
    String(value).padStart(2, "0");

  const resetCountdown = () => {
    setEndTime(Date.now() + 5 * 60 * 1000);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>⚡ FLASH SALE 11.11 ⚡</h1>

      <p>High-Concurrency Flash-Sale Engine</p>

      <h2>Sale Ends In</h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          fontSize: "48px",
          fontWeight: "bold",
          color: isExpired ? "#f87171" : "#facc15",
        }}
      >
        <span>{formatTime(hours)}</span>
        <span>:</span>
        <span>{formatTime(minutes)}</span>
        <span>:</span>
        <span>{formatTime(seconds)}</span>
      </div>

      <p>
        {isExpired
          ? "FLASH SALE ENDED"
          : "Flash Sale is LIVE!"}
      </p>

      <button
        onClick={resetCountdown}
        style={{
          padding: "12px 24px",
          background: "#facc15",
          color: "#0f172a",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Restart 5-Minute Countdown
      </button>
    </main>
  );
}

export default App;
