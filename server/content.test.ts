import { describe, expect, it } from "vitest";
import { seedWorkspace } from "./seed";
import { videoEmbed } from "../client/src/lib/content";

describe("Mansalpha editorial privacy", () => {
  it("has no personal biography, named private person, email, or previous brand in initial records", () => {
    const text = seedWorkspace.records
      .map(r => [r.title, r.summary, r.content, r.sourceNote].join("\n"))
      .join("\n");
    expect(text).not.toMatch(
      /\bLuka\b|\bAnić\b|\bAntić\b|stvarna\s+slika|stvarnaslika|info@/i
    );
  });
  it("does not include private case logs or dates in AI memory record", () => {
    const r = seedWorkspace.records.find(r => r.id === "too-much")!;
    expect(r.content).not.toMatch(
      /31\.\s*listopada|MEMORIJSKI ZAPIS #|DATA_PAYLOAD|EVENT_TYPE|SYSTEM_LOG|studija slučaja/i
    );
    expect(r.content).toContain("bez privatnog konteksta");
  });
  it("does not invent initial contacts, event date or location", () => {
    expect(seedWorkspace.lecture.contacts).toEqual([]);
    expect(seedWorkspace.lecture.date).toBe("");
    expect(seedWorkspace.lecture.location).toBe("");
  });
});
describe("Approved relative media", () => {
  it("plays both approved local video namespaces", () => {
    expect(videoEmbed("/media/example.mp4")).toEqual({
      type: "file",
      url: "/media/example.mp4",
    });
    expect(videoEmbed("/manus-storage/example.mp4")).toEqual({
      type: "file",
      url: "/manus-storage/example.mp4",
    });
  });
  it("does not accept unsafe schemes", () => {
    expect(videoEmbed("javascript:alert(1)").url).toBe("");
  });
});
