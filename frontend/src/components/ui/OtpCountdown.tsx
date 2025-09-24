import React, { useEffect, useState } from "react";

type OtpCountdownProps = {
  initialSeconds?: number; // default 240 (4 menit)
  onExpire?: () => void; // callback saat habis
};

export default function OtpCountdown({
  initialSeconds = 240,
  onExpire,
}: OtpCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <p className="text-default-600 font-mono text-sm">
      {minutes}:{seconds}
    </p>
  );
}
