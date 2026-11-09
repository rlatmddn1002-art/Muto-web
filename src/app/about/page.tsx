import type { Metadata } from "next";
import { Suspense } from "react";
import { About } from "@/components/About";
import { PublicTimeline } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Shell>
      <SiteHeader current="/about" />
      <PageTitle no="01" en="About" ko="무토에 대하여" />
      <About />
      <Suspense fallback={null}>
        <PublicTimeline />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
