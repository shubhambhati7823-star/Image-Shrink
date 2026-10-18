"use client";

export type Theme = "dark" | "light";

type Props = {
  theme: Theme;
  onToggle: () => void;
};

export default function ThemeToggle({
  theme,
  onToggle,
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
        theme === "dark"
          ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
      }`}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}