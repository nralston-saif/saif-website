import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SAIF - Safe Artificial Intelligence Fund";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f4f0",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* SAIF Logo at top */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: 300,
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            S
          </span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
            }}
          >
            AIF
          </span>
        </div>

        {/* Main content - centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            marginTop: "20px",
          }}
        >
          {/* Main heading */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#1a1a1a",
              textAlign: "center",
              maxWidth: "1000px",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Safe Artificial Intelligence Fund
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#888888",
              marginTop: "24px",
              textAlign: "center",
            }}
          >
            Investing in startups to build a safer future with AI
          </div>

          {/* Offer pills */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "48px",
            }}
          >
            {["$100K Investment", "Mentorship", "Network Access"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e5",
                    borderRadius: "9999px",
                    padding: "12px 24px",
                    fontSize: "18px",
                    fontWeight: 500,
                    color: "#1a1a1a",
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            fontSize: "20px",
            fontWeight: 500,
            color: "#888888",
          }}
        >
          saif.vc
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
