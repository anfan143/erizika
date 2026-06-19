import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.erizika.sk"),
  title: {
    default: "e-rizika.sk — hodnotenie rizík BOZP za pár minút",
    template: "%s · e-rizika.sk",
  },
  description: "Hodnotenie rizík BOZP podľa zákona č. 124/2006 Z. z. za pár minút — nebezpečenstvá, opatrenia, OOPP aj zostatkové riziko, export do Wordu a PDF.",
  applicationName: "e-rizika.sk",
  keywords: ["hodnotenie rizík", "BOZP", "posúdenie rizík", "bezpečnosť práce", "124/2006", "OOPP", "bezpečnostný technik"],
  authors: [{ name: "HAVCO s. r. o." }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: "https://www.erizika.sk",
    siteName: "e-rizika.sk",
    title: "e-rizika.sk — hodnotenie rizík BOZP za pár minút",
    description: "Kompletný dokument o posúdení rizík k zadaným pracovným činnostiam — za pár minút, s exportom do Wordu a PDF.",
  },
  twitter: {
    card: "summary_large_image",
    title: "e-rizika.sk — hodnotenie rizík BOZP za pár minút",
    description: "Kompletný dokument o posúdení rizík k zadaným pracovným činnostiam — za pár minút.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;900&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
