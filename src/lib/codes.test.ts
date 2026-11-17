import { describe, expect, it } from "vitest";
import { buildPrompt } from "./codes";

describe("buildPrompt", () => {
  it("routes a 3x3 tile request to CODE TILE 1 with 9 tiles", () => {
    const p = buildPrompt("CODE TILE", { tileGrid: 3 });
    expect(p.startsWith("CODE TILE 1")).toBe(true);
    expect(p).toContain("(9 tiles)");
  });
  it("routes the default tile request to CODE TILE 2 with 16 tiles", () => {
    const p = buildPrompt("CODE TILE");
    expect(p.startsWith("CODE TILE 2")).toBe(true);
    expect(p).toContain("(16 tiles)");
  });
});
