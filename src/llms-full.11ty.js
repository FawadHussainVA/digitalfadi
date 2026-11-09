// /llms-full.txt: the full text of every article and industry page, for AI tools that read
// the whole site in one request. Built from the same content as the pages, so it never drifts.
const DECODE = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&nbsp;": " ", "&rsquo;": "\u2019", "&lsquo;": "\u2018", "&ldquo;": "\u201C", "&rdquo;": "\u201D", "&ndash;": "\u2013", "&middot;": "\u00B7", "&rarr;": "\u2192", "&times;": "\u00D7", "&check;": "\u2713", "&minus;": "\u2212" };
function toText(html) {
  let s = String(html || "");
  s = s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (m, n, t) => "\n\n" + "#".repeat(Number(n)) + " " + t.replace(/<[^>]+>/g, "").trim() + "\n\n");
  s = s.replace(/<li[^>]*>/gi, "\n- ").replace(/<\/p>|<\/div>|<\/section>|<\/tr>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/&[a-z#0-9]+;/gi, (e) => DECODE[e.toLowerCase()] || DECODE[e] || e);
  return s.replace(/[ \t]+/g, " ").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
module.exports = {
  data: { permalink: "/llms-full.txt", eleventyExcludeFromCollections: true },
  render(data) {
    const site = (data.site && data.site.url) || "https://digitalfadi.com";
    const posts = (data.collections.posts || []).slice().sort((a, b) => (b.date - a.date));
    const industries = data.collections.industries || [];
    const out = [];
    out.push("# DigitalFadi: full text", "");
    out.push("> DigitalFadi is the freelance Google Ads practice of Fawad Hussain, a Google Ads freelancer and Google Premier Partner. This file holds the full text of every article and industry page on " + site + ", newest first. The short index is at " + site + "/llms.txt.", "");
    out.push("## Articles", "");
    for (const p of posts) {
      out.push("---", "", "## " + p.data.title, "", "URL: " + site + p.url, "Topic: " + (p.data.topic || "General"), "Summary: " + p.data.description, "", toText(p.templateContent), "");
    }
    out.push("## Industry pages", "");
    for (const t of industries) {
      out.push("---", "", "## " + (t.data.heading || t.data.title), "", "URL: " + site + t.url, "Summary: " + t.data.description, "", toText(t.templateContent), "");
    }
    return out.join("\n");
  }
};
