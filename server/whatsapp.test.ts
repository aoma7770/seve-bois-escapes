import { describe, expect, it } from "vitest";
import { getWhatsAppHref, WHATSAPP_NUMBER, whatsappMessages } from "../client/src/components/WhatsAppFloat";

describe("WhatsApp chat links", () => {
  it("uses the supplied business number", () => {
    expect(WHATSAPP_NUMBER).toBe("15554425152");
    expect(getWhatsAppHref("en")).toContain("https://wa.me/15554425152?text=");
  });

  it("prefills the message in the active site language", () => {
    for (const language of ["fr", "en", "nl"] as const) {
      const href = getWhatsAppHref(language);
      expect(href).toContain(encodeURIComponent(whatsappMessages[language]));
    }
  });
});
