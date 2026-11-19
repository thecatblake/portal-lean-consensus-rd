// Everything the top page tracks, in one place.
// Rules:
//  - A value that has not been measured or confirmed is `null`. The page shows "—", never a zero or a guess.
//  - Every number carries where it was measured (hardware, branch, date) and a link to its source run.
//  - Dates are `YYYY-MM-DD`.

export type Link = { label: string; url: string };

/** "What changed": hand-kept events. Posts published in Portal are added to the feed automatically. */
export interface FeedEvent {
  date: string;
  type: "Spec PR" | "Devnet" | "Benchmark" | "Talk" | "Post";
  title: string;
  url: string;
}
export const events: FeedEvent[] = [];

export interface Spec {
  name: string;
  version: string | null; // latest version or commit
  changedOn: string | null; // date it last changed
  repo: string | null;
  changelog: string | null;
}
export const specs: Spec[] = [
  { name: "leanSpec", version: null, changedOn: null, repo: null, changelog: null },
  { name: "leanXMSS", version: null, changedOn: null, repo: null, changelog: null },
  { name: "leanMultisig", version: null, changedOn: null, repo: null, changelog: null },
  { name: "leanMetrics", version: null, changedOn: null, repo: null, changelog: null },
];

export interface Measurement {
  value: string | null; // with its unit, for example "12 ms"
  target: string | null;
  hardware: string | null;
  branch: string | null;
  measuredOn: string | null;
  source: string | null; // link to the leanBench run or the repo README
  sourceLabel?: string; // link text for `source`
}
export interface BenchmarkGroup {
  name: string;
  metrics: { metric: string; m: Measurement }[];
  /** How it was measured: the command, the spread between passes, anything a reader needs to judge the number. */
  note?: string;
}
const none: Measurement = { value: null, target: null, hardware: null, branch: null, measuredOn: null, source: null };

// Local run of leanVM, 2026-11-18: `cargo leanvm aggregate --xmss 1400 --log-inv-rate 2 --repeat 3`.
const localRun = {
  target: null,
  hardware: "Apple M4, 10 cores, 16 GB",
  branch: "leanVM main @ f7ba4999a",
  measuredOn: "2026-11-18",
  source: "https://github.com/leanEthereum/leanVM/tree/f7ba4999ae523b94c8d0969b32762c3effea4cbd",
  sourceLabel: "leanVM f7ba4999a",
} satisfies Omit<Measurement, "value">;

// Local run of the lean_xmss crate, 2026-11-18, same machine and commit: medians of 5 key generations, 5 bottom-tree builds,
// 200 signatures and 2,000 verifications, single call each. Sizes are the crate's constants (PUB_KEY_SIZE, SIG_SIZE).
const xmssRun = {
  ...localRun,
  source: "https://github.com/leanEthereum/leanVM/tree/f7ba4999ae523b94c8d0969b32762c3effea4cbd/crates/lean_xmss",
  sourceLabel: "lean_xmss f7ba4999a",
} satisfies Omit<Measurement, "value">;
const noEnv = { hardware: null, branch: null, measuredOn: null } satisfies Partial<Measurement>;
export const benchmarks: BenchmarkGroup[] = [
  {
    name: "leanXMSS",
    metrics: [
      // Fixed by the scheme's parameters, not by the machine: no hardware, branch or date.
      { metric: "Public key size", m: { ...xmssRun, ...noEnv, value: "32 bytes" } },
      { metric: "Signature size", m: { ...xmssRun, ...noEnv, value: "2,404 bytes" } },
      { metric: "Keygen time", m: { ...xmssRun, value: "2.18 s" } },
      { metric: "Signing time, tree already built", m: { ...xmssRun, value: "54.7 ms (range 0.12 to 341 ms)" } },
      { metric: "Signing time, first signature in a tree", m: { ...xmssRun, value: "2.23 s" } },
      { metric: "Verification time", m: { ...xmssRun, value: "29 µs" } },
    ],
  },
  {
    name: "leanMultisig",
    metrics: [
      { metric: "XMSS aggregated per second", m: { ...localRun, value: "644 signatures/s" } },
      { metric: "Aggregate size", m: { ...localRun, value: "208.8 KiB" } },
    ],
  },
];

export interface Client {
  name: string;
  language: string | null;
  team: string | null;
  devnetPassed: string | null;
  specVersion: string | null;
  lastActivity: string | null; // date of the last commit on the default branch, or of the last release
  repo: string | null;
  /** Other places the client is reached: site, X, Telegram. */
  accounts: Link[];
}
// Checked on 2026-11-19 against the GitHub API and each client's own site. `null` means not found or not confirmed.
export const clients: Client[] = [
  {
    name: "Lantern",
    language: "C",
    team: "Bitmine",
    devnetPassed: null,
    specVersion: "leanSpec 8b4ebbe", // the tools/leanSpec submodule commit
    lastActivity: "2026-07-25",
    repo: "https://github.com/bitminetech/lantern-lean",
    accounts: [],
  },
  {
    name: "Lighthouse",
    language: "Rust",
    team: "Fork of Sigma Prime's Lighthouse, by hopinheimer",
    devnetPassed: null,
    specVersion: null,
    lastActivity: "2026-01-08", // newest commit of its lean-* branches (lean-ethereum)
    repo: "https://github.com/hopinheimer/lighthouse",
    accounts: [{ label: "Sigma Prime on X", url: "https://x.com/sigp_io" }],
  },
  {
    name: "ethlambda",
    language: "Rust",
    team: "LambdaClass",
    devnetPassed: null,
    specVersion: null,
    lastActivity: "2026-11-18",
    repo: "https://github.com/lambdaclass/ethlambda",
    accounts: [
      { label: "Site", url: "https://ethlambda.xyz/" },
      { label: "X", url: "https://x.com/ethlambda_lean" },
      { label: "Telegram", url: "https://t.me/ethlambda" },
    ],
  },
  {
    name: "gean",
    language: "Go",
    team: "Gean Labs",
    devnetPassed: null,
    specVersion: "leanSpec eca701e", // pinned in its README
    lastActivity: "2026-11-04",
    repo: "https://github.com/geanlabs/gean",
    accounts: [
      { label: "Site", url: "https://geanlabs.com/" },
      { label: "X", url: "https://x.com/geanclient" },
    ],
  },
  {
    name: "Verity",
    language: "Rust",
    team: "Nyx Foundation",
    devnetPassed: null,
    specVersion: null,
    lastActivity: "2026-10-29",
    repo: "https://github.com/NyxFoundation/verity",
    accounts: [
      { label: "Site", url: "https://verityclient.com/" },
      { label: "X", url: "https://x.com/verityclient" },
    ],
  },
];

export interface Devnet {
  name: string;
  goals: string | null;
  status: string | null;
  clients: string[];
  spec: string | null;
  retrospective: string | null;
}
/** The current devnet, if one is running. */
export const currentDevnet: Devnet | null = null;
/** Past devnets, pq-devnet-0 onward. */
export const pastDevnets: Devnet[] = [];

export const tooling: { name: string; url: string | null }[] = [
  { name: "Hive", url: null },
  { name: "leanBench", url: null },
  { name: "PQ Observatory", url: null },
];
export const calls: { name: string; agenda: string | null; recordings: string | null }[] = [
  { name: "PQ Interop breakout meetings", agenda: null, recordings: null },
  { name: "Lean Calls", agenda: null, recordings: null },
];
export const community: { name: string; url: string | null }[] = [{ name: "Eth R&D Discord, #post-quantum", url: null }];
