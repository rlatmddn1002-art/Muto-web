import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MUTO Associates",
    short_name: "MUTO",
    description: "MUTO Associates 활동 관리와 아카이브",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#efefef",
    theme_color: "#efefef",
    lang: "ko",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
