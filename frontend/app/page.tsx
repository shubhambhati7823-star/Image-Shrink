
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle, { type Theme } from "./components/ThemeToggle";

export default function Home() {
  const router = useRouter();

  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("image-shrink-theme");

    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem("image-shrink-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme, ready]);

  useEffect(() => {
  setYear(new Date().getFullYear());
}, []);

  const startCompression = () => {
  router.push("/compress");
};
  const dark = theme === "dark";

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        dark
          ? "bg-[#080b14] text-white"
          : "bg-[#f8f9ff] text-slate-900"
      }`}
    >
      {/* Background decoration — no white circle/orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className={`absolute -top-48 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[130px] ${
            dark ? "bg-violet-700/20" : "bg-violet-400/20"
          }`}
        />
        <div
          className={`absolute right-[-120px] top-[420px] h-72 w-72 rounded-full blur-[110px] ${
            dark ? "bg-blue-600/10" : "bg-blue-300/20"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            dark
              ? "opacity-[0.12]"
              : "opacity-[0.3]"
          }`}
          style={{
            backgroundImage:
              "radial-gradient(currentColor 0.7px, transparent 0.7px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Navigation */}
      <header
        className={`relative z-10 border-b ${
          dark ? "border-white/[0.08]" : "border-slate-200/80"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a
            href="/"
            className="flex items-center gap-3"
            aria-label="Image Shrink home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-black text-white shadow-lg shadow-violet-600/25">
              IS
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Image <span className="text-violet-500">Shrink</span>
            </span>
          </a>

          <div className="flex items-center gap-3">

            <ThemeToggle
              theme={theme}
              onToggle={() =>
                setTheme((current) =>
                  current === "dark" ? "light" : "dark"
                )
              }
            />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="max-w-2xl">
          <div
            className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide ${
              dark
                ? "border-violet-400/20 bg-violet-400/[0.08] text-violet-300"
                : "border-violet-200 bg-violet-50 text-violet-800"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            YOUR IMAGE OPTIMIZATION STUDIO
          </div>

          <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Less size.
            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text pb-2 text-transparent">
              More possibilities.
            </span>
          </h1>

          <p
            className={`mt-7 max-w-lg text-base leading-8 sm:text-lg ${
              dark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Make your images lighter without making your workflow harder.
            Choose your quality, preview the result, and download your
            optimized images in just a few clicks.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={startCompression}
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-violet-600 px-7 py-4 font-bold text-white shadow-xl shadow-violet-600/25 transition hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
            >
              Start compressing
              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>

            <a
              href="#features"
              className={`inline-flex items-center justify-center rounded-xl border px-7 py-4 font-semibold transition ${
                dark
                  ? "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Explore features
            </a>
          </div>

          <div
            className={`mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm ${
              dark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Quality control
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Image preview
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Easy downloads
            </span>
          </div>
        </div>

        {/* Product preview card instead of a large white circle */}
        <div className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-600/20 via-indigo-500/10 to-blue-500/10 blur-2xl"
          />

          <div
            className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
              dark
                ? "border-white/10 bg-[#101522]/95 shadow-black/30"
                : "border-slate-200 bg-white/95 shadow-slate-300/40"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-5 py-4 ${
                dark ? "border-white/[0.08]" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span
                className={`text-xs font-medium ${
                  dark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                IMAGE PREVIEW
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <div
                className={`relative flex h-64 items-center justify-center overflow-hidden rounded-2xl border sm:h-72 ${
                  dark
                    ? "border-white/[0.06] bg-[#171d2c]"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-blue-500/15"
                />

                <svg
                  viewBox="0 0 360 230"
                  role="img"
                  aria-label="Illustration of mountains, sun and sky in an image preview"
                  className="relative z-10 h-full w-full p-5"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <linearGradient id="mountain" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="18"
                    y="15"
                    width="324"
                    height="200"
                    rx="18"
                    fill="url(#sky)"
                    opacity="0.18"
                  />
                  <circle cx="256" cy="65" r="27" fill="#fbbf24" />
                  <path
                    d="M28 176 L110 78 L176 153 L218 110 L332 196 L28 196 Z"
                    fill="url(#mountain)"
                  />
                  <path
                    d="M28 184 L108 126 L157 172 L222 124 L332 194 L332 205 L28 205 Z"
                    fill="#4f46e5"
                    opacity="0.7"
                  />
                  <path
                    d="M83 110 L110 78 L135 108 L116 102 L108 113 L98 103 Z"
                    fill="#fff"
                    opacity="0.8"
                  />
                  <path
                    d="M195 146 L218 110 L248 142 L226 134 L216 143 L208 135 Z"
                    fill="#fff"
                    opacity="0.8"
                  />
                </svg>

                <div
                  className={`absolute bottom-4 left-4 rounded-lg border px-3 py-2 text-xs font-medium backdrop-blur-md ${
                    dark
                      ? "border-white/10 bg-[#080b14]/70 text-white"
                      : "border-white/70 bg-white/80 text-slate-700"
                  }`}
                >
                  Preview your image
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-bold ${
                      dark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    optimized-image.webp
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      dark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Quality you control
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-500">
                  Ready to optimize
                </span>
              </div>

              <div
                className={`mt-5 rounded-xl border p-4 ${
                  dark
                    ? "border-white/[0.08] bg-white/[0.025]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={dark ? "text-slate-300" : "text-slate-600"}
                  >
                    Compression quality
                  </span>
                  <span className="font-bold text-violet-500">Your choice</span>
                </div>
                <div
                  className={`mt-3 h-2 overflow-hidden rounded-full ${
                    dark ? "bg-white/10" : "bg-slate-200"
                  }`}
                >
                  <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-violet-600 to-indigo-400" />
                </div>
                <p
                  className={`mt-2 text-xs ${
                    dark ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Preview panel illustration — use the compression page to
                  process real images.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className={`relative z-10 border-t ${
          dark ? "border-white/[0.08]" : "border-slate-200"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
              Built for a simpler workflow
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need. Nothing you don’t.
            </h2>
            <p
              className={`mt-4 leading-7 ${
                dark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              A clean, straightforward way to prepare images for your projects.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "↘",
                title: "Smaller image files",
                description:
                  "Reduce image file sizes to help prepare assets for websites and apps.",
              },
              {
                icon: "◈",
                title: "Quality control",
                description:
                  "Choose your preferred compression settings for your workflow.",
              },
              {
                icon: "↓",
                title: "Simple downloads",
                description:
                  "Preview your output and download the optimized image with ease.",
              },
            ].map((feature) => (
              <article
                key={feature.title}
                className={`rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 ${
                  dark
                    ? "border-white/[0.08] bg-white/[0.025] hover:border-violet-400/30 hover:bg-white/[0.045]"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl font-bold text-violet-500">
                  {feature.icon}
                </span>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    dark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative z-10 px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-violet-600 to-indigo-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">
            Ready when you are
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
            Give your images a lighter footprint.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-violet-100 sm:text-base">
            Start optimizing your images with a workflow that stays simple.
          </p>
          <button
            type="button"
            onClick={startCompression}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-violet-800 transition hover:-translate-y-0.5 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Start Compression <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      
<footer
  className={`relative z-10 border-t px-5 py-7 text-center text-sm ${
    dark
      ? "border-white/[0.08] text-slate-500"
      : "border-slate-200 text-slate-500"
  }`}
>
  © 2026 Image Shrink. Made for a lighter web.
</footer>

    </main>
  );
}
