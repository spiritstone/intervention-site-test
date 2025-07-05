// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(">>> API 요청 데이터:", body);

    const { userId, shortsCount, modalDuration, modalType } = body;

    // table name: participants
    const { data, error } = await supabase.from("participants").upsert(
      [
        {
          userId,
          shortsCount,
          modalDuration,
          modalType,
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "userId" }
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
