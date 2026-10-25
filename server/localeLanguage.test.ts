import { describe, expect, it } from "vitest";
import { languageFromBrowserLocales } from "../client/src/lib/localeLanguage";

describe("browser locale language selection", () => {
  it.each([
    [["nl-BE"], "nl"],
    [["nl-NL"], "nl"],
    [["fr-BE"], "fr"],
    [["fr-FR"], "fr"],
    [["en-US"], "en"],
    [["de-DE"], "en"],
  ] as const)("maps %j to %s", (locales, expected) => {
    expect(languageFromBrowserLocales(locales)).toBe(expected);
  });

  it("uses the first supported preference", () => {
    expect(languageFromBrowserLocales(["de-DE", "fr-FR"])).toBe("fr");
    expect(languageFromBrowserLocales(["en-GB", "nl-NL"])).toBe("en");
  });

  it("does not treat unrelated regional French or Dutch locales as the target regions", () => {
    expect(languageFromBrowserLocales(["fr-CA"])).toBe("en");
    expect(languageFromBrowserLocales(["nl-BQ"])).toBe("en");
  });
});
