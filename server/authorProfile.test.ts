import { describe, expect, it } from "vitest";
import {
  AUTHOR_PROFILE,
  AUTHOR_ASSERTIONS,
  RESEARCH_FRAMEWORK,
  PLATFORM_PAGE_VISUALS,
  MANSALPHA_MISSION,
  HERMETIC_PRINCIPLE,
} from "../shared/platform";
import { withHomepageHtml } from "./homepageHtml";
import { seedWorkspace } from "./seed";
import fs from "node:fs";

const template =
  '<html lang="hr"><head><title>Test</title><meta name="description" content="Test" /></head><body><div id="root"></div></body></html>';
describe("MansAlpha unified platform and approved profile", () => {
  it("uses only the user-authorized biography without inventing clinical credentials", () => {
    expect(AUTHOR_PROFILE.name).toBe("Luka Anić-Antić");
    expect(AUTHOR_PROFILE.biography).toContain("ekonomist");
    expect(AUTHOR_PROFILE.background).toContain("MUP-u RH");
    expect(AUTHOR_PROFILE.background).toContain("državni stručni ispit");
    expect(JSON.stringify(AUTHOR_PROFILE)).not.toMatch(
      /licenciran|liječnik|doktor|psihijatar|diplomirani psiholog|@|\+385|rođen/i
    );
    expect(AUTHOR_PROFILE.imageUrl).toMatch(
      /^\/manus-storage\/mansalpha-author_[a-z0-9]+\.webp$/
    );
  });
  it("keeps experience assertions clearly unverified, not promotional statistics", () => {
    expect(AUTHOR_ASSERTIONS.text).toContain("15 godina");
    expect(AUTHOR_ASSERTIONS.text).toContain("500 klijenata");
    expect(AUTHOR_ASSERTIONS.note).toContain("ne neovisno potvrđene");
    expect(AUTHOR_ASSERTIONS.note).toContain("Dokumentacija i popis radova");
  });
  it("contains four educational research fields and explicit epistemic boundaries", () => {
    expect(RESEARCH_FRAMEWORK.map(a => a.title)).toEqual([
      "Klinička psihologija",
      "Parapsihologija",
      "Filozofija uma",
      "Forenzička praksa",
    ]);
    expect(RESEARCH_FRAMEWORK[0].detail).toContain(
      "nije tvrdnja da platforma pruža terapiju"
    );
    expect(RESEARCH_FRAMEWORK[1].detail).toContain("a ne potvrđeni mehanizmi");
    expect(RESEARCH_FRAMEWORK[2].detail).toContain("nije znanstveni konsenzus");
    expect(RESEARCH_FRAMEWORK[3].detail).toContain(
      "ne sadrži operativne upute"
    );
    expect(MANSALPHA_MISSION).toContain("MansAlpha");
    expect(HERMETIC_PRINCIPLE).toBe(
      "Ono što je iznad, jest kao i ono što je dolje."
    );
  });
  it("renders the description and profile in semantic SSR sections", () => {
    const html = withHomepageHtml(template, "/");
    expect(html).toContain('id="o-mansalpha"');
    expect(html).toContain('id="autor"');
    expect(html).toContain('id="mh-author-name"');
    expect(html).toContain(AUTHOR_ASSERTIONS.note);
    expect(html).not.toMatch(
      /stvarna\s+slika|stvarnaslika|DATA_PAYLOAD|MEMORIJSKI ZAPIS #/i
    );
  });
  it("preserves all existing content and provides meaningful visuals for every editor page", () => {
    expect(seedWorkspace.records).toHaveLength(46);
    expect(seedWorkspace.lecture.audience).toContain("20–30");
    expect(Object.keys(PLATFORM_PAGE_VISUALS)).toHaveLength(11);
    const manifest = JSON.parse(
      fs.readFileSync("client/public/manus-routes.json", "utf8")
    );
    expect(manifest.routes).toHaveLength(12);
    for (const path of Object.keys(PLATFORM_PAGE_VISUALS)) {
      expect(
        manifest.routes.some((r: { path: string }) => r.path === path)
      ).toBe(true);
      expect(PLATFORM_PAGE_VISUALS[path].image).toMatch(/^\/manus-storage\//);
    }
  });
});
