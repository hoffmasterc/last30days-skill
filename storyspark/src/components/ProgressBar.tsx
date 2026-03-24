"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-body text-navy/60">
          Step {current + 1} of {total}
        </span>
      </div>
      <div className="w-full h-2 bg-navy/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
