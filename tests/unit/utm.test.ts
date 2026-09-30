import { describe, it, expect } from "vitest";
import { extractUtmsFromSearch } from "@/lib/utm";

describe("UTM Extraction & Parsing", () => {
  it("extracts all standard UTM and click ID parameters", () => {
    const search = "?utm_source=meta&utm_medium=paid_social&utm_campaign=human_signal_candidate_acquisition&utm_content=kv01_human_signal&utm_term=students&fbclid=IwAR123";
    const utms = extractUtmsFromSearch(search);

    expect(utms).not.toBeNull();
    expect(utms?.utm_source).toBe("meta");
    expect(utms?.utm_medium).toBe("paid_social");
    expect(utms?.utm_campaign).toBe("human_signal_candidate_acquisition");
    expect(utms?.utm_content).toBe("kv01_human_signal");
    expect(utms?.utm_term).toBe("students");
    expect(utms?.fbclid).toBe("IwAR123");
    expect(utms?.captured_at).toBeDefined();
  });

  it("returns null if no tracking parameters are in the query", () => {
    const search = "?next=/builder&page=1";
    const utms = extractUtmsFromSearch(search);
    expect(utms).toBeNull();
  });
});
