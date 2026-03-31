"use client";

import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import BookCard from "@/components/BookCard";
import WaitlistModal from "@/components/WaitlistModal";

interface Book {
  id: string;
  title: string;
  pages: { page_number: number; text: string; image_base64: string }[];
  created_at: string;
}

export default function LibraryPage() {
  const { userId } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books/list");
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBooks();
  }, [userId]);

  const handleDelete = async (bookId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== bookId));
      }
    } catch {
      // silently fail
    }
  };

  const atLimit = books.length >= 5;

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <Link href="/" className="text-2xl font-display font-extrabold text-navy">
          StorySpark
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/create" className="text-navy/60 hover:text-navy font-body text-sm transition-colors">
            Create
          </Link>
          <UserButton />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-navy mb-8">
          My Library
        </h1>

        {atLimit && (
          <div className="bg-amber/10 border border-amber/20 rounded-2xl p-4 mb-6">
            <p className="text-navy font-body">
              You&apos;ve reached your 5-book limit. Delete a book to create a new one.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-amber border-t-transparent rounded-full" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">📖</span>
            <h2 className="text-2xl font-display font-bold text-navy mb-2">
              You haven&apos;t made any books yet
            </h2>
            <p className="text-navy/60 font-body mb-6">
              Let&apos;s make your first one!
            </p>
            <Link
              href="/create"
              className="inline-block py-4 px-8 bg-amber text-white font-display font-bold rounded-2xl text-lg hover:bg-amber/90 transition-colors"
            >
              Create Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title || "Untitled"}
                coverImage={book.pages?.[0]?.image_base64}
                createdAt={book.created_at}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  );
}
