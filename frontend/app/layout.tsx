import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: {
    default: "Image Shrink — Free Online Image Compressor",
    template: "%s | Image Shrink",
  },
  description:
    "Compress JPG, PNG, and WebP images online. Adjust image quality, preview results, and download optimized WebP images for free.",
  applicationName: "Image Shrink",
  keywords: [
    "image compressor",
    "compress images online",
    "WebP converter",
    "free image compression",
  ],
  openGraph: {
    title: "Image Shrink — Free Online Image Compressor",
    description:
      "Reduce image file sizes with adjustable quality and instant previews.",
    siteName: "Image Shrink",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Image Shrink — Free Online Image Compressor",
    description:
      "Compress images online and download optimized WebP files for free.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
