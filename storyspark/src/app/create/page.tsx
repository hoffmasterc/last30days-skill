"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useBookStore } from "@/store/bookStore";
import { QUESTIONS } from "@/lib/scoring";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import GeneratingScreen from "@/components/GeneratingScreen";
import WaitlistModal from "@/components/WaitlistModal";

export default function CreatePage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [showWaitlist, setShowWaitlist] = useState(false);
  const {
    currentStep,
    inputs,
    nextStep,
    prevStep,
    setFollowUp,
    incrementFollowUpCount,
    getFollowUpCount,
    followUpQuestion,
    generationStatus,
    setGenerationStatus,
    setPages,
    setBookTitle,
    setBookId,
    slideDirection,
  } = useBookStore();

  const question = QUESTIONS[currentStep];
  const isGenerating = generationStatus.stage !== "idle";

  const evaluateAndProceed = async () => {
    const q = QUESTIONS[currentStep];

    // Multiple choice or optional with no required_attributes — just proceed
    if (q.type === "multiple_choice" || !q.required_attributes?.length) {
      if (currentStep === QUESTIONS.length - 1) {
        await startGeneration();
      } else {
        nextStep();
      }
      return;
    }

    // If already in follow-up and max follow-ups reached, proceed
    if (followUpQuestion && getFollowUpCount(q.id) >= 2) {
      if (currentStep === QUESTIONS.length - 1) {
        await startGeneration();
      } else {
        nextStep();
      }
      return;
    }

    // Evaluate the response
    try {
      const res = await fetch("/api/questions/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: q.id,
          question_text: q.question,
          response: inputs[q.id] || "",
          required_attributes: q.required_attributes,
        }),
      });
      const data = await res.json();

      if (data.needs_followup && getFollowUpCount(q.id) < 2) {
        incrementFollowUpCount(q.id);
        setFollowUp(q.id, data.followup_question);
        return;
      }
    } catch {
      // If evaluation fails, proceed anyway
    }

    if (currentStep === QUESTIONS.length - 1) {
      await startGeneration();
    } else {
      nextStep();
    }
  };

  const startGeneration = async () => {
    setGenerationStatus({
      stage: "outline",
      message: "Writing your story outline...",
    });

    try {
      // Stage 1: Story outline
      const outlineRes = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const outline = await outlineRes.json();
      if (!outlineRes.ok) throw new Error(outline.error || "Outline failed");

      setBookTitle(outline.title);
      const pageCount = outline.pages.length;

      // Stage 2: Page text (sequential)
      const pageTexts: string[] = [];
      for (let i = 0; i < pageCount; i++) {
        setGenerationStatus({
          stage: "text",
          currentPage: i + 1,
          totalPages: pageCount,
          message: `Writing page ${i + 1} of ${pageCount}...`,
        });

        const textRes = await fetch("/api/story/page-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_number: i + 1,
            page_count: pageCount,
            audience_age: inputs.audience_age,
            tone: inputs.tone,
            previous_summaries: pageTexts.join(" | "),
            scene_description: outline.pages[i].scene_description,
          }),
        });
        const textData = await textRes.json();
        if (!textRes.ok) throw new Error(textData.error || "Text generation failed");
        pageTexts.push(textData.text);
      }

      // Stage 3: Image generation (sequential)
      const pagesData = [];
      for (let i = 0; i < pageCount; i++) {
        setGenerationStatus({
          stage: "images",
          currentPage: i + 1,
          totalPages: pageCount,
          message: `Illustrating page ${i + 1} of ${pageCount}...`,
        });

        const imgRes = await fetch("/api/images/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            art_style: inputs.art_style,
            color_palette: inputs.color_palette,
            main_character: inputs.main_character,
            supporting_characters: inputs.supporting_characters || "",
            scene_description: outline.pages[i].scene_description,
            environment: outline.pages[i].environment,
          }),
        });
        const imgData = await imgRes.json();
        if (!imgRes.ok) throw new Error(imgData.error || "Image generation failed");

        pagesData.push({
          page_number: i + 1,
          text: pageTexts[i],
          image_base64: imgData.image_base64,
        });
      }

      setPages(pagesData);

      // Save if authenticated
      if (userId) {
        setGenerationStatus({
          stage: "saving",
          message: "Almost done! Finishing your book...",
        });

        const saveRes = await fetch("/api/books/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: outline.title,
            inputs,
            pages: pagesData,
          }),
        });
        const saveData = await saveRes.json();
        if (saveRes.ok && saveData.id) {
          setBookId(saveData.id);
        }
      }

      setGenerationStatus({ stage: "complete", message: "Your book is ready!" });
      setShowWaitlist(true);
    } catch (error) {
      setGenerationStatus({
        stage: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  if (isGenerating && generationStatus.stage !== "complete") {
    if (generationStatus.stage === "error") {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream">
          <div className="text-center max-w-md">
            <span className="text-4xl block mb-4">😔</span>
            <h2 className="text-2xl font-display font-bold text-navy mb-2">
              Oops, something went wrong
            </h2>
            <p className="text-navy/60 font-body mb-6">
              {generationStatus.message}
            </p>
            <button
              onClick={() => setGenerationStatus({ stage: "idle", message: "" })}
              className="py-3 px-8 bg-amber text-white font-display font-bold rounded-2xl hover:bg-amber/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return <GeneratingScreen />;
  }

  if (generationStatus.stage === "complete") {
    const { pages, bookTitle, bookId, reset } = useBookStore.getState();

    return (
      <>
        <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
        <div className="min-h-screen bg-cream">
          {/* Inline BookPreview */}
          <BookPreviewInline
            title={bookTitle}
            pages={pages}
            bookId={bookId}
            onNewBook={() => {
              reset();
              router.push("/create");
            }}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-6 pb-4">
        <ProgressBar current={currentStep} total={QUESTIONS.length} />
      </div>
      {question && (
        <QuestionCard
          key={`${question.id}-${followUpQuestion ? "followup" : "main"}`}
          question={question}
          onNext={evaluateAndProceed}
          onBack={prevStep}
          isFirst={currentStep === 0}
          isLast={currentStep === QUESTIONS.length - 1}
          slideDirection={slideDirection}
        />
      )}
    </div>
  );
}

// Inline preview to avoid import issues
function BookPreviewInline({
  title,
  pages,
  bookId,
  onNewBook,
}: {
  title: string;
  pages: { page_number: number; text: string; image_base64: string }[];
  bookId: string | null;
  onNewBook: () => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const goToPage = (index: number) => {
    if (animating || index < 0 || index >= pages.length) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    setCurrentPage(index);
  };

  const handleSave = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    if (bookId) {
      router.push(`/preview/${bookId}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `StorySpark: ${title}`,
          text: `Check out this picture book: "${title}"`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    }
  };

  const page = pages[currentPage];
  if (!page) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <h1 className="text-xl font-display font-bold text-navy truncate">{title}</h1>
        <button onClick={handleShare} className="p-3 rounded-full hover:bg-navy/5 min-w-[48px] min-h-[48px] flex items-center justify-center">
          <svg className="w-5 h-5 text-navy/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className={`w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-lg bg-white ${animating ? "animate-page-turn" : ""}`}>
          {page.image_base64 ? (
            <img src={`data:image/png;base64,${page.image_base64}`} alt={`Page ${page.page_number}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy/5">
              <span className="text-navy/30">Illustration</span>
            </div>
          )}
        </div>

        <div className="w-full max-w-lg mt-6 px-2">
          <p className="text-xl sm:text-2xl font-story text-navy text-center leading-relaxed">{page.text}</p>
        </div>

        <div className="flex items-center gap-6 mt-8">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} className="p-3 rounded-full hover:bg-navy/5 disabled:opacity-20 min-w-[48px] min-h-[48px] flex items-center justify-center">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-sm font-body text-navy/60">Page {currentPage + 1} of {pages.length}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pages.length - 1} className="p-3 rounded-full hover:bg-navy/5 disabled:opacity-20 min-w-[48px] min-h-[48px] flex items-center justify-center">
            <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="p-4 flex gap-3 max-w-lg mx-auto w-full">
        {!bookId && (
          <button onClick={handleSave} className="flex-1 py-4 bg-amber text-white font-display font-bold rounded-2xl text-lg hover:bg-amber/90 transition-colors min-h-[56px]">
            Save to My Library
          </button>
        )}
        <button onClick={onNewBook} className="flex-1 py-4 border-2 border-navy/10 text-navy font-display font-semibold rounded-2xl text-lg hover:border-navy/20 transition-colors min-h-[56px]">
          Start a New Book
        </button>
      </div>
    </div>
  );
}
