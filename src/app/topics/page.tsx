"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TopicCard } from "@/components/TopicCard";
import { DirectionModal } from "@/components/DirectionModal";
import { topics } from "@/data/topics";
import type { QuizDirection } from "@/hooks/useQuizSession";

export default function TopicsPage() {
  const router = useRouter();
  const [modalTopic, setModalTopic] = useState<{ slug: string; title: string } | null>(null);

  const handleTopicClick = (slug: string, title: string) => {
    setModalTopic({ slug, title });
  };

  const handleChooseDirection = (dir: QuizDirection) => {
    if (!modalTopic) return;
    router.push(`/quiz/${modalTopic.slug}?dir=${dir}`);
    setModalTopic(null);
  };

  const handleCloseModal = () => setModalTopic(null);

  return (
    <div className="min-h-screen bg-[#121212]">
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
        <h1 className="text-2xl font-bold text-white">Spanish Topics</h1>
        <p className="mt-1 text-[#b3b3b3]">Pick a topic to start a quiz</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <TopicCard
              key={t.slug}
              title={t.title}
              count={t.count}
              onClick={() => handleTopicClick(t.slug, t.title)}
            />
          ))}
        </div>
      </main>
      {modalTopic && (
        <DirectionModal
          topicTitle={modalTopic.title}
          onChoose={handleChooseDirection}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
