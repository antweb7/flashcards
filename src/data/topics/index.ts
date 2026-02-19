import laRopa from "./la-ropa.json";

export interface VocabEntry {
  id: string;
  es: string;
  en: string;
}

const topicData: Record<string, VocabEntry[]> = {
  "la-ropa": laRopa as VocabEntry[],
};

export type TopicSlug = keyof typeof topicData;

export const topics: { slug: TopicSlug; title: string; description?: string; count: number }[] = [
  { slug: "la-ropa", title: "La ropa", description: "Clothing", count: topicData["la-ropa"].length },
];

export function getTopicVocab(slug: string): VocabEntry[] | null {
  const vocab = topicData[slug as TopicSlug];
  return vocab ?? null;
}

export function getTopicBySlug(slug: string): (typeof topics)[0] | null {
  return topics.find((t) => t.slug === slug) ?? null;
}
