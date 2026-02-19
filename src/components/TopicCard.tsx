"use client";

type TopicCardProps = {
  title: string;
  count: number;
  onClick: () => void;
};

export function TopicCard({ title, count, onClick }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[100px] rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition hover:border-zinc-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 active:scale-[0.99]"
      aria-label={`Start quiz: ${title}`}
    >
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{count} words</p>
    </button>
  );
}
