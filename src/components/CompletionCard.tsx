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
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">Quiz complete</h2>
      <p className="mt-2 text-3xl font-bold text-zinc-900">
        {correctCount} / {totalCount} ({pct}%)
      </p>
      <div className="mt-4 flex gap-6 text-sm text-zinc-600">
        <span>Correct: {correctCount}</span>
        <span>Wrong: {totalCount - correctCount}</span>
      </div>

      {hasWrong && wrongItems.length > 0 && (
        <div className="mt-6 rounded-xl bg-zinc-50 p-4">
          <h3 className="text-sm font-medium text-zinc-700">Words to improve</h3>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600">
            {wrongItems.map((item) => (
              <li key={item.id}>{pairLabel(item, direction)}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/topics"
          className="min-h-12 flex items-center justify-center rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          Back to Topics
        </Link>
        <button
          type="button"
          onClick={onRepeatAll}
          className="min-h-12 rounded-xl border border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          Repeat (All)
        </button>
        {hasWrong ? (
          <button
            type="button"
            onClick={onImproveWrong}
            className="min-h-12 rounded-xl border border-emerald-200 bg-emerald-50 font-medium text-emerald-800 shadow-sm transition hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            Improve (Wrong Only)
          </button>
        ) : (
          <p className="min-h-12 flex items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500">
            No wrong answers 🎉
          </p>
        )}
      </div>
    </div>
  );
}
