import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Safe Artificial Intelligence Fund",
    short_name: "SAIF",
    description:
      "An early-stage venture fund dedicated to supporting startups developing tools to enhance AI safety, security, and responsible deployment.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f4f0",
    theme_color: "#1a1a1a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
