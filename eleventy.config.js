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

  eleventyConfig.addFilter("readable", (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("iso", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("rfc822", (d) => new Date(d).toUTCString());
  // FAQ schema for articles: reads the questions (h3) and first answer paragraph
  // under a "Frequently asked questions" heading, so schema always matches the page.
  eleventyConfig.addFilter("faqItems", (html) => {
    const text = (s) => String(s).replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
      .replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
    const parts = String(html || "").split(/<h2[^>]*>\s*Frequently asked questions\s*<\/h2>/i);
    if (parts.length < 2) return [];
    const section = parts[1].split(/<h2[\s>]/i)[0];
    return section.split(/<h3[^>]*>/i).slice(1).map((chunk) => {
      const [q, rest = ""] = chunk.split(/<\/h3>/i);
      const p = rest.match(/<p>([\s\S]*?)<\/p>/i);
      return { q: text(q), a: p ? text(p[1]) : "" };
    }).filter((f) => f.q && f.a);
  });
  // A sitemap must only contain canonical, indexable HTML pages.
  // Excludes feed.xml, llms.txt, robots.txt, 404 and noindex pages.
  eleventyConfig.addFilter("sitemapPages", (pages) => pages.filter((p) =>
    p.url && p.url.endsWith("/") && !/\bnoindex\b/i.test(String(p.data.robots || ""))));

  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0) || a.date - b.date));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
