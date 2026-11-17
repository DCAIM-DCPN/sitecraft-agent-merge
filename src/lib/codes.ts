import prompts from "./prompts.json";

export type Code = { id: string; name: string; group: "Core" | "Repair" | "Subject" | "Pipeline"; summary: string; accepts: "image" | "video" | "any" };

export const MASTER = prompts.master;
const MODES = prompts.modes as Record<string, string>;

export const CODES: Code[] = [
  { id: "CODE JELLO", name: "Jello", group: "Core", summary: "One complete image, enhanced as one coherent composition.", accepts: "image" },
  { id: "CODE TILE", name: "Tile", group: "Core", summary: "Aligned overlapping tiles reconciled into one seamless master. 3×3 or 4×4.", accepts: "image" },
  { id: "CODE ALL", name: "All", group: "Core", summary: "Measures the source, then runs every relevant pass automatically.", accepts: "any" },
  { id: "CODE REFERENCE", name: "Reference", group: "Core", summary: "Main image plus reference images to lock faces and people.", accepts: "image" },
  { id: "CODE BLU RAY", name: "Blu Ray", group: "Pipeline", summary: "Anime remaster with cross-frame references and temporal locking.", accepts: "video" },
  { id: "CODE BLU RAY TEST", name: "Blu Ray Test", group: "Pipeline", summary: "Sample frames first, comparison report before the full run.", accepts: "video" },
  { id: "CODE INSPECT", name: "Inspect", group: "Pipeline", summary: "Analysis only. Reports measurements, generates nothing.", accepts: "any" },
  { id: "CODE LINEART", name: "Lineart", group: "Repair", summary: "Rebuilds every drawn line clean, consistent and halo-free.", accepts: "image" },
  { id: "CODE DEBAND", name: "Deband", group: "Repair", summary: "Replaces stair-stepped gradients with smooth tone.", accepts: "image" },
  { id: "CODE DEBLOCK", name: "Deblock", group: "Repair", summary: "Removes 8×8 macroblocking, mosquito noise and ringing.", accepts: "image" },
  { id: "CODE DEINTERLACE", name: "Deinterlace", group: "Repair", summary: "Field and combing repair without losing motion state.", accepts: "video" },
  { id: "CODE DEGRAIN", name: "Degrain", group: "Repair", summary: "Separates true detail from noise; grain policy respected.", accepts: "any" },
  { id: "CODE COLOR", name: "Color", group: "Repair", summary: "Corrects fading, casts and chromatic aberration.", accepts: "image" },
  { id: "CODE FACE", name: "Face", group: "Subject", summary: "Identity-locked face restoration. Eyes stay on-model.", accepts: "image" },
  { id: "CODE CHARACTER", name: "Character", group: "Subject", summary: "Character-accurate restoration of design and palette.", accepts: "image" },
  { id: "CODE BACKGROUND", name: "Background", group: "Subject", summary: "Painted and photographed background detail.", accepts: "image" },
  { id: "CODE TEXT", name: "Text", group: "Subject", summary: "Signs, subtitles and logos locked. No invented text.", accepts: "image" },
  { id: "CODE MANGA", name: "Manga", group: "Subject", summary: "Line art and screentone rebuilt at original pitch.", accepts: "image" },
  { id: "CODE PHOTO", name: "Photo", group: "Subject", summary: "Archival photographs: dust, scratches, creases.", accepts: "image" },
];

export function buildPrompt(codeId: string, opts: { tileGrid?: 3 | 4; notes?: string; files?: string[] } = {}) {
  const base = codeId === "CODE TILE" && opts.tileGrid === 3 ? "CODE TILE 1" : codeId === "CODE TILE" ? "CODE TILE 2" : codeId;
  const lookup = codeId.startsWith("CODE TILE") ? "CODE TILE" : codeId;
  const grid = opts.tileGrid ?? 4;
  const mode = (MODES[lookup] ?? `MODE: ${codeId}.`).replace("{grid}×{grid}", `${grid}×${grid}`).replace("{tiles}", String(grid * grid));
  return [
    base,
    "",
    MASTER,
    "",
    mode,
    opts.files?.length ? `\nSOURCE FILES:\n${opts.files.map((f, i) => `${i + 1}. ${f}`).join("\n")}` : "",
    opts.notes?.trim() ? `\nOWNER NOTES: ${opts.notes.trim()}` : "",
  ].filter((l) => l !== undefined).join("\n").trim();
}
