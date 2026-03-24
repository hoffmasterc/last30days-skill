"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookPreview from "@/components/BookPreview";

interface Book {
  id: string;
  title: string;
  pages: { page_number: number; text: string; image_base64: string }[];
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${params.bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data.book);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    if (params.bookId) fetchBook();
  }, [params.bookId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="animate-spin w-8 h-8 border-2 border-amber border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
        <h2 className="text-2xl font-display font-bold text-navy mb-2">
          Book not found
        </h2>
        <button
          onClick={() => router.push("/library")}
          className="mt-4 py-3 px-6 bg-amber text-white font-display font-bold rounded-2xl hover:bg-amber/90 transition-colors"
        >
          Go to Library
        </button>
      </div>
    );
  }

  return (
    <BookPreview
      title={book.title}
      pages={book.pages}
      showSave={false}
      onNewBook={() => router.push("/create")}
    />
  );
}
