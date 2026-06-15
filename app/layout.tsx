import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rizika — generátor hodnotenia rizík BOZP",
  description: "Hodnotenie rizík podľa zákona č. 124/2006 Z. z. za pár minút. Postavené na knižnici overených rizík z praxe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
