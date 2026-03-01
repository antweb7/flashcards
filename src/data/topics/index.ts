import laRopa from "./la-ropa.json";
import laPersonalidad from "./la-personalidad.json";

export interface VocabEntry {
  id: string;
  es: string;
  en: string;
}

export interface TopicFile {
  title: string;
  description?: string;
  vocab: VocabEntry[];
}

// Add new topics here: import + add to topicFiles. Title, description, count come from the JSON.
const topicFiles: Record<string, TopicFile> = {
  "la-ropa": laRopa as TopicFile,
  "la-personalidad": laPersonalidad as TopicFile,
};

const topicData: Record<string, VocabEntry[]> = {};
const topics: { slug: string; title: string; description?: string; count: number }[] = [];

for (const [slug, data] of Object.entries(topicFiles)) {
  topicData[slug] = data.vocab;
  topics.push({
    slug,
    title: data.title,
    description: data.description,
    count: data.vocab.length,
  });
}

export type TopicSlug = keyof typeof topicData;

export { topics };

export function getTopicVocab(slug: string): VocabEntry[] | null {
  const vocab = topicData[slug];
  return vocab ?? null;
}

export function getTopicBySlug(slug: string): (typeof topics)[0] | null {
  return topics.find((t) => t.slug === slug) ?? null;
}
