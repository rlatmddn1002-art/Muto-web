import type { Metadata } from "next";
import { Suspense } from "react";
import { Journal } from "@/components/Journal";
import { SectionsFallback } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Journal" };

export default function JournalPage() {
  return (
    <Shell>
      <SiteHeader current="/journal" />
      <PageTitle no="02" en="Journal" ko="블로그에 쓴 생각의 기록" />
      <Suspense fallback={<SectionsFallback />}>
        <Journal />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
