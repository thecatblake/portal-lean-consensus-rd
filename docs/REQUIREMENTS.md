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
- Purpose: track the progress of Lean Consensus R&D for working researchers. Base: leanroadmap.org, whose own stamp reads "Last updated: May 2026" (checked 2026-11-18). This replaces the earlier "public research log" purpose; see the conflicts listed in section 2.

- Primary audience: consensus client implementers and protocol researchers. Research posts assume deep prior knowledge and can skip the basics.
- Secondary audience: the broader Ethereum community. Some content will be written for them (for example explainers), and should be marked as such so readers know the level.

- Top page: six sections, in this order. This supersedes the earlier "title, description, latest articles" top page.
  1. **What changed.** A dated feed, newest first. Each entry is one line with a link: spec PRs, posts, devnet events, benchmark changes, talks. (The one-line layout decided earlier, date, type, title, link, fits this feed.)
  2. **Benchmarks.**
     - leanXMSS: public key size, signature size, keygen time, signing time and verification time, each against its target.
     - leanMultisig: XMSS aggregated per second and aggregate size, each against its target.
     - Each number shows its hardware, branch and measurement date, and links to its source run (leanBench or the repo README).
     - Numbers are rendered in the HTML itself, not loaded by JavaScript.
     - Optional: a small trend chart over time.
  3. **Specifications.** One card each for leanSpec, leanXMSS, leanMultisig and leanMetrics. Each card shows the latest version or commit, the date it last changed, and links to the repo and changelog.
  4. **Implementations.** One row per Lean Consensus client currently running: Lantern, Lighthouse, ethlambda, gean, Verity. Columns: language, team, latest devnet passed, spec version targeted, last release or commit date, repo link. Optional: a table of which features each client supports (leanXMSS, leanMultisig, aggregator role, and so on).
  5. **Devnets.** The current devnet on top: goals, status, participating clients. Below it a compact timeline of past devnets (pq-devnet-0 onward) with links to specs and retrospectives.
  6. **Tooling and community.** Tooling: Hive, leanBench, PQ Observatory. Calls: the PQ Interop breakout meetings and Lean Calls, with recordings and agendas. Community: the Eth R&D Discord (#post-quantum).
- About page: what Lean Consensus is, plus the Key Ideas (Lean Consensus, Lean Cryptography, Lean Governance, Lean Craft). Who maintains the site and how to send corrections.

- Design system: minimal and lean, with as little redundancy as possible in colors and spacing while keeping the UX intact.
  - Colors: white and black only. Muted text, lines and tints are mixes of the two. Dark mode swaps the two.
  - One accent token (`--accent`) for links, the brand mark and the active nav item. It is still black; the highlight color is chosen later by changing that one value.
  - Spacing: four steps (0.5, 1, 2, 4 rem). No values outside the scale.
  - No radius, shadows or filled boxes. Structure comes from spacing and thin lines.
  - Tokens live in `src/styles/global.css`.

## 2. Open

### Conflicts with earlier decisions (the new top page spec changes the site from a log to a tracker)
- [ ] Is the blog still part of the site? Earlier decisions assume articles: Research and Explainer types, guest authors, bylines, Sources page, publish-when-there-is-a-finding. "What changed" already lists posts, so the blog may stay as the source of those posts, or go.
- [ ] The Sources page overlaps with section 6 (Tooling and community). Keep it, merge it into the top page, or drop it.
- [ ] The audience line says implementers and researchers first, with some content for the broader community. "Working researchers" is narrower. Confirm.

### Data (new, and the main technical question)
- [ ] Where each section's data comes from, and who keeps it current: GitHub (commits, releases, PRs), leanBench runs, repo READMEs, call recordings, devnet notes. Portal pages hold text, not structured data like this.
- [ ] How often the site rebuilds. The numbers are in the HTML, so a rebuild is the only way they refresh.
- [ ] Targets for each benchmark: where the "target" values come from.
- [ ] Missing data: what a card or row shows when a value is unknown. The rule that numbers are measured, never estimated, means it must say so and not show a zero.

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

### Design
- [ ] Highlight (accent) color.
- [x] Theme: light and dark, with an icon toggle in the header (moon in light mode, sun in dark mode: the icon shows the theme a click switches to). With nothing saved it follows the system setting. A click saves the reader's choice in the browser (`localStorage`, key `theme`).

### Operations
- [ ] Editing flow: deferred. The owner writes the first articles directly, so the flow is decided later. Guest submission is already decided (guests hand articles to the owner, who publishes).

## 3. Notes

- An older scaffold with the same name exists at `research/portal-lean-consensus-rd` (minimal Astro, 2025-11-08). The current site descends from it. Consider merging or deleting it.
- The current Japanese-language commit messages and any Japanese text in Portal pages should be reviewed against the English-only decision.
