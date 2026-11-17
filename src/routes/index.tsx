import { createFileRoute } from "@tanstack/react-router";
import { CODES } from "@/lib/codes";
import { Studio } from "@/components/Studio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ryan Upscales — Preservation-first restoration" },
      { name: "description", content: "Restore images, anime frames and archival photos without changing what they depict. Pick a code, drop your files, hand it to your agent." },
      { property: "og:title", content: "Ryan Upscales — Preservation-first restoration" },
      { property: "og:description", content: "Restore images, anime frames and archival photos without changing what they depict." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const GROUPS = ["Core", "Pipeline", "Repair", "Subject"] as const;

const PRINCIPLES = [
  ["The source is the authority.", "Not a loose reference. Never redrawn from memory, never reinterpreted."],
  ["Same image at thumbnail size.", "Side by side, it must read as the original. Only zoom reveals the work."],
  ["Nothing invented.", "No new objects, altered faces, moved horizons or changed text. Ever."],
  ["Style is sacred.", "Anime stays anime. Photographs stay photographic. Linework keeps its hand."],
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#" className="flex items-baseline gap-2">
            <span className="font-display text-xl">Ryan Upscales</span>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">v4</span>
          </a>
          <nav className="flex items-center gap-6 font-mono text-xs text-muted-foreground">
            <a href="#codes" className="hover:text-foreground">Codes</a>
            <a href="#principles" className="hidden hover:text-foreground sm:inline">Principles</a>
            <a href="#studio" className="text-primary hover:opacity-80">Studio →</a>
          </nav>
        </div>
      </header>

      <section className="grain relative overflow-hidden border-b border-border">
        <div className="grid-paper absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 md:px-8 md:pb-32 md:pt-32">
          <p className="eyebrow animate-rise mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Restoration studio · 19 codes
          </p>
          <h1 className="animate-rise max-w-5xl font-display text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] tracking-tight [animation-delay:80ms]">
            Recover the detail.<br />
            <span className="italic text-muted-foreground">Keep the picture.</span>
          </h1>
          <div className="animate-rise mt-12 grid max-w-5xl gap-10 [animation-delay:160ms] md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Preservation-first enhancement for photographs, manga and cel animation. Pick a code, drop your files, and hand a precise brief to your agent.
            </p>
            <a href="#studio" className="inline-flex items-center gap-3 self-start border border-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background">
              Open studio <span aria-hidden>→</span>
            </a>
          </div>
        </div>
        <div className="relative border-t border-border">
          <dl className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            {[["Aspect ratio", "Locked"], ["Identity", "Locked"], ["Tile grids", "3×3 · 4×4"], ["Temporal", "Shot-aware"]].map(([k, v], i) => (
              <div key={k} className={`px-5 py-6 md:px-8 ${i % 2 ? "" : "border-r"} ${i < 2 ? "border-b md:border-b-0" : ""} border-border md:border-r md:last:border-r-0`}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 font-display text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="codes" className="mx-auto max-w-7xl scroll-mt-14 px-5 py-24 md:px-8 md:py-32">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl md:text-6xl">The codes</h2>
          <p className="max-w-sm text-sm text-muted-foreground">A code is a routing instruction. One per job — modes are never mixed unless you ask.</p>
        </div>
        <div className="space-y-16">
          {GROUPS.map((g) => (
            <div key={g} className="grid gap-6 md:grid-cols-[160px_1fr]">
              <p className="eyebrow pt-1">{g}</p>
              <ul className="border-t border-border">
                {CODES.filter((c) => c.group === g).map((c) => (
                  <li key={c.id} className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-border py-5 transition-colors md:grid-cols-[220px_1fr_auto]">
                    <span className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">{c.id}</span>
                    <span className="col-span-2 row-start-2 text-sm text-muted-foreground md:col-span-1 md:row-start-auto">{c.summary}</span>
                    <span className="col-start-2 row-start-1 font-mono text-[10px] uppercase text-muted-foreground/70 md:col-start-auto">{c.accepts}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="principles" className="scroll-mt-14 border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          {PRINCIPLES.map(([t, d], i) => (
            <div key={t} className="border-b border-border p-8 md:p-14 md:odd:border-r [&:nth-last-child(-n+2)]:md:border-b-0">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-6 font-display text-3xl md:text-4xl">{t}</h3>
              <p className="mt-3 max-w-md text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="studio" className="mx-auto max-w-7xl scroll-mt-14 px-5 py-24 md:px-8 md:py-32">
        <div className="mb-12">
          <p className="eyebrow mb-4">Studio</p>
          <h2 className="font-display text-5xl md:text-6xl">Prepare a job</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Files stay on your device. Zips are opened and listed so your agent knows exactly what's inside.</p>
        </div>
        <Studio />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-8 font-mono text-[11px] text-muted-foreground md:flex-row md:px-8">
          <span>© {new Date().getFullYear()} Ryan Upscales</span>
          <span>Generated detail is inferred, not recovered.</span>
        </div>
      </footer>
    </div>
  );
}
