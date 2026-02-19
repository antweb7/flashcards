"use client";

import { useCallback, useEffect, useRef } from "react";
import type { QuizDirection } from "@/hooks/useQuizSession";

type DirectionModalProps = {
  topicTitle: string;
  onChoose: (dir: QuizDirection) => void;
  onClose: () => void;
};

export function DirectionModal({ topicTitle, onChoose, onClose }: DirectionModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previouslyFocused?.focus();
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="direction-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          aria-label="Close"
        >
          <span className="text-xl leading-none">×</span>
        </button>
        <h2 id="direction-modal-title" className="pr-8 text-xl font-semibold text-zinc-900">
          Choose direction
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{topicTitle}</p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onChoose("es-en")}
            className="min-h-12 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            Spanish → English
          </button>
          <button
            type="button"
            onClick={() => onChoose("en-es")}
            className="min-h-12 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
          >
            English → Spanish
          </button>
        </div>
      </div>
    </div>
  );
}
