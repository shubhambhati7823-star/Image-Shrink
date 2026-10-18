
"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>
          ) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!scriptReady || !buttonRef.current || !window.google) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google Client ID is missing.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          setError("");

          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

          const result = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          });

          const data = await result.json();

          if (!result.ok || !data.success || !data.data?.accessToken) {
            throw new Error(data.message || "Google login failed.");
          }

          localStorage.setItem("accessToken", data.data.accessToken);

          router.replace("/compress");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Google login failed."
          );
        }
      },
    });

    buttonRef.current.innerHTML = "";
buttonRef.current.style.display = "flex";
buttonRef.current.style.justifyContent = "center";
buttonRef.current.style.width = "100%";

window.google.accounts.id.renderButton(buttonRef.current, {
  theme: "outline",
  size: "large",
  text: "continue_with",
  shape: "rectangular",
  width: 320,
});
  }, [scriptReady, router]);

 
return (
  <div className="mt-5 w-full">
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptReady(true)}
      onError={() => setError("Google Sign-In script could not load.")}
    />

    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Or continue with
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>

    <div className="flex w-full justify-center">
      <div
        ref={buttonRef}
        className="google-signin-button flex min-h-11 w-full justify-center"
      />
    </div>

    {error && (
      <p
        role="alert"
        className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
      >
        {error}
      </p>
    )}

    <p className="mt-4 text-center text-xs leading-5 text-gray-500">
      Sign in securely with your Google account.
    </p>

    <style jsx global>{`

      .google-signin-button iframe {
        max-width: 100% !important;
      }
    `}</style>
  </div>
);

}
