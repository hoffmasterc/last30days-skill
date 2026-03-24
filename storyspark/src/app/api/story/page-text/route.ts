import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { pageTextPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = pageTextPrompt({
      page_number: body.page_number,
      page_count: body.page_count,
      audience_age: body.audience_age || "5-6",
      tone: body.tone || "Playful",
      previous_summaries: body.previous_summaries || "This is the first page.",
      scene_description: body.scene_description || "",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const text = completion.choices[0]?.message?.content?.trim() || "";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Page text error:", error);
    return NextResponse.json(
      { error: "Failed to generate page text" },
      { status: 500 }
    );
  }
}
