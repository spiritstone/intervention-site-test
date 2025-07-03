// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username, shortsCount, modalDuration, modalType } = body;

    if (!username || !shortsCount || !modalDuration || !modalType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // table name: participants
    const { error } = await supabase.from("participants").insert({
      username,
      shorts_count: shortsCount,
      modal_duration: modalDuration,
      modal_type: modalType,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "업로드 성공" }, { status: 200 });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
