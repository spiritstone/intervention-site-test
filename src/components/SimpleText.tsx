"use client";

import { useSearchParams } from "next/navigation";

export default function SimpleText() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); // 예시

  return (
    <div>
      <h1>간단한 텍스트 컴포넌트입니다: {name}</h1>
    </div>
  );
}
