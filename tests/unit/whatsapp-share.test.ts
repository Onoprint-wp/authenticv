import { describe, it, expect } from "vitest";
import { buildWhatsAppShareUrl } from "@/lib/whatsapp";

describe("buildWhatsAppShareUrl", () => {
  it("should generate a valid web share URL without phone number", () => {
    const url = buildWhatsAppShareUrl({
      fullName: "Marc Nkono",
      cvUrl: "https://www.authenticv.app/cv/marc-nkono",
      documentTitle: "Ingénieur Télécoms",
    });

    expect(url).toContain("https://api.whatsapp.com/send?text=");
    expect(decodeURIComponent(url)).toContain("Marc Nkono");
    expect(decodeURIComponent(url)).toContain("https://www.authenticv.app/cv/marc-nkono");
  });

  it("should format direct recipient phone number properly", () => {
    const url = buildWhatsAppShareUrl({
      fullName: "Marc Nkono",
      cvUrl: "https://www.authenticv.app/cv/marc-nkono",
      phone: "+237 690 12 34 56",
    });

    expect(url).toContain("https://wa.me/237690123456?text=");
  });
});
