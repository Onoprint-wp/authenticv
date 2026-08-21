import { ImageResponse } from "next/og";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CvData } from "@/store/useCvStore";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getBase64Image(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = res.headers.get("content-type") || "image/png";
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  let name = "Candidat";
  let jobTitle = "";
  let location = "";
  let skills: string[] = [];
  let initials = "CV";
  let photoUrl: string | null = null;

  try {
    const { slug } = await params;
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("resumes")
      .select("content")
      .eq("share_slug", slug)
      .eq("is_public", true)
      .maybeSingle();

    if (data?.content) {
      const cv = data.content as CvData;
      const firstName = cv.personalInfo?.firstName ?? "";
      const lastName = cv.personalInfo?.lastName ?? "";
      name = `${firstName} ${lastName}`.trim() || "Candidat";
      jobTitle = cv.personalInfo?.title ?? "";
      location = cv.personalInfo?.location ?? "";
      skills = (cv.skills ?? []).slice(0, 5);
      initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "CV";
      if (cv.personalInfo?.photoUrl && cv.personalInfo.photoUrl.startsWith("http")) {
        photoUrl = await getBase64Image(cv.personalInfo.photoUrl);
      }
    }
  } catch (err) {
    console.error("[OG Image] Error loading resume content:", err);
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            padding: "60px",
            fontFamily: "sans-serif",
            position: "relative",
          }}
        >
          {/* Cercle décoratif */}
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-120px",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            }}
          />

          {/* Badge AuthentiCV */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "#4f46e5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              📄
            </div>
            <span style={{ color: "#94a3b8", fontSize: "18px", fontWeight: 600 }}>
              AuthentiCV
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "40px", flex: 1 }}>
            {/* Avatar photo ou initiales */}
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid rgba(99,102,241,0.6)",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                  border: "3px solid rgba(99,102,241,0.4)",
                }}
              >
                {initials}
              </div>
            )}

            {/* Infos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </div>
              {jobTitle && (
                <div
                  style={{
                    fontSize: "26px",
                    color: "#818cf8",
                    fontWeight: 500,
                  }}
                >
                  {jobTitle}
                </div>
              )}
              {location && (
                <div style={{ fontSize: "18px", color: "#64748b" }}>
                  📍 {location}
                </div>
              )}
            </div>
          </div>

          {/* Skills chips */}
          {skills.length > 0 && (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "32px" }}>
              {skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    color: "#a5b4fc",
                    fontSize: "16px",
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
      { ...size }
    );
  } catch (err) {
    console.error("[OG Image] ImageResponse error:", err);
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "48px", fontWeight: 700 }}>{name}</h1>
          <p style={{ fontSize: "24px", color: "#818cf8" }}>{jobTitle || "CV AuthentiCV"}</p>
        </div>
      ),
      { ...size }
    );
  }
}
