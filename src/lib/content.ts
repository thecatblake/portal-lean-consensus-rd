// Pages (`page.<slug>`, schema.org WebPage) and articles (`article.<slug>`, BlogPosting) a customer published in Portal.
// The snapshot is fetched before the build (scripts/fetch-content.mjs). Entries marked creativeWorkStatus = Draft are never built.
import { marked } from "marked";

interface Entry {
  value: Record<string, unknown>;
}
interface Snapshot {
  revision: number;
  entries: Record<string, Entry>;
}

const files = Object.values(import.meta.glob<Snapshot>("../generated/content-snapshot.json", { eager: true, import: "default" }));
const snapshot: Snapshot = files[0] ?? { revision: 0, entries: {} };

type Ld = { "@language": string; "@value": string }[];
const isLd = (v: unknown): v is Ld => Array.isArray(v) && v.length > 0 && v.every((x) => x && typeof x === "object" && "@value" in x);

/** A stored text is a plain string or a list of language-tagged strings: take Japanese, else whatever there is. */
function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (isLd(v)) return (v.find((x) => x["@language"] === "ja") ?? v[0]!)["@value"];
  return "";
}

// Raw HTML is refused when the content is saved; escape it here too, so a body can never inject markup.
marked.use({ renderer: { html: ({ text }) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") } });
const render = (md: string) => marked.parse(md, { async: false }) as string;

export interface Item {
  kind: "page" | "article";
  slug: string;
  title: string;
  description: string;
  html: string;
  datePublished?: string;
  dateModified?: string;
  keywords: string[];
  path: string;
}

function items(kind: "page" | "article"): Item[] {
  const out: Item[] = [];
  for (const [key, { value: v }] of Object.entries(snapshot.entries)) {
    if (!key.startsWith(`${kind}.`) || str(v.creativeWorkStatus) === "Draft") continue;
    const slug = key.slice(kind.length + 1);
    const article = kind === "article";
    out.push({
      kind,
      slug,
      title: str(article ? v.headline : v.name),
      description: str(v.description),
      html: render(str(article ? v.articleBody : v.text)),
      datePublished: article ? str(v.datePublished) || undefined : undefined,
      dateModified: article ? str(v.dateModified) || undefined : undefined,
      keywords: Array.isArray(v.keywords) ? v.keywords.map(str).filter(Boolean) : [],
      path: article ? `/blog/${slug}/` : `/${slug}/`,
    });
  }
  return out;
}

export const pages = (): Item[] => items("page").sort((a, b) => a.slug.localeCompare(b.slug));
export const articles = (): Item[] => items("article").sort((a, b) => (b.datePublished ?? "").localeCompare(a.datePublished ?? ""));
