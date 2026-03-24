import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check 5-book limit
    const { count } = await supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("clerk_user_id", userId);

    if (count !== null && count >= 5) {
      return NextResponse.json(
        { error: "You've reached 5 saved books. Delete one to create a new book." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from("books")
      .insert({
        clerk_user_id: userId,
        title: body.title || "Untitled Book",
        status: "complete",
        inputs: body.inputs,
        pages: body.pages,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Save error:", error);
      return NextResponse.json({ error: "Failed to save book" }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "Failed to save book" }, { status: 500 });
  }
}
