import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/blog";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return {};
  const url = `https://www.erizika.sk/blog/${a.slug}`;
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `/blog/${a.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title: a.title,
      description: a.description,
      publishedTime: a.date,
      modifiedTime: a.updated || a.date,
    },
  };
}

export default function ClanokPage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();

  const url = `https://www.erizika.sk/blog/${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: a.title,
        description: a.description,
        inLanguage: "sk-SK",
        datePublished: a.date,
        dateModified: a.updated || a.date,
        author: { "@type": "Organization", name: "e-rizika.sk" },
        publisher: {
          "@type": "Organization",
          name: "e-rizika.sk",
          logo: { "@type": "ImageObject", url: "https://www.erizika.sk/icon.svg" },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Domov", item: "https://www.erizika.sk/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.erizika.sk/blog" },
          { "@type": "ListItem", position: 3, name: a.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="hazard" />
      <header>
        <div className="head-inner">
          <a href="/" className="logo-mark" style={{ textDecoration: "none" }} title="Domov">HR</a>
          <div>
            <h1>e-rizika.sk</h1>
            <div className="head-sub">Blog</div>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 760 }}>
        <article className="card clanok">
          <p className="clanok-breadcrumb">
            <a href="/blog">Blog</a> / {a.title}
          </p>
          <h1 className="clanok-title">{a.title}</h1>
          <p className="clanok-meta">
            {new Date(a.date).toLocaleDateString("sk-SK")} · {a.readMins} min čítania
          </p>
          <div dangerouslySetInnerHTML={{ __html: a.body }} />
          <hr className="clanok-hr" />
          <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            <a href="/blog">← Všetky články</a>
          </p>
        </article>
      </main>
    </>
  );
}
