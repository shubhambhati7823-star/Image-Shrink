"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle, {
  type Theme,
} from "../components/ThemeToggle";
import GoogleSignInButton from "../components/GoogleSignInButton";


type LoginResponse = {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokens?: {
      accessToken?: string;
      refreshToken?: string;
    };
  };
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const dark = theme === "dark";
  const panel = dark
    ? "border-white/10 bg-white/[0.05]"
    : "border-slate-200 bg-white shadow-xl";
  const muted = dark ? "text-slate-400" : "text-slate-600";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = (await response.json()) as LoginResponse;

      if (!response.ok) {
        throw new Error(body.message || "Login failed. Check your details.");
      }

      const accessToken =
        body.accessToken ??
        body.data?.accessToken ??
        body.tokens?.accessToken ??
        body.data?.tokens?.accessToken;

      const refreshToken =
        body.refreshToken ??
        body.data?.refreshToken ??
        body.tokens?.refreshToken ??
        body.data?.tokens?.refreshToken;

      if (!accessToken) {
        throw new Error(
          "Login response mein accessToken nahi mila. Check your backend response format."
        );
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      const params = new URLSearchParams(window.location.search);
      const requestedPath = params.get("next") || "/compress";
      const safePath = requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
        ? requestedPath
        : "/compress";

      router.replace(safePath);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the login service."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      className={`flex min-h-screen items-center justify-center px-5 py-10 ${
        dark ? "bg-[#080b14] text-white" : "bg-[#f5f6fb] text-slate-950"
      }`}
    >
      <div className="fixed right-5 top-5">
        <ThemeToggle
          theme={theme}
          onToggle={() =>
            setTheme((current) =>
              current === "dark" ? "light" : "dark"
            )
          }
        />
      </div>

      <section className={`w-full max-w-md rounded-3xl border p-6 sm:p-9 ${panel}`}>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-xl font-black"
        >
          Image <span className="text-violet-500">Shrink</span>
        </button>

        <h1 className="mt-8 text-3xl font-black">Welcome back</h1>
        <p className={`mt-2 text-sm leading-6 ${muted}`}>
          Log in to start compressing your images.
        </p>

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500 ${
                dark
                  ? "border-white/10 bg-black/20 text-white"
                  : "border-slate-300 bg-white text-slate-950"
              }`}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-violet-500 ${
                dark
                  ? "border-white/10 bg-black/20 text-white"
                  : "border-slate-300 bg-white text-slate-950"
              }`}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-violet-700 px-5 py-3.5 font-bold text-white transition hover:bg-violet-600 disabled:opacity-50"
          >
            {busy ? "Logging in…" : "Login and continue"}
          </button>
        </form>

        <p className={`mt-5 text-xs leading-5 ${muted}`}>
          Use the account you registered with your AuthPro backend.
        </p>
        <div className="mt-6">
  <GoogleSignInButton />
</div>
      </section>
      
    </main>
  );
}