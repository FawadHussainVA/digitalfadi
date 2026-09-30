// Applies to every file in src/posts/ so an article needs no boilerplate.
module.exports = {
  layout: "post.njk",
  tags: "posts",
  permalink: "/learn/{{ page.fileSlug }}/",
  eleventyComputed: {
    // browser tab and Google get the brand suffix, the h1 does not
    pageTitle: (data) => `${data.title} | digitalfadi`,
    // reading time worked out from the article itself
    readingTime: (data) => {
      const raw = data.page && data.page.rawInput ? data.page.rawInput : "";
      const words = raw.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.round(words / 200));
    }
  }
};
