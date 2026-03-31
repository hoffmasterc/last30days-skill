import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("books")
      .select("id, title, pages, created_at")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("List error:", error);
      return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
    }

    return NextResponse.json({ books: data || [] });
  } catch (error) {
    console.error("List error:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
