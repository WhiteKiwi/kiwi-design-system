import { ImageResponse } from "next/og";

export const socialImageAlt =
  "PIP — WhiteKiwi Design System. Small parts, one clear system.";
export const socialImageSize = { width: 1200, height: 630 };
export const socialImageContentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#F4F5EF",
        color: "#11140F",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        padding: "46px",
        width: "100%",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid rgba(17, 20, 15, 0.2)",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 18,
          justifyContent: "space-between",
          letterSpacing: 2,
          paddingBottom: 28,
        }}
      >
        <b>PIP · WHITEKIWI</b>
        <span>DESIGN SYSTEM · V0.3</span>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            fontSize: 112,
            fontWeight: 700,
            justifyContent: "center",
            letterSpacing: -8,
            lineHeight: 0.85,
          }}
        >
          <span>SMALL PARTS.</span>
          <span style={{ color: "#3C6000" }}>ONE CLEAR</span>
          <span style={{ color: "#3C6000" }}>SYSTEM.</span>
        </div>
        <div
          style={{
            alignItems: "flex-end",
            background: "#C6FF4A",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 17,
            lineHeight: 1.6,
            padding: 28,
            width: 270,
          }}
        >
          FOUNDATION → PRIMITIVE → COMPONENT → PATTERN → PAGE
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
