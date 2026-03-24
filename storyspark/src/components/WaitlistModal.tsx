"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-navy/5 min-w-[40px] min-h-[40px] flex items-center justify-center"
        >
          <X className="w-5 h-5 text-navy/40" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <span className="text-4xl block mb-4">🎉</span>
            <h3 className="text-xl font-display font-bold text-navy mb-2">
              You&apos;re on the list!
            </h3>
            <p className="text-navy/60 font-body">
              We&apos;ll let you know when StorySpark Pro launches.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-display font-bold text-navy mb-2">
              StorySpark Pro is coming soon
            </h3>
            <p className="text-navy/60 font-body mb-6">
              Unlimited books, PDF downloads, and print ordering. Join the
              waitlist to get early access and a launch discount.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full p-4 rounded-2xl border-2 border-navy/10 focus:border-amber focus:outline-none bg-white text-navy font-body text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber text-white font-display font-bold rounded-2xl text-lg hover:bg-amber/90 transition-colors disabled:opacity-50 min-h-[56px]"
              >
                {loading ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
