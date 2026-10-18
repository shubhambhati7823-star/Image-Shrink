export function getValidAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const payload = JSON.parse(atob(padded));

    if (
      typeof payload.exp === "number" &&
      payload.exp * 1000 <= Date.now()
    ) {
      localStorage.removeItem("accessToken");
      return null;
    }

    return token;
  } catch {
    return null;
  }
}