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
