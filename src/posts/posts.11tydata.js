// Applies to every file in src/posts/ so an article needs no boilerplate.
const warned = new Set();
module.exports = {
  layout: "post.njk",
  tags: "posts",
  // clean URL from the file name; a stray "learn-" prefix is dropped automatically
  permalink: (data) => `/learn/${String(data.page.fileSlug).replace(/^learn-/, "")}/`,
  eleventyComputed: {
    // never show a blank topic pill, even if an article is added without one
    topic: (data) => data.topic || "Strategy",
    // browser tab and Google get the brand suffix, the h1 does not
    // brand suffix only when it still fits what Google shows
    pageTitle: (data) => {
      const full = `${data.title} | DigitalFadi`;
      return full.length <= 60 ? full : data.title;
    },
    // reading time worked out from the article itself
    readingTime: (data) => {
      const raw = data.page && data.page.rawInput ? data.page.rawInput : "";
      const words = raw.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 200));
    },
    // build-log warnings so a weak article is caught on publish (visible in the Cloudflare build log)
    blogWarnings: (data) => {
      const w = [];
      const raw = (data.page && data.page.rawInput) || "";
      const title = String(data.title || "");
      const desc = String(data.description || "");
      if (!title) w.push("missing title");
      else if (title.length > 60) w.push(`title is ${title.length} characters (keep it to 60 or fewer)`);
      if (desc.length < 50 || desc.length > 160) w.push(`description is ${desc.length} characters (needs 50 to 160)`);
      if (!data.topic) w.push("no topic set (showing Strategy)");
      if (!/^##\s+Frequently asked questions/im.test(raw)) w.push("no '## Frequently asked questions' section, so no FAQ schema");
      if (/\u2014|&mdash;/.test(raw + title + desc)) w.push("contains an em dash");
      if (data.page && data.page.date && data.page.date.getTime() > Date.now() + 86400000) w.push("publish date is in the future");
      const msg = `[blog check] ${data.page.inputPath}: ${w.join("; ")}`;
      if (w.length && !warned.has(msg)) { warned.add(msg); console.warn(msg); }
      return w;
    }
  }
};
