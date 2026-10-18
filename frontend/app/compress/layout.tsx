
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Images Online",
  description:
    "Upload JPG, PNG, or WebP images, adjust compression quality, preview the result, and download your optimized image.",
};

export default function CompressLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
