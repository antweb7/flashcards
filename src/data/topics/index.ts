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

// Auto-discover all topic JSON files in this directory
const ctx = require.context("./", false, /^\.\/[^/]+\.json$/);

const topicData: Record<string, VocabEntry[]> = {};
const topics: { slug: string; title: string; description?: string; count: number }[] = [];

ctx.keys().forEach((path) => {
  const slug = path.replace(/^\.\//, "").replace(/\.json$/, "");
  const data = ctx(path) as TopicFile;
  if (data?.vocab && Array.isArray(data.vocab)) {
    topicData[slug] = data.vocab;
    topics.push({
      slug,
      title: data.title,
      description: data.description,
      count: data.vocab.length,
    });
  }
});

export type TopicSlug = keyof typeof topicData;

export { topics };

export function getTopicVocab(slug: string): VocabEntry[] | null {
  const vocab = topicData[slug];
  return vocab ?? null;
}

export function getTopicBySlug(slug: string): (typeof topics)[0] | null {
  return topics.find((t) => t.slug === slug) ?? null;
}
