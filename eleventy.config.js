const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.ignores.add("src/admin/**");
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/og-image.png": "og-image.png" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/icon-512.png": "icon-512.png" });
  eleventyConfig.addPassthroughCopy({ "src/icon-96.png": "icon-96.png" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // FAQPage schema, built from the FAQ that is visible on each page, so schema and page always match.
  // Sources: <details> inside any element marked data-faq (home, service, tool and about pages), or the
  // "Frequently asked questions" h2 with h3 questions inside an article.
  const faqText = (s) => String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&ndash;/g, "\u2013").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\s+/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
  eleventyConfig.addTransform("faqSchema", function (html) {
    const out = this.page && this.page.outputPath;
    if (!out || !String(out).endsWith(".html") || html.includes('"FAQPage"')) return html;
    const items = [];
    const marker = /<(section|div)\b[^>]*\bdata-faq\b[^>]*>/gi;
    let m;
    while ((m = marker.exec(html))) {
      const end = html.indexOf("</section>", m.index);
      const region = html.slice(m.index, end === -1 ? undefined : end);
      const det = /<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
      let d;
      while ((d = det.exec(region))) {
        const q = faqText(d[1]), a = faqText(d[2]);
        if (q && a) items.push({ q, a });
      }
    }
    if (!items.length) {
      const art = (html.match(/<article\b[\s\S]*?<\/article>/i) || [""])[0];
      const parts = art.split(/<h2[^>]*>\s*Frequently asked questions\s*<\/h2>/i);
      if (parts.length > 1) {
        const section = parts[1].split(/<h2[\s>]/i)[0];
        section.split(/<h3[^>]*>/i).slice(1).forEach((chunk) => {
          const [q, rest = ""] = chunk.split(/<\/h3>/i);
          const p = rest.match(/<p>([\s\S]*?)<\/p>/i);
          if (q && p) items.push({ q: faqText(q), a: faqText(p[1]) });
        });
      }
    }
    if (!items.length) return html;
    const json = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    }).replace(/</g, "\\u003c");
    return html.replace("</head>", `<script type="application/ld+json">${json}</script>\n</head>`);
  });
  eleventyConfig.addFilter("assetUrl", (name) => {
    const path = `/assets/${name}`;
    const revision = createHash("sha256").update(readFileSync(`src${path}`)).digest("hex").slice(0, 12);
    return `${path}?v=${revision}`;
  });

  eleventyConfig.addFilter("readable", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  // the industry category a page sits under, for breadcrumbs (null for the category page itself)
  eleventyConfig.addFilter("categoryFor", (categories, group, url) =>
    (categories || []).find((c) => c.key === group && c.url !== url) || null);
  eleventyConfig.addFilter("iso", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("rfc822", (d) => new Date(d).toUTCString());
  // A sitemap must only contain canonical, indexable HTML pages.
  // Excludes feed.xml, llms.txt, robots.txt, 404 and noindex pages.
  eleventyConfig.addFilter("sitemapPages", (pages) => pages.filter((p) =>
    p.url && p.url.endsWith("/") && !/\bnoindex\b/i.test(String(p.data.robots || ""))));

  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
      // sorted by publish date (oldest to newest; templates reverse it), then by order on the same day
      .sort((a, b) => a.date - b.date || (a.data.order || 0) - (b.data.order || 0)));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
