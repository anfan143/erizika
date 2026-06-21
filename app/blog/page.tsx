import type { Metadata } from "next";
import { ARTICLES } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — návody a tipy k BOZP a hodnoteniu rizík",
  description:
    "Praktické návody k bezpečnosti a ochrane zdravia pri práci: ako vypracovať hodnotenie rizík, čo musí obsahovať dokumentácia BOZP a ďalšie tipy.",
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.erizika.sk/blog",
    title: "Blog — návody a tipy k BOZP a hodnoteniu rizík",
    description: "Praktické návody k BOZP a hodnoteniu rizík od e-rizika.sk.",
  },
};

export default function BlogIndex() {
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <div className="hazard" />
      <header>
        <div className="head-inner">
          <a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a>
          <div>
            <h1>e-rizika.sk</h1>
            <div className="head-sub">Blog — návody a tipy k BOZP</div>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 820 }}>
        <div className="card">
          <div className="section-label">Návody a tipy</div>
          <h2 style={{ marginTop: 0 }}>Blog</h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
            Praktické články k bezpečnosti a ochrane zdravia pri práci a k tvorbe hodnotenia rizík.
          </p>
          <div className="blog-list">
            {sorted.map((a) => (
              <a key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <div className="blog-card-foot">
                  <span className="blog-meta">{new Date(a.date).toLocaleDateString("sk-SK")} · {a.readMins} min</span>
                  <span className="blog-read">Čítať →</span>
                </div>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 24 }}>
            <a href="/">← Späť na úvod</a>
          </p>
        </div>
      </main>
    </>
  );
}
