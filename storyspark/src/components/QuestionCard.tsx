"use client";

import { useState } from "react";
import { useBookStore } from "@/store/bookStore";
import { QuestionConfig } from "@/lib/scoring";
import InfoPanel from "./InfoPanel";

interface QuestionCardProps {
  question: QuestionConfig;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  slideDirection: "left" | "right";
}

export default function QuestionCard({
  question,
  onNext,
  onBack,
  isFirst,
  isLast,
  slideDirection,
}: QuestionCardProps) {
  const { inputs, setInput, followUpQuestion } = useBookStore();
  const [textValue, setTextValue] = useState(inputs[question.id] || "");
  const currentValue = inputs[question.id] || "";

  const handleSelect = (value: string) => {
    setInput(question.id, value);
    onNext();
  };

  const handleTextSubmit = () => {
    if (textValue.trim() || question.optional) {
      setInput(question.id, textValue.trim());
      onNext();
    }
  };

  const handleSkip = () => {
    setInput(question.id, "");
    onNext();
  };

  const animClass = slideDirection === "right" ? "animate-slide-right" : "animate-slide-left";

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] px-4 ${animClass}`}>
      <div className="w-full max-w-xl">
        <div className="flex items-start gap-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy leading-tight">
            {followUpQuestion || question.question}
          </h2>
          <InfoPanel hint={question.hint} />
        </div>

        {question.type === "multiple_choice" && !followUpQuestion ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`p-5 rounded-2xl border-2 text-left transition-all min-h-[64px] flex items-center gap-3 ${
                  currentValue === option.value
                    ? "border-amber bg-amber/10 shadow-md"
                    : "border-navy/10 hover:border-amber/50 hover:shadow-sm bg-white"
                }`}
              >
                {option.icon && (
                  <span className="text-2xl flex-shrink-0">{option.icon}</span>
                )}
                <span className="font-display font-semibold text-lg text-navy">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={question.placeholder}
              rows={3}
              className="w-full p-4 rounded-2xl border-2 border-navy/10 focus:border-amber focus:outline-none bg-white text-navy font-body text-lg resize-none transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit();
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleTextSubmit}
                disabled={!textValue.trim() && !question.optional}
                className="flex-1 py-4 px-6 bg-amber text-white font-display font-bold rounded-2xl text-lg hover:bg-amber/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
              >
                {isLast ? "Create My Book" : "Continue"}
              </button>
              {question.optional && (
                <button
                  onClick={handleSkip}
                  className="py-4 px-6 border-2 border-navy/10 text-navy/60 font-display font-semibold rounded-2xl text-lg hover:border-navy/20 transition-colors min-h-[56px]"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        )}

        {!isFirst && (
          <button
            onClick={onBack}
            className="mt-6 text-navy/50 hover:text-navy font-body text-sm transition-colors min-h-[48px] flex items-center gap-1"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
