import type { Metadata } from "next";
import { Suspense } from "react";
import { ResearchSections, SectionsFallback } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <Shell>
      <SiteHeader current="/work/research" />
      <PageTitle no="03.3" en="Research" ko="연구 — 대학원 기록" />
      <Suspense fallback={<SectionsFallback />}>
        <ResearchSections />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
