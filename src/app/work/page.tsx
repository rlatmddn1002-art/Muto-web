import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionsFallback, WorkSections } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <Shell>
      <SiteHeader current="/work" />
      <PageTitle no="03" en="Work" ko="연재 · 출판 · 작업" />
      <Suspense fallback={<SectionsFallback />}>
        <WorkSections />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
