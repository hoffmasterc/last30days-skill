"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { PageData } from "@/store/bookStore";

interface BookPreviewProps {
  title: string;
  pages: PageData[];
  onSave?: () => void;
  onNewBook?: () => void;
  showSave?: boolean;
}

export default function BookPreview({
  title,
  pages,
  onSave,
  onNewBook,
  showSave = true,
}: BookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goToPage = (index: number) => {
    if (animating || index < 0 || index >= pages.length) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    setCurrentPage(index);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `StorySpark: ${title}`,
          text: `Check out this picture book I made: "${title}"`,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const page = pages[currentPage];
  if (!page) return null;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-navy truncate">
          {title}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="p-3 rounded-full hover:bg-navy/5 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-navy/60" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          className={`w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-lg bg-white ${
            animating ? "animate-page-turn" : ""
          }`}
        >
          {page.image_base64 ? (
            <img
              src={`data:image/png;base64,${page.image_base64}`}
              alt={`Page ${page.page_number} illustration`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy/5">
              <span className="text-navy/30 font-body">Illustration</span>
            </div>
          )}
        </div>

        {/* Page text */}
        <div className="w-full max-w-lg mt-6 px-2">
          <p className="text-xl sm:text-2xl font-story text-navy text-center leading-relaxed">
            {page.text}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-3 rounded-full hover:bg-navy/5 transition-colors disabled:opacity-20 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6 text-navy" />
          </button>
          <span className="text-sm font-body text-navy/60">
            Page {currentPage + 1} of {pages.length}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pages.length - 1}
            className="p-3 rounded-full hover:bg-navy/5 transition-colors disabled:opacity-20 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6 text-navy" />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 flex gap-3 max-w-lg mx-auto w-full">
        {showSave && onSave && (
          <button
            onClick={onSave}
            className="flex-1 py-4 bg-amber text-white font-display font-bold rounded-2xl text-lg hover:bg-amber/90 transition-colors min-h-[56px]"
          >
            Save to My Library
          </button>
        )}
        {onNewBook && (
          <button
            onClick={onNewBook}
            className="flex-1 py-4 border-2 border-navy/10 text-navy font-display font-semibold rounded-2xl text-lg hover:border-navy/20 transition-colors min-h-[56px]"
          >
            Start a New Book
          </button>
        )}
      </div>
    </div>
  );
}
