"use client";
import { useState } from "react";
import { quotes } from "@/components/data/quotes";

export default function QuoteCard() {

  const [index, setIndex] = useState(0);

  return (
    <div className="glass p-5 rounded-3xl">

      <h3 className="text-xl font-bold">
        ✨ Quote
      </h3>

      <p className="my-6">
        {quotes[index]}
      </p>

      <button
        onClick={() =>
          setIndex(
            Math.floor(
              Math.random() *
              quotes.length
            )
          )
        }
        className="bg-violet-500 px-4 py-2 rounded-xl"
      >
        Quote mới
      </button>

    </div>
  );
}