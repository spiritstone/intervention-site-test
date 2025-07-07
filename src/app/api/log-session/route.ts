import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(">>> 세션 API 요청 데이터:", body);

    const {
      userId,
      actionType,
      appEnterTime,
      appExitTime,
      appDurationSec,
      shortsEnterTime,
      shortsExitTime,
      shortsDurationSec,
      shortsWatchedTotal,
      modalPoints,
    } = body;

    const { error } = await supabase.from("sessions").insert([
      {
        userId,
        actionType,
        appEnterTime,
        appExitTime,
        appDurationSec,
        shortsEnterTime,
        shortsExitTime,
        shortsDurationSec,
        shortsWatchedTotal,
        modalPoints,
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "세션 로그 업로드 성공!" });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
