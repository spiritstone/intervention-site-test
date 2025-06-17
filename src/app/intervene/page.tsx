"use client";
export const dynamic = "force-dynamic";

import SimpleText from "@/components/SimpleText";
import NameBanner from "@/components/NameBanner";
import { Suspense, useState } from "react";
import CameraFeed from "@/components/CameraFeed";

export default function IntervenePage() {
  const [selected, setSelected] = useState<"text" | "camera" | null>(null);

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>당신은 지금 어떤 모습인가요?</h1>
      <p>이 화면을 통해 스스로를 되돌아보는 시간을 가져보세요.</p>
      <Suspense>
        <NameBanner />
      </Suspense>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <button onClick={() => setSelected("text")}>텍스트 보기</button>
        <button onClick={() => setSelected("camera")}>카메라 보기</button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Suspense>
          {selected === "text" && <SimpleText />}
          {selected === "camera" && <CameraFeed />}
        </Suspense>
      </div>
    </main>
  );
}
