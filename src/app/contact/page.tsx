import type { Metadata } from "next";
import { Suspense } from "react";
import { Closing } from "@/components/About";
import { Channels } from "@/components/Sections";
import { PageTitle, Shell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Shell>
      <SiteHeader current="/contact" />
      <PageTitle no="04" en="Contact" ko="채널 · 연락" />
      <Closing />
      <Suspense fallback={null}>
        <Channels />
      </Suspense>
      <SiteFooter />
    </Shell>
  );
}
