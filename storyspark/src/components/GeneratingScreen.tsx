"use client";

import { useBookStore } from "@/store/bookStore";

export default function GeneratingScreen() {
  const { generationStatus } = useBookStore();
  const { stage, currentPage, totalPages, message } = generationStatus;

  const getProgress = () => {
    if (stage === "outline") return 10;
    if (stage === "text" && currentPage && totalPages) {
      return 10 + (currentPage / totalPages) * 40;
    }
    if (stage === "images" && currentPage && totalPages) {
      return 50 + (currentPage / totalPages) * 45;
    }
    if (stage === "saving") return 95;
    if (stage === "complete") return 100;
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream">
      <div className="w-full max-w-md text-center">
        {/* Animated pencil icon */}
        <div className="mb-8">
          <svg
            className="w-20 h-20 mx-auto text-amber"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 56L12 40L44 8L56 20L24 52L8 56Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw"
            />
            <path
              d="M36 16L48 28"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-draw"
              style={{ animationDelay: "0.5s" }}
            />
          </svg>
        </div>

        <h2 className="text-2xl font-display font-bold text-navy mb-2">
          Creating Your Book
        </h2>

        <p className="text-navy/60 font-body mb-8">
          {message || "Getting ready..."}
        </p>

        {/* Progress bar */}
        <div className="w-full h-3 bg-navy/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-amber rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        <p className="text-sm text-navy/40 font-body">
          This takes about 1–2 minutes. Your book is being written and
          illustrated just for you.
        </p>

        <p className="text-xs text-navy/30 font-body mt-4">
          AI illustrations may vary slightly in style between pages.
        </p>
      </div>
    </div>
  );
}
