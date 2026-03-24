"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  coverImage?: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

export default function BookCard({
  id,
  title,
  coverImage,
  createdAt,
  onDelete,
}: BookCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy/5 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/preview/${id}`}>
        <div className="aspect-square bg-navy/5 overflow-hidden">
          {coverImage ? (
            <img
              src={`data:image/png;base64,${coverImage}`}
              alt={`${title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/preview/${id}`}>
          <h3 className="font-display font-bold text-navy truncate hover:text-amber transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-navy/40 font-body">
            {new Date(createdAt).toLocaleDateString()}
          </span>
          {showConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(id)}
                className="text-xs text-rose font-semibold min-h-[32px] px-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-navy/40 min-h-[32px] px-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-full hover:bg-rose/10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Delete book"
            >
              <Trash2 className="w-4 h-4 text-navy/30 hover:text-rose" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
