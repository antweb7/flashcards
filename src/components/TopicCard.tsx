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
      className="w-full min-h-[100px] rounded-xl bg-[#282828] p-6 text-left transition hover:bg-[#3e3e3e] focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#121212] active:scale-[0.99] group"
      aria-label={`Start quiz: ${title}`}
    >
      <h2 className="text-xl font-semibold text-white group-hover:text-[#1db954] transition-colors">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[#b3b3b3]">{count} words</p>
    </button>
  );
}
