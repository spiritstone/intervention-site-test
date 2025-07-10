// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ SERVER-ONLY KEY 사용
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(">>> API 요청 데이터:", body);

    const { userId, shortsCount, modalDuration, modalType } = body;

    // ✅ 참가자 데이터 삽입
    const { data, error } = await supabase.from("participants").upsert(
      [
        {
          userId,
          shortsCount,
          modalDuration,
          modalType,
        },
      ],
      { onConflict: "userId" } // ✅ userId 기준으로 덮어쓰기
    );

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "업로드 성공", data });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ err }, { status: 500 });
  }
}
