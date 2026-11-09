import type { Metadata } from "next";
import { Suspense } from "react";
import { PublishingSections, SectionsFallback } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Publishing" };

export default function PublishingPage() {
  return (
    <Shell>
      <SiteHeader current="/work/publishing" />
      <PageTitle no="03.2" en="Publishing" ko="출판 — 삶을 담는 그릇" />
      <Suspense fallback={<SectionsFallback />}>
        <PublishingSections />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
