import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { storyOutlinePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const inputs = await req.json();

    const prompt = storyOutlinePrompt({
      page_count: parseInt(inputs.page_count) || 7,
      audience_age: inputs.audience_age || "5-6",
      theme: inputs.theme || "",
      tone: inputs.tone || "Playful",
      moral: inputs.moral || "None specified",
      main_character: inputs.main_character || "",
      supporting_characters: inputs.supporting_characters || "None",
      setting: inputs.setting || "",
      story_beats: inputs.story_beats || "",
      title: inputs.title || "",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse story outline" }, { status: 500 });
    }

    const outline = JSON.parse(jsonMatch[0]);
    return NextResponse.json(outline);
  } catch (error) {
    console.error("Story generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate story outline" },
      { status: 500 }
    );
  }
}
