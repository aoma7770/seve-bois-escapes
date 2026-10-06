import { afterEach, describe, expect, it, vi } from "vitest";
import { GA4_MEASUREMENT_ID, loadGoogleAnalytics } from "../client/src/lib/analytics";

describe("GA4 installation", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  afterEach(() => {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    vi.restoreAllMocks();
  });

  it("does not load before analytics consent", () => {
    const localStorage = { getItem: vi.fn(() => null) };
    globalThis.window = { localStorage } as unknown as Window & typeof globalThis;
    globalThis.document = { querySelector: vi.fn() } as unknown as Document;

    expect(loadGoogleAnalytics()).toBe(false);
    expect(localStorage.getItem).toHaveBeenCalledWith("sevebois-cookie-consent");
  });

  it("installs the Google tag after consent with explicit consent state and config", () => {
    const appended: HTMLScriptElement[] = [];
    const dataLayer: unknown[] = [];
    const localStorage = { getItem: vi.fn(() => "accepted") };
    const documentMock = {
      querySelector: vi.fn(() => appended[0] ?? null),
      createElement: vi.fn(() => ({ async: false, src: "", dataset: {} }) as unknown as HTMLScriptElement),
      head: { appendChild: vi.fn((script: HTMLScriptElement) => appended.push(script)) },
    };
    globalThis.window = { localStorage, dataLayer } as unknown as Window & typeof globalThis;
    globalThis.document = documentMock as unknown as Document;

    expect(loadGoogleAnalytics()).toBe(true);
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`);
    expect(appended[0].dataset.greenCottagesGa4).toBe(GA4_MEASUREMENT_ID);
    expect(dataLayer).toEqual(expect.arrayContaining([
      ["consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      }],
      ["config", GA4_MEASUREMENT_ID, expect.objectContaining({ send_page_view: false, anonymize_ip: true })],
    ]));

    expect(loadGoogleAnalytics()).toBe(true);
    expect(appended).toHaveLength(1);
  });
});
