// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(">>> API 요청 데이터:", body);

    const { userName, shortsCount, modalDuration, modalType } = body;

    // table name: participants
    const { data, error } = await supabase.from("participants").upsert(
      [
        {
          userName,
          shortsCount,
          modalDuration,
          modalType,
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "userName" }
    );

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "업로드 성공", data });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
