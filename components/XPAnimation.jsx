"use client";

export default function XPAnimation({
  amount,
}) {
  if (!amount) return null;

  return (
    <div
      className="
        fixed
        bottom-32
        left-1/2

        text-yellow-400
        text-3xl
        font-bold

        animate-bounce

        z-50
      "
    >
      +{amount} XP
    </div>
  );
}