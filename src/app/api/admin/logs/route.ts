import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: participants, error: participantsError } = await supabase
      .from("participants")
      .select("*")
      .order("id", { ascending: true });
    const { data: logs, error: logsError } = await supabase
      .from("logs")
      .select("*");

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("*")
      .order("session_id", { ascending: true });

    if (participantsError || logsError || sessionsError) {
      return NextResponse.json(
        { error: participantsError ?? logsError ?? sessionsError },
        { status: 500 }
      );
    }

    return NextResponse.json({ participants, logs, sessions });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(err) },
      { status: 500 }
    );
  }
}
