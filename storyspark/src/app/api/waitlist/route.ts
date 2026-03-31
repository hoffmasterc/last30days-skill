import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let clerkUserId: string | null = null;
    try {
      const { userId } = await auth();
      clerkUserId = userId;
    } catch {
      // Not authenticated — that's fine
    }

    const { error } = await supabase
      .from("waitlist")
      .upsert(
        { email, clerk_user_id: clerkUserId },
        { onConflict: "email" }
      );

    if (error) {
      console.error("Waitlist error:", error);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
