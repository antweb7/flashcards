"use client";

import Link from "next/link";
import type { VocabEntry } from "@/data/topics";
import type { QuizDirection } from "@/hooks/useQuizSession";

type CompletionCardProps = {
  correctCount: number;
  totalCount: number;
  wrongIds: string[];
  wrongItems: VocabEntry[];
  direction: QuizDirection;
  onRepeatAll: () => void;
  onImproveWrong: () => void;
};

function pairLabel(item: VocabEntry, direction: QuizDirection): string {
  if (direction === "es-en") return `${item.es} → ${item.en}`;
  return `${item.en} → ${item.es}`;
}

export function CompletionCard({
  correctCount,
  totalCount,
  wrongIds,
  wrongItems,
  direction,
  onRepeatAll,
  onImproveWrong,
}: CompletionCardProps) {
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const hasWrong = wrongIds.length > 0;

  return (
    <div className="w-full rounded-2xl bg-[#282828] p-6">
      <h2 className="text-xl font-semibold text-white">Quiz complete</h2>
      <p className="mt-2 text-3xl font-bold text-white">
        {correctCount} / {totalCount} ({pct}%)
      </p>
      <div className="mt-4 flex gap-6 text-sm text-[#b3b3b3]">
        <span>Correct: {correctCount}</span>
        <span>Wrong: {totalCount - correctCount}</span>
      </div>

      {hasWrong && wrongItems.length > 0 && (
        <div className="mt-6 rounded-xl bg-[#181818] p-4">
          <h3 className="text-sm font-medium text-white">Words to improve</h3>
          <ul className="mt-2 space-y-1 text-sm text-[#b3b3b3]">
            {wrongItems.map((item) => (
              <li key={item.id}>{pairLabel(item, direction)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/topics"
          className="min-h-12 flex items-center justify-center rounded-xl bg-[#1db954] font-medium text-white transition hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#282828]"
        >
          Back to Topics
        </Link>
        <button
          type="button"
          onClick={onRepeatAll}
          className="min-h-12 rounded-xl bg-[#181818] font-medium text-white transition hover:bg-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#282828]"
        >
          Repeat (All)
        </button>
        {hasWrong ? (
          <button
            type="button"
            onClick={onImproveWrong}
            className="min-h-12 rounded-xl bg-red-500/20 font-medium text-red-500 transition hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#282828]"
          >
            Improve (Wrong Only)
          </button>
        ) : (
          <p className="min-h-12 flex items-center justify-center rounded-xl bg-[#181818] text-sm text-[#b3b3b3]">
            No wrong answers 🎉
          </p>
        )}
      </div>
    </div>
  );
}
