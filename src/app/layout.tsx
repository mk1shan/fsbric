import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compreli — Garment repair for a circular fashion industry",
  description:
    "Compreli repairs 60+ types of garment defects so rejected garments ship at export quality instead of becoming waste.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,300..900&family=Figtree:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
