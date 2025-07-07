import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 로그 저장 요청:", body);

    const {
      userId,
      interventionIndex,
      shortsWatched,
      modType,
      modDuration,
      startTime,
      stopTime,
      durationSec,
    } = body;

    const { data, error } = await supabase
      .from("logs")
      .insert([
        {
          userId,
          interventionIndex,
          shortsWatched,
          modType,
          modDuration,
          startTime,
          stopTime,
          durationSec,
        },
      ])
      .select();

    if (error) {
      console.error("❌ 로그 저장 실패:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("✅ 로그 저장 성공:", data);
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.error("❌ 예외 발생:", e);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
