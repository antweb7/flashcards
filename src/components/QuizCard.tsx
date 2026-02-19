"use client";

type QuizCardProps = {
  prompt: string;
  promptLang?: "es" | "en";
  options: string[];
  correctOption: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
  onSelect: (option: string) => void;
  disabled: boolean;
};

export function QuizCard({
  prompt,
  promptLang = "es",
  options,
  correctOption,
  selectedOption,
  isCorrect,
  onSelect,
  disabled,
}: QuizCardProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="mb-6 text-2xl font-medium text-zinc-900" lang={promptLang}>
        {prompt}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === correctOption;
          const showCorrect = selectedOption !== null && isCorrectOption;
          const showWrong = selectedOption !== null && isSelected && !isCorrect;

          let bg = "bg-white border-zinc-200 hover:bg-zinc-50";
          if (showCorrect) bg = "bg-emerald-50 border-emerald-500";
          if (showWrong) bg = "bg-red-50 border-red-500";

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`min-h-12 rounded-xl border px-4 py-3 text-left font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-default ${bg}`}
              aria-label={`Option ${index + 1}: ${option}`}
              aria-pressed={isSelected}
            >
              <span className="flex items-center justify-between gap-2">
                <span>
                  <span className="mr-2 text-zinc-500">{index + 1}.</span>
                  {option}
                </span>
                {selectedOption !== null && isSelected && (
                  <span aria-hidden>{isCorrect ? "✅" : "❌"}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {selectedOption !== null && (
        <p className="mt-4 text-sm text-zinc-600" role="status">
          {isCorrect ? (
            <>Correct ✅</>
          ) : (
            <>
              Wrong ❌ Correct answer: <strong>{correctOption}</strong>
            </>
          )}
        </p>
      )}
    </div>
  );
}
