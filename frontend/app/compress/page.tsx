
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, DragEvent } from "react";
import ThemeToggle, { type Theme } from "../components/ThemeToggle";

export default function CompressPage() {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("image-shrink-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      document.documentElement.dataset.theme = savedTheme;
    } else {
      document.documentElement.dataset.theme = "dark";
    }

    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    localStorage.setItem("image-shrink-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme, themeReady]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!compressedBlob) {
      setOutputUrl(null);
      return;
    }

    const url = URL.createObjectURL(compressedBlob);
    setOutputUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [compressedBlob]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];

    setError("");
    setMessage("");
    setCompressedBlob(null);

    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(selected.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFile(selected);
    setCompressedBlob(null);
  };

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setError("");
    setMessage("");
    setCompressedBlob(null);

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(droppedFile.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }

    if (droppedFile.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    setFile(droppedFile);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setCompressedBlob(null);
  };

  const compressImage = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    setCompressedBlob(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("quality", String(quality));

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

    let response: Response;     

try {
  response = await fetch(`${apiBase}/api/compress`, {
    method: "POST",
    body: formData,
  });
} catch {
  throw new Error(
    "Cannot connect to the server. Please check your connection and try again."
  );
}

      if (!response.ok) {
        let errorMessage = "Image compression failed.";

        try {
          const body: { message?: string } = await response.json();
          errorMessage = body.message || errorMessage;
        } catch {
        }

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      if (!blob.type.includes("image/")) {
        throw new Error("Backend did not return a valid image.");
      }

      const originalSize =
        Number(response.headers.get("X-Original-Size")) || file.size;

      const compressedSize =
        Number(response.headers.get("X-Compressed-Size")) || blob.size;

      const reductionPercent = Number(
        response.headers.get("X-Compression-Percent") ??
          ((originalSize - compressedSize) / originalSize) * 100
      );

      setCompressedBlob(blob);

      if (reductionPercent >= 0) {
        setMessage(
          `Success! Size reduced by ${reductionPercent.toFixed(1)}%.`
        );
      } else {
        setMessage(
          `Compressed successfully, but the output is ${Math.abs(
            reductionPercent
          ).toFixed(1)}% larger than the original.`
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong during compression."
      );
    } finally {
      setBusy(false);
    }
  };

  if (!themeReady) return null;

  const dark = theme === "dark";

  const panel = dark
    ? "border-white/10 bg-white/[0.04]"
    : "border-slate-200 bg-white shadow-sm";

  const muted = dark ? "text-slate-400" : "text-slate-600";

  const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

  const downloadName = file
    ? `${file.name.replace(/\.[^.]+$/, "")}-compressed.webp`
    : "compressed.webp";

  const savedPercent =
  file && file.size > 0 && compressedBlob
    ? ((file.size - compressedBlob.size) / file.size) * 100
    : 0;  

  return (
    <main
      className={`min-h-screen transition-colors ${
        dark
          ? "bg-[#080b14] text-white"
          : "bg-[#f5f6fb] text-slate-950"
      }`}
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xl font-black"
        >
          Image <span className="text-violet-500">Shrink</span>
        </button>

        <ThemeToggle
          theme={theme}
          onToggle={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        />
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">
          Your workspace
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-5xl">
          Compress your images.
        </h1>

        <p className={`mt-3 max-w-xl leading-7 ${muted}`}>
          Select a file, set the quality, compress it, and download
          the optimized WebP image.
        </p>

        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <section className={`min-w-0 rounded-3xl border p-5 sm:p-7 ${panel}`}>
            <h2 className="text-lg font-bold">Upload image</h2>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-5 flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-violet-500/50 hover:bg-violet-500/5"
              } ${dark ? "bg-black/10" : "bg-slate-50"}`}
            >
              <span className="text-4xl text-violet-500">↑</span>
              <span className="mt-3 font-semibold">
                {isDragging
                  ? "Drop your image here"
                  : "Choose image from your device"}
              </span>
              <span className={`mt-2 text-sm ${muted}`}>
                JPG, PNG, WEBP · Max 10 MB
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {file && (
  <div className={`mt-4 rounded-xl border p-3 ${panel}`}>
    <p className="break-all text-sm font-semibold">
      {file.name}
    </p>

    <p className={`mt-1 text-sm ${muted}`}>
      Original size: {formatSize(file.size)}
    </p>

    <p className={`mt-1 text-sm ${muted}`}>
      Format: {file.type.split("/")[1]?.toUpperCase() ?? "Unknown"}
    </p>

    <button
      type="button"
      onClick={() => {
        setFile(null);
        setCompressedBlob(null);
        setMessage("");
        setError("");

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }}
      className="mt-2 text-sm text-rose-500 hover:text-rose-400"
    >
      Remove image
    </button>
  </div>
)}

            <div className="mt-7">
              <div className="flex justify-between gap-3">
                <label htmlFor="quality" className="text-sm font-semibold">
                  Compression quality
                </label>
                <span className="font-bold text-violet-500">{quality}%</span>
              </div>

              <input
                id="quality"
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => {
                  setQuality(Number(event.target.value));
                  setCompressedBlob(null);
                  setMessage("");
                }}
                className="mt-4 w-full accent-violet-600"
              />

              <div className={`flex justify-between text-xs ${muted}`}>
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>

            <button
              type="button"
              onClick={compressImage}
              disabled={!file || busy}
              className="mt-7 w-full rounded-xl bg-violet-700 px-5 py-4 font-bold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Compressing…" : "Compress Image"}
            </button>

            {error && (
              <p role="alert" className="mt-4 text-sm text-rose-500">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="mt-4 text-sm text-emerald-500">
                {message}
              </p>
            )}

            {compressedBlob && outputUrl && (
              <div className="mt-5 rounded-xl border border-emerald-500/30 p-4">
                <p className="text-sm">
                  Original: {file ? formatSize(file.size) : ""}
                </p>
                <p className="mt-1 text-sm">
                  Compressed: {formatSize(compressedBlob.size)}
                </p>
                <p className="mt-1 text-sm font-semibold text-emerald-500">
                {savedPercent >= 0
                 ? `${savedPercent.toFixed(1)}% smaller`
                 : `${Math.abs(savedPercent).toFixed(1)}% larger`}
                </p>
                <a
                  href={outputUrl}
                  download={downloadName}
                  className="mt-4 block rounded-xl bg-emerald-600 px-5 py-3 text-center font-bold text-white hover:bg-emerald-500"
                >
                  Download compressed image
                </a>
              </div>
            )}
          </section>

          <section className={`min-w-0 rounded-3xl border p-5 sm:p-7 ${panel}`}>
            <h2 className="text-lg font-bold">Preview</h2>

            <div
              className={`mt-5 flex min-h-64 items-center justify-center overflow-hidden rounded-2xl p-3 ${
                dark ? "bg-black/20" : "bg-slate-100"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Original selected image"
                  className="max-h-96 max-w-full object-contain"
                />
              ) : (
                <p className={muted}>Your original image will appear here.</p>
              )}
            </div>

            <h3 className="mt-6 font-semibold">Compressed preview</h3>

            <div
              className={`mt-3 flex min-h-64 items-center justify-center overflow-hidden rounded-2xl p-3 ${
                dark ? "bg-black/20" : "bg-slate-100"
              }`}
            >
              {outputUrl ? (
                <img
                  src={outputUrl}
                  alt="Compressed WebP image"
                  className="max-h-96 max-w-full object-contain"
                />
              ) : (
                <p className={muted}>Compress your image to see the result.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
