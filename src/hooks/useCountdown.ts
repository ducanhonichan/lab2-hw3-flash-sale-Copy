
import { useEffect, useState } from "react";
import type { CountdownSnapshot } from "../types/flash-sale-contract";

function calculateCountdown(endTime: number): CountdownSnapshot {
  // Always calculate from real time to prevent timer drift.
  const remainingMs = Math.max(0, endTime - Date.now());

  const totalSeconds = Math.ceil(remainingMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    remainingMs,
    hours,
    minutes,
    seconds,
    isExpired: remainingMs === 0,
  };
}

export function useCountdown(endTime: number): CountdownSnapshot {
  const [countdown, setCountdown] = useState<CountdownSnapshot>(
    () => calculateCountdown(endTime)
  );

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(calculateCountdown(endTime));
    };

    // Immediately synchronize when endTime changes.
    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [endTime]);

  return countdown;
}
