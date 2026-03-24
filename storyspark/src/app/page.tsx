"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <span className="text-2xl font-display font-extrabold text-navy">
          StorySpark
        </span>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/library"
                className="text-navy/60 hover:text-navy font-body text-sm transition-colors"
              >
                My Library
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-navy/60 hover:text-navy font-body text-sm transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-3xl mx-auto px-4 pt-16 pb-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-navy leading-tight mb-6">
          Create magical picture books with AI
        </h1>
        <p className="text-xl text-navy/60 font-body mb-10 max-w-xl mx-auto leading-relaxed">
          Answer a few fun questions and watch as your story comes to life with
          custom illustrations — in about 2 minutes.
        </p>
        <Link
          href="/create"
          className="inline-block py-4 px-10 bg-amber text-white font-display font-bold rounded-2xl text-xl hover:bg-amber/90 transition-colors shadow-lg hover:shadow-xl min-h-[56px]"
        >
          Make a Book
        </Link>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5">
            <span className="text-3xl block mb-3">✏️</span>
            <h3 className="font-display font-bold text-navy mb-1">
              Answer Questions
            </h3>
            <p className="text-sm text-navy/50 font-body">
              Tell us about your characters, setting, and story idea.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5">
            <span className="text-3xl block mb-3">🎨</span>
            <h3 className="font-display font-bold text-navy mb-1">
              AI Illustrates
            </h3>
            <p className="text-sm text-navy/50 font-body">
              Every page gets a unique illustration in your chosen style.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy/5">
            <span className="text-3xl block mb-3">📚</span>
            <h3 className="font-display font-bold text-navy mb-1">
              Read & Share
            </h3>
            <p className="text-sm text-navy/50 font-body">
              Flip through your book and share it with friends and family.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
