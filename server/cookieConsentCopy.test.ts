import { describe, expect, it } from "vitest";
import { cookieConsentCopy } from "../client/src/lib/cookieConsentCopy";

describe("cookie consent copy", () => {
  it("explains the optional trackers and preserves a real decline choice in all languages", () => {
    for (const language of ["fr", "en", "be"] as const) {
      expect(cookieConsentCopy.intro[language].toLowerCase()).toMatch(/expérience|experience|ervaring/);
      expect(cookieConsentCopy.detail[language].toLowerCase()).toMatch(/facultatif|optional|optionele/);
      expect(cookieConsentCopy.detail[language].toLowerCase()).toMatch(/refuser|decline|weigeren/);
      expect(cookieConsentCopy.accept[language]).toBeTruthy();
      expect(cookieConsentCopy.decline[language]).toBeTruthy();
    }
  });
});
