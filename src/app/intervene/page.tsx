"use client";
export const dynamic = "force-dynamic";

import SimpleText from "@/components/SimpleText";
import NameBanner from "@/components/NameBanner";
import { Suspense } from "react";

export default function IntervenePage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>당신은 지금 어떤 모습인가요?</h1>
      <p>이 화면을 통해 스스로를 되돌아보는 시간을 가져보세요.</p>
      <Suspense>
        <NameBanner />
      </Suspense>

      <div style={{ marginTop: "2rem" }}>
        <Suspense>
          {" "}
          <SimpleText />
        </Suspense>{" "}
      </div>
    </main>
  );
}
