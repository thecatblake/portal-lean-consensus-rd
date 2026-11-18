# Lean Consensus R&D Site: Requirements (Draft)

Target: `clients/lean-consensus-rd-astro` (package name `portal-lean-consensus-rd`)
Status: Draft. "Decided" items are decisions or facts confirmed from the code. "Open" items still need a decision.

## 1. Decided

- Subject: research and development notes on Lean Consensus, the next-generation Ethereum consensus layer.
- Language: English only. All site content, page slugs, article slugs, file names and documentation are in English.
- Stack: Astro static site on Cloudflare Pages (`wrangler.toml`).
- Content: pages (`page.<slug>`) and articles (`article.<slug>`) published in Portal (portal.kryor.studio) are fetched as a snapshot before the build.
  - Entries with `creativeWorkStatus = Draft` are never built.
  - On Cloudflare Pages, a failed snapshot fetch stops the build, so the last published version stays live.
  - A site with nothing published is treated as an empty site, not an error.
- URLs: pages at `/<slug>/`, articles at `/blog/<slug>/`.
- Navigation and the home page are generated from the pages published in Portal.
- Body text is Markdown. Raw HTML is rejected.
- Analytics: Portal tracking script (GA4).
- Purpose: a public research log. Research notes and findings on Lean Consensus are published as they happen, for anyone interested.

- Primary audience: consensus client implementers and protocol researchers. Research posts assume deep prior knowledge and can skip the basics.
- Secondary audience: the broader Ethereum community. Some content will be written for them (for example explainers), and should be marked as such so readers know the level.

- Top page: the site title and a one-line description of the log, then the latest articles first. Each entry shows its type (Research or Explainer), date and author. Links to About and Sources live in the header navigation, not as cards on the top page.

## 2. Open

### Purpose
- [x] Success measure: readership from the target audience, using measured readers and returning visitors from GA4 through the Portal tracking script. Only measured numbers are reported, never estimates.
- [ ] Whether any target value is set (for example monthly readers), or the numbers are only tracked.

### Audience
- [x] Level labeling: two article types, "Research" (expert) and "Explainer" (broader community). Each article carries exactly one type as a Portal keyword. The type is shown on the post and filterable on the blog index. Exact keyword values and the filter UI still need to be specified.

### Content policy
- [x] Article types: only Research and Explainer. Spec walkthroughs and experiment results are Research. No periodic summaries.
- [x] Fixed pages: About, and a "Sources" page (proposed slug `sources`) listing the information sources this research follows: websites, GitHub repositories, X accounts and research forums. Everything else is an article.
- [x] Sources page: entries are grouped by topic (for example fork choice, networking, signatures). Source types (website, GitHub, X, research forum) are mixed inside each topic section.
- [ ] Sources page: the topic list itself, what each entry shows (name, link, source type, one-line reason it matters), and whether the topics match the article topics.
- [x] Publishing cadence: no fixed schedule. A post goes out when a finding or note is ready.
- [x] Authorship: the owner plus guest authors.
- [x] Guest author workflow: guests hand their article to the owner (for example Markdown by pull request or message). The owner reviews and publishes through Portal. Guests get no Portal access, and the owner is the only approver.
- [x] Bylines: every article shows its author name under the title, for the owner and guests alike. The name is stored in the article's Portal author field. About lists the owner and any guest authors.
- [x] Author field: decided option (a). Implemented in Portal (optional `author` text on `article.*`, API, editor field) and read by the site (`Item.author`). Not yet deployed or shown in the article template. The original finding was: Portal's `article.*` entity (`kportal-cloud/packages/domain/src/pages.ts`) allows only headline, description, articleBody, datePublished, dateModified, keywords and creativeWorkStatus. There is no author field, so bylines cannot be stored today. Options: (a) add an `author` field (schema.org `BlogPosting.author`) to Portal, then read it in `src/lib/content.ts`; (b) carry the author as a reserved keyword such as `author:<name>` with no Portal change. Decision pending.
- Level label fits the existing model: `keywords` is the only tag mechanism, so Research and Explainer can be reserved keywords with no Portal change.
- [x] Sourcing rules: every factual claim about a spec, PR, commit or paper links to the exact primary source (spec version or commit, PR number, paper). Own opinions and speculation are labeled as such. Numbers must be measured, never estimated.
- [ ] Whether the build should enforce any of this (for example warn when an article has no outbound links), or it stays an editorial rule.

### Operations
- [ ] Editing flow: deferred. The owner writes the first articles directly, so the flow is decided later. Guest submission is already decided (guests hand articles to the owner, who publishes).

## 3. Notes

- An older scaffold with the same name exists at `research/portal-lean-consensus-rd` (minimal Astro, 2025-11-08). The current site descends from it. Consider merging or deleting it.
- The current Japanese-language commit messages and any Japanese text in Portal pages should be reviewed against the English-only decision.
