// Before the build: take the pages and articles Portal has published and write them to src/generated/content-snapshot.json.
//   PORTAL_API       default https://portal.kryor.studio
//   PORTAL_SITE_ID   default this site's id (it is public: it is in every page's source)
//   PORTAL_CONTENT_FILE  use this file instead of the network
//   PORTAL_CONTENT=off   skip: the site builds without pages and articles
// A site that has never published anything has no snapshot yet (404): that is an empty site, not an error.
// On Cloudflare Pages (CF_PAGES=1) any other failure stops the build, so what was published last stays live.
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const API = process.env.PORTAL_API ?? "https://portal.kryor.studio";
const SITE = process.env.PORTAL_SITE_ID ?? "1406267e-eff3-4190-b9c7-1d2c119b414d";
const OUT = new URL("../src/generated/content-snapshot.json", import.meta.url);
mkdirSync(new URL("../src/generated/", import.meta.url), { recursive: true });

const empty = (why) => {
  console.warn(`[content] ${why}; building without pages and articles`);
  writeFileSync(OUT, JSON.stringify({ revision: 0, entries: {} }));
  process.exit(0);
};
const fail = (message) => {
  rmSync(OUT, { force: true });
  if (process.env.CF_PAGES === "1") {
    console.error(`[content] ${message}`);
    process.exit(1);
  }
  empty(message);
};

if (process.env.PORTAL_CONTENT === "off") empty("PORTAL_CONTENT=off");
if (process.env.PORTAL_CONTENT_FILE) {
  copyFileSync(process.env.PORTAL_CONTENT_FILE, OUT);
  console.log(`[content] snapshot from ${process.env.PORTAL_CONTENT_FILE}`);
  process.exit(0);
}

try {
  const res = await fetch(`${API}/build/v1/sites/${SITE}/content`, { signal: AbortSignal.timeout(20_000) });
  if (res.status === 404) empty("nothing published yet");
  if (!res.ok) fail(`Portal answered HTTP ${res.status}`);
  const body = await res.json();
  if (!body?.entries || typeof body.entries !== "object") fail("the snapshot has no entries");
  writeFileSync(OUT, JSON.stringify(body));
  console.log(`[content] revision ${body.revision} (${Object.keys(body.entries).length} entries)`);
} catch (e) {
  fail(`could not fetch the snapshot: ${e instanceof Error ? e.message : e}`);
}
