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
    <div className="w-full rounded-2xl bg-[#282828] p-6">
      <p className="mb-6 text-2xl font-medium text-white" lang={promptLang}>
        {prompt}
      </p>
      <div className="flex flex-col gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === correctOption;
          const showCorrect = selectedOption !== null && isCorrectOption;
          const showWrong = selectedOption !== null && isSelected && !isCorrect;

          let bg = "bg-[#181818] hover:bg-[#3e3e3e]";
          if (showCorrect) bg = "bg-emerald-500/20 ring-2 ring-emerald-500";
          if (showWrong) bg = "bg-red-500/20 ring-2 ring-red-500";

          return (
            <button
              key={`${option}-${index}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`min-h-12 rounded-xl px-4 py-3 text-left font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:ring-offset-2 focus:ring-offset-[#282828] disabled:cursor-default ${bg}`}
              aria-label={`Option ${index + 1}: ${option}`}
              aria-pressed={isSelected}
            >
              <span className="flex items-center justify-between gap-2">
                <span>{option}</span>
                {selectedOption !== null && isSelected && (
                  <span aria-hidden>{isCorrect ? "✅" : "❌"}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {selectedOption !== null && (
        <p className="mt-4 text-sm text-[#b3b3b3]" role="status">
          {isCorrect ? (
            <span className="text-emerald-500">Correct ✅</span>
          ) : (
            <>
              Wrong ❌ Correct answer: <strong className="text-white">{correctOption}</strong>
            </>
          )}
        </p>
      )}
    </div>
  );
}
