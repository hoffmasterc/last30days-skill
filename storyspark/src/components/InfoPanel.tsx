"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

interface InfoPanelProps {
  hint: string;
}

export default function InfoPanel({ hint }: InfoPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-navy/5 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="More info"
      >
        <Info className="w-5 h-5 text-navy/40" />
      </button>
      {open && (
        <div className="absolute top-12 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-white rounded-xl shadow-lg border border-navy/10 p-4 z-10">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm text-navy/70 font-body leading-relaxed">{hint}</p>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-navy/5 flex-shrink-0"
            >
              <X className="w-4 h-4 text-navy/40" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
