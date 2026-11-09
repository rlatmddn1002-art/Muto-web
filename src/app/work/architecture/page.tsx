import type { Metadata } from "next";
import { Suspense } from "react";
import { ArchitectureSections, SectionsFallback } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Architecture" };

export default function ArchitecturePage() {
  return (
    <Shell>
      <SiteHeader current="/work/architecture" />
      <PageTitle no="03.1" en="Architecture" ko="건축 — 지속가능성 · 순환" />
      <Suspense fallback={<SectionsFallback />}>
        <ArchitectureSections />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
