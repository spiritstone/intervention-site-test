"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function NameBanner() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  if (!name) return null;

  return (
    <Suspense>
      <p style={{ fontSize: "1.5rem", marginTop: "1.5rem" }}>
        <strong>{name}</strong> 님, 안녕하세요.
      </p>
    </Suspense>
  );
}
