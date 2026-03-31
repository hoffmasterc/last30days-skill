import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", params.bookId)
      .eq("clerk_user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book: data });
  } catch (error) {
    console.error("Get book error:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", params.bookId)
      .eq("clerk_user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
