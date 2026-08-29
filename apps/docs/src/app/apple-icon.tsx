import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#11140F",
        color: "#C6FF4A",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        fontSize: 118,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        letterSpacing: -10,
        paddingRight: 8,
        width: "100%",
      }}
    >
      P
    </div>,
    size,
  );
}
