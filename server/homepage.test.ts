import { describe, expect, it } from "vitest";
import { getEditorialRecords } from "./editorial";
import { withHomepageHtml } from "./homepageHtml";
import { AUTHOR_PROFILE } from "../shared/platform";
import {
  HOMEPAGE_VIDEOS,
  KNOWLEDGE_AREAS,
  MANIFESTO,
  featuredArticles,
} from "../shared/homepage";

const template =
  '<html lang="hr"><head><title>Test</title><meta name="description" content="Test" /></head><body><div id="root"></div></body></html>';
describe("MansAlpha premium homepage", () => {
  it("renders meaningful educational HTML before browser JavaScript", () => {
    const html = withHomepageHtml(template, "/");
    expect(html).toContain("mh-hero-title");
    expect(html).toContain("Inteligencija. Svijest. Znanje. Evolucija.");
    expect(html).toContain(MANIFESTO);
    expect(html).toContain("Istraživanja, analize");
    expect(html).toContain('id="podrucja"');
    expect(html).toContain('id="multimedija"');
    expect(html).toContain('id="vizija"');
    expect(html).not.toContain('<div id="root"></div>');
  });
  it("includes only the explicitly authorized profile, never private workspace or case data", () => {
    const html = withHomepageHtml(template, "/");
    const outsideAuthorizedProfile = html.replace(
      /<section[^>]*id="autor"[\s\S]*?<\/section>/g,
      ""
    );
    expect(html).toContain(AUTHOR_PROFILE.biography);
    expect(html).toContain(AUTHOR_PROFILE.imageUrl);
    expect(outsideAuthorizedProfile).not.toMatch(
      /\bLuka\b|\bAnić\b|\bAntić\b/i
    );
    expect(html).not.toMatch(
      /\bAnte Kelava\b|stvarna\s+slika|stvarnaslika|DATA_PAYLOAD|MEMORIJSKI ZAPIS #/i
    );
    expect(html).not.toContain("lecture.notes");
    expect(html).not.toContain("contacts");
    const records = getEditorialRecords();
    expect(JSON.stringify(records)).not.toMatch(
      /\bLuka\b|\bAnte Kelava\b|\bAnić\b|\bAntić\b|DATA_PAYLOAD|MEMORIJSKI ZAPIS #/i
    );
    expect(records.every(r => !["event", "idea"].includes(r.kind))).toBe(true);
    expect(records.some(r => r.id === "restricted-forensic-presentation")).toBe(
      false
    );
  });
  it("provides six different meaningful category visuals and working destinations", () => {
    expect(KNOWLEDGE_AREAS).toHaveLength(6);
    expect(new Set(KNOWLEDGE_AREAS.map(a => a.image)).size).toBe(6);
    expect(KNOWLEDGE_AREAS.every(a => a.path.startsWith("/"))).toBe(true);
  });
  it("selects existing articles only with distinct subject-relevant covers", () => {
    const records = getEditorialRecords();
    const articles = featuredArticles(records);
    expect(articles).toHaveLength(4);
    expect(
      articles.every(a =>
        records.some(r => r.id === a.id && r.kind === "article")
      )
    ).toBe(true);
    expect(new Set(articles.map(a => a.imageUrl)).size).toBe(4);
  });
  it("enables only the three content-inspected requested YouTube videos", () => {
    expect(HOMEPAGE_VIDEOS.map(v => v.id)).toEqual([
      "dO7PDVKocao",
      "CC-OIkBJlMs",
      "rNh6fM6_hCo",
    ]);
    expect(
      HOMEPAGE_VIDEOS.every(v => v.checkedContent && v.isSafe && v.embeddable)
    ).toBe(true);
    const html = withHomepageHtml(template, "/");
    expect(html).not.toContain("<iframe");
  });
  it("does not inject homepage content into private workspace routes", () => {
    expect(withHomepageHtml(template, "/pregled")).toBe(template);
    expect(withHomepageHtml(template, "/predavanje")).toBe(template);
  });
  it("returns independent catalog clones without modifying original seed", () => {
    const one = getEditorialRecords();
    const before = one[0].title;
    one[0].title = "modified";
    expect(getEditorialRecords()[0].title).toBe(before);
  });
});
