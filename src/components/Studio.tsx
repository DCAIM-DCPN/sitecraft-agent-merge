import { useCallback, useMemo, useRef, useState } from "react";
import JSZip from "jszip";
import { CODES, buildPrompt } from "@/lib/codes";

type Item = { name: string; size: number; kind: "image" | "video" | "zip" | "file"; url?: string; entries?: string[] };

const fmt = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export function Studio() {
  const [items, setItems] = useState<Item[]>([]);
  const [code, setCode] = useState("CODE JELLO");
  const [grid, setGrid] = useState<3 | 4>(4);
  const [notes, setNotes] = useState("");
  const [over, setOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const ingest = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const next: Item[] = [];
    for (const f of Array.from(files)) {
      if (f.name.toLowerCase().endsWith(".zip")) {
        try {
          const zip = await JSZip.loadAsync(f);
          const entries = Object.values(zip.files).filter((e) => !e.dir && !e.name.includes("__MACOSX")).map((e) => e.name);
          next.push({ name: f.name, size: f.size, kind: "zip", entries });
        } catch {
          next.push({ name: f.name, size: f.size, kind: "zip", entries: [] });
        }
      } else if (f.type.startsWith("image/")) next.push({ name: f.name, size: f.size, kind: "image", url: URL.createObjectURL(f) });
      else if (f.type.startsWith("video/")) next.push({ name: f.name, size: f.size, kind: "video", url: URL.createObjectURL(f) });
      else next.push({ name: f.name, size: f.size, kind: "file" });
    }
    setItems((p) => [...p, ...next]);
  }, []);

  const fileNames = useMemo(() => items.flatMap((i) => (i.kind === "zip" ? (i.entries ?? []).map((e) => `${i.name}/${e}`) : [i.name])), [items]);
  const prompt = useMemo(() => buildPrompt(code, { tileGrid: grid, notes, files: fileNames }), [code, grid, notes, fileNames]);
  const active = CODES.find((c) => c.id === code)!;

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const download = () => {
    const blob = new Blob([JSON.stringify({ code, tileGrid: code === "CODE TILE" ? grid : undefined, files: fileNames, notes, prompt }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${code.toLowerCase().replace(/\s+/g, "-")}-job.json`;
    a.click();
  };

  return (
    <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-8 bg-background p-6 md:p-10">
        <div>
          <p className="eyebrow mb-3">01 — Source</p>
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); ingest(e.dataTransfer.files); }}
            className={`grid-paper group relative flex h-56 w-full flex-col items-center justify-center gap-3 overflow-hidden border border-dashed transition-colors ${over ? "border-primary bg-primary/5" : "border-input hover:border-muted-foreground"}`}
          >
            <span className="font-display text-3xl italic">Drop files here</span>
            <span className="font-mono text-xs text-muted-foreground">Images · video · .zip — or tap to browse</span>
            {over && <span className="animate-scan absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />}
          </button>
          <input ref={input} type="file" multiple accept="image/*,video/*,.zip" className="hidden" onChange={(e) => { ingest(e.target.files); e.target.value = ""; }} />
          {items.length > 0 && (
            <ul className="mt-4 divide-y divide-border border border-border">
              {items.map((it, i) => (
                <li key={i} className="flex items-center gap-4 p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-muted font-mono text-[10px] uppercase text-muted-foreground">
                    {it.kind === "image" ? <img src={it.url} alt="" className="h-full w-full object-cover" /> : it.kind}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{it.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {fmt(it.size)}{it.kind === "zip" && ` · ${it.entries?.length ?? 0} files inside`}
                    </p>
                  </div>
                  <button onClick={() => setItems((p) => p.filter((_, j) => j !== i))} className="font-mono text-xs text-muted-foreground hover:text-destructive" aria-label={`Remove ${it.name}`}>
                    remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3">02 — Code</p>
          <div className="flex flex-wrap gap-1.5">
            {CODES.map((c) => (
              <button key={c.id} onClick={() => setCode(c.id)}
                className={`border px-3 py-1.5 font-mono text-xs transition-colors ${code === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"}`}>
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{active.summary}</p>
          {code === "CODE TILE" && (
            <div className="mt-4 flex gap-1.5">
              {([3, 4] as const).map((g) => (
                <button key={g} onClick={() => setGrid(g)} className={`border px-3 py-1.5 font-mono text-xs ${grid === g ? "border-foreground text-foreground" : "border-border text-muted-foreground"}`}>
                  {g}×{g} · {g * g} tiles
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-3">03 — Notes</p>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything the agent should know. Character names, target size, frames to test…"
            className="w-full resize-none border border-input bg-transparent p-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <p className="eyebrow">04 — Prompt for your agent</p>
          <span className="font-mono text-[11px] text-muted-foreground">{prompt.length.toLocaleString()} chars</span>
        </div>
        <pre className="max-h-[520px] min-h-[320px] flex-1 overflow-auto whitespace-pre-wrap p-6 font-mono text-[12px] leading-relaxed text-card-foreground/85">{prompt}</pre>
        <div className="grid grid-cols-2 border-t border-border">
          <button onClick={copy} className="bg-primary py-4 font-mono text-xs uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90">
            {copied ? "Copied" : "Copy prompt"}
          </button>
          <button onClick={download} className="py-4 font-mono text-xs uppercase tracking-widest text-foreground hover:bg-accent">
            Download job
          </button>
        </div>
      </div>
    </div>
  );
}
