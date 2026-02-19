"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VocabEntry } from "@/data/topics";
import { shuffle } from "@/lib/shuffle";
import { sample } from "@/lib/sample";

export type QuizDirection = "es-en" | "en-es";

function getPromptAndCorrect(
  item: VocabEntry,
  dir: QuizDirection
): { prompt: string; correct: string } {
  if (dir === "es-en") return { prompt: item.es, correct: item.en };
  return { prompt: item.en, correct: item.es };
}

function getTargetValue(item: VocabEntry, dir: QuizDirection): string {
  return dir === "es-en" ? item.en : item.es;
}

function buildOptions(
  items: VocabEntry[],
  currentItem: VocabEntry,
  dir: QuizDirection
): string[] {
  const { correct } = getPromptAndCorrect(currentItem, dir);
  const others = items.filter((i) => i.id !== currentItem.id);
  const candidateValues = others.map((i) => getTargetValue(i, dir));
  const uniqueCandidates = Array.from(new Set(candidateValues));
  const chosen = new Set<string>([correct]);
  while (chosen.size < 4 && uniqueCandidates.length > 0) {
    const available = uniqueCandidates.filter((v) => !chosen.has(v));
    if (available.length === 0) break;
    const picked = sample(available, 1)[0];
    chosen.add(picked);
  }
  const options = Array.from(chosen);
  while (options.length < 4 && candidateValues.length > 0) {
    const v = candidateValues[Math.floor(Math.random() * candidateValues.length)];
    if (!options.includes(v)) options.push(v);
  }
  return shuffle(options.length >= 4 ? options.slice(0, 4) : options);
}

export interface QuizSessionState {
  items: VocabEntry[];
  shuffledOrder: number[];
  currentIndex: number;
  currentItem: VocabEntry | null;
  options: string[];
  correctOption: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
  correctCount: number;
  wrongIds: string[];
  status: "in_progress" | "complete";
  direction: QuizDirection;
}

const ADVANCE_MS = 1500;

export function useQuizSession(
  vocab: VocabEntry[] | null,
  direction: QuizDirection | null,
  wrongIdsOnly: string[] | null
) {
  const [state, setState] = useState<QuizSessionState | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAdvancedRef = useRef(false);

  const startSession = useCallback(
    (itemIds?: string[] | null) => {
      if (!vocab || !direction) return;
      const items =
        itemIds && itemIds.length > 0
          ? vocab.filter((v) => itemIds.includes(v.id))
          : vocab;
      if (items.length === 0) return;
      const shuffled = shuffle(items.map((_, i) => i));
      const firstIndex = shuffled[0];
      const firstItem = items[firstIndex];
      const { correct } = getPromptAndCorrect(firstItem, direction);
      const options = buildOptions(items, firstItem, direction);

      setState({
        items,
        shuffledOrder: shuffled,
        currentIndex: 0,
        currentItem: firstItem,
        options,
        correctOption: correct,
        selectedOption: null,
        isCorrect: null,
        correctCount: 0,
        wrongIds: [],
        status: "in_progress",
        direction,
      });
      hasAdvancedRef.current = false;
    },
    [vocab, direction]
  );

  useEffect(() => {
    if (vocab && direction && !state) {
      startSession(wrongIdsOnly ?? null);
    }
  }, [vocab, direction, wrongIdsOnly, state, startSession]);

  const selectOption = useCallback(
    (option: string) => {
      if (!state || state.selectedOption !== null || state.status === "complete")
        return;
      const isCorrect = option === state.correctOption;
      const newWrongIds = isCorrect
        ? state.wrongIds
        : [...state.wrongIds, state.currentItem!.id];

      setState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedOption: option,
          isCorrect,
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
          wrongIds: newWrongIds,
        };
      });

      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
      hasAdvancedRef.current = false;
      advanceTimeoutRef.current = setTimeout(() => {
        if (hasAdvancedRef.current) return;
        hasAdvancedRef.current = true;
        setState((prev) => {
          if (!prev || prev.status === "complete") return prev;
          const nextIndex = prev.currentIndex + 1;
          if (nextIndex >= prev.shuffledOrder.length) {
            return { ...prev, status: "complete", selectedOption: null, isCorrect: null };
          }
          const itemIndex = prev.shuffledOrder[nextIndex];
          const nextItem = prev.items[itemIndex];
          const { correct } = getPromptAndCorrect(nextItem, prev.direction);
          const options = buildOptions(prev.items, nextItem, prev.direction);
          return {
            ...prev,
            currentIndex: nextIndex,
            currentItem: nextItem,
            options,
            correctOption: correct,
            selectedOption: null,
            isCorrect: null,
          };
        });
      }, ADVANCE_MS);
    },
    [state]
  );

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }
    };
  }, []);

  const repeatAll = useCallback(() => {
    if (!vocab || !direction) return;
    startSession(null);
  }, [vocab, direction, startSession]);

  const improveWrong = useCallback(() => {
    if (!state || state.wrongIds.length === 0 || !vocab || !direction) return;
    startSession(state.wrongIds);
  }, [state, vocab, direction, startSession]);

  return {
    state,
    selectOption,
    repeatAll,
    improveWrong,
    startSession,
  };
}
