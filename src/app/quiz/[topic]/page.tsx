"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Link from "next/link";
import { getTopicVocab, getTopicBySlug } from "@/data/topics";
import { useQuizSession } from "@/hooks/useQuizSession";
import type { QuizDirection } from "@/hooks/useQuizSession";
import { QuizCard } from "@/components/QuizCard";
import { CompletionCard } from "@/components/CompletionCard";

const VALID_DIRS: QuizDirection[] = ["es-en", "en-es"];

function isValidDir(dir: string | null): dir is QuizDirection {
  return dir === "es-en" || dir === "en-es";
}

export default function QuizPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = typeof params.topic === "string" ? params.topic : "";
  const dirParam = searchParams.get("dir");

  const topicMeta = getTopicBySlug(topic);
  const vocab = getTopicVocab(topic);
  const direction: QuizDirection | null = isValidDir(dirParam) ? dirParam : null;

  const { state, selectOption, repeatAll, improveWrong } = useQuizSession(
    vocab,
    direction,
    null
  );

  useEffect(() => {
    if (!state || state.status !== "in_progress" || state.selectedOption !== null) return;
    const options = state.options;
    const handler = (e: KeyboardEvent) => {
      const n = e.key === "1" ? 0 : e.key === "2" ? 1 : e.key === "3" ? 2 : e.key === "4" ? 3 : -1;
      if (n >= 0 && n < options.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        selectOption(options[n]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state?.status, state?.selectedOption, state?.options, selectOption]);

  const handleChooseDirection = useCallback(
    (dir: QuizDirection) => {
      router.replace(`/quiz/${topic}?dir=${dir}`);
    },
    [router, topic]
  );

  if (!topicMeta || !vocab) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
          <div className="rounded-2xl bg-[#282828] p-8 text-center">
            <h1 className="text-xl font-semibold text-white">Topic not found</h1>
            <p className="mt-2 text-[#b3b3b3]">This topic doesn&apos;t exist.</p>
            <Link
              href="/topics"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1db954] px-6 font-medium text-white transition hover:bg-[#1ed760] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#121212]"
            >
              Back to Topics
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!direction) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
          <Link
            href="/topics"
            className="text-sm font-medium text-[#b3b3b3] hover:text-[#1db954] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded transition-colors"
          >
            ←
          </Link>
          <div className="mt-8 rounded-2xl bg-[#282828] p-8">
            <h2 className="text-xl font-semibold text-white">Choose direction</h2>
            <p className="mt-1 text-[#b3b3b3]">{topicMeta.title}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleChooseDirection("es-en")}
                className="min-h-12 rounded-xl bg-[#181818] px-4 py-3 text-left font-medium text-white transition hover:bg-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#282828]"
              >
                Spanish → English
              </button>
              <button
                type="button"
                onClick={() => handleChooseDirection("en-es")}
                className="min-h-12 rounded-xl bg-[#181818] px-4 py-3 text-left font-medium text-white transition hover:bg-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#282828]"
              >
                English → Spanish
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (state?.status === "complete") {
    const wrongItems = vocab.filter((v) => state.wrongIds.includes(v.id));
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
          <Link
            href="/topics"
            className="text-sm font-medium text-[#b3b3b3] hover:text-[#1db954] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded transition-colors"
          >
            ←
          </Link>
          <div className="mt-8">
            <CompletionCard
              correctCount={state.correctCount}
              totalCount={state.items.length}
              wrongIds={state.wrongIds}
              wrongItems={wrongItems}
              direction={state.direction}
              onRepeatAll={repeatAll}
              onImproveWrong={improveWrong}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-[#b3b3b3]">Loading…</p>
      </div>
    );
  }

  const total = state.shuffledOrder.length;
  const current = state.currentIndex + 1;

  return (
    <div className="min-h-screen bg-[#121212]">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#b3b3b3]">
          <Link
            href="/topics"
            className="font-medium hover:text-[#1db954] focus:outline-none focus:ring-2 focus:ring-[#1db954] rounded transition-colors"
          >
            ←
          </Link>
          <span>Progress: {current} / {total}</span>
          <span>Score: {state.correctCount}</span>
        </div>
        <div className="mt-8">
          <QuizCard
            prompt={
              state.direction === "es-en"
                ? state.currentItem!.es
                : state.currentItem!.en
            }
            promptLang={state.direction === "es-en" ? "es" : "en"}
            options={state.options}
            correctOption={state.correctOption}
            selectedOption={state.selectedOption}
            isCorrect={state.isCorrect}
            onSelect={selectOption}
            disabled={state.selectedOption !== null}
          />
        </div>
      </main>
    </div>
  );
}
