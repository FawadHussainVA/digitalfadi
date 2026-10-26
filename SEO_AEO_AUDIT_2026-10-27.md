# DigitalFadi technical SEO + AEO audit
Audit date: 2026-10-27
Target: https://digitalfadi.com/
Hosting: Cloudflare Pages; contact forms: Hostinger Mail API.

## Scope and confidence
The code audit reviewed the Eleventy source templates, page front matter, post library, sitemap, robots, structured data, basic navigation links, social metadata, and form dependencies. A source-level internal-link scan covered 58 mapped local routes and 103 literal internal references with no unresolved links under the scanner's assumptions. This is **not** a full rendered browser crawl. The live website was inaccessible from the automated external fetch tool during this review, and the full Eleventy build was not executed because the package install could not complete in the audit environment. Search Console metrics, site indexing, mobile layout, server responses and Core Web Vitals require separate verification.

## Fixes committed
1. **XML sitemap:** only include canonical, indexable HTML page URLs, excluding admin, noindex, text feeds, robots.txt, llms.txt, and not-found pages. Keep article lastmod based on recorded content dates; remove changefreq and priority, which Google ignores.
2. **Crawler policy:** align admin and /api exclusions across general search engines and explicitly allowed answer-engine crawlers. Public site content remains crawlable.
3. **AEO and structured data:** introduce consistent JSON-LD WebSite + Organization identity in the shared page template (real site name, business links, homepage URL, logo). Keep existing Service, BlogPosting, BreadcrumbList, FAQPage and CollectionPage data, where present.
4. **Article SEO:** include article publication/modification time and author profile social metadata. Existing article JSON-LD has matching dates.
5. **Legacy form hygiene:** remove unused Web3Forms access-key fields from the home and service forms, and remove the obsolete Web3Forms key from site data. Working Cloudflare Pages to Hostinger Mail API implementation is not changed.
6. **Open Graph:** define sitewide English locale for social previews.

## Verified existing strengths in source
- Per-page titles and meta descriptions supplied by content front matter.
- Canonical tags and Open Graph / Twitter tags in shared template.
- Descriptive URLs and 301 rules for several retired page paths.
- Responsive viewport and theme, keyboard skip link and labelled form fields.
- Google Ads specialist subject-matter coverage: individual services, sector pages, articles, browser-based calculators.
- robots.txt plus llms.txt for answer engines.
- Existing service and article structured data, including author identity and breadcrumbs.

## Remaining production checks (not yet verified)
- Google Search Console: property verification, indexing pages vs excluded pages, sitemap submission and canonical inspection, and query/CTR baseline.
- Real URL crawl: HTTP 200/301/404 status, non-www to preferred-domain redirect, rendering after JavaScript, and sitemap/robots served correctly.
- Lighthouse / PageSpeed Insights: mobile LCP, CLS, INP, unused JavaScript, font delivery, layout shifts and accessibility.
- Analytics: Google Tag Manager and standalone Google Analytics scripts are both present; confirm that GA4 pageviews/events are **not counted twice**. Do not remove either without inspecting GTM configuration.
- Consent Mode: region-specific default is implemented; check actual consent signals using Tag Assistant for EEA/UK traffic and confirm the consent banner's behavior.
- Structured Data validation: test actual generated pages with Google's Rich Results Test and schema.org validator. FAQ rich-result eligibility is not guaranteed for commercial sites.
- Contact conversion tracking: both form types were user-tested for delivery, but GA4/Ads conversion tags still need measurement validation.
- Backlinks, brand citations, testimonials/case-study evidence, topical relevance, local presence, rankings and traffic require external data. No performance or ranking increase is guaranteed.

## Production follow-up
1. Confirm Cloudflare Pages deployment of the latest GitHub main commit is successful.
2. Open /robots.txt, /sitemap.xml and /llms.txt in a private browser window and validate their content.
3. Submit https://digitalfadi.com/sitemap.xml in Google Search Console.
4. Run Google PageSpeed Insights for home, one service page and one article on mobile.
5. Re-test one contact form after deployment (no configuration change expected).
