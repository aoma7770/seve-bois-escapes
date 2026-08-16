import { describe, expect, it } from "vitest";
import {
  bookingTotal,
  maximumGuestsForSelection,
  minimumGuestsForSelection,
  nightlyRate,
} from "./booking";

describe("booking pricing", () => {
  it("prices one cottage at €150 for one guest", () => {
    expect(nightlyRate("la-seve", 1)).toBe(150);
    expect(nightlyRate("le-bois", 1)).toBe(150);
  });

  it("adds €40 per additional guest per night", () => {
    expect(nightlyRate("la-seve", 3)).toBe(230);
    expect(bookingTotal("la-seve", 3, 2)).toBe(460);
  });

  it("prices both cottages from €300 and supports up to 12 guests", () => {
    expect(nightlyRate("both", 4)).toBe(420);
    expect(nightlyRate("both", 12)).toBe(740);
    expect(maximumGuestsForSelection("both")).toBe(12);
  });

  it("requires at least four guests when both cottages are selected", () => {
    expect(minimumGuestsForSelection("both")).toBe(4);
    expect(minimumGuestsForSelection("la-seve")).toBe(1);
  });
});
