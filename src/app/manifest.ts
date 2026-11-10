import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MUTO Associates",
    short_name: "MUTO",
    description: "MUTO Associates — Architecture studio",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#efefef",
    theme_color: "#efefef",
    lang: "ko",
    shortcuts: [
      { name: "Journal", url: "/journal" },
      { name: "Work", url: "/work" },
      { name: "관리", url: "/admin" },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
