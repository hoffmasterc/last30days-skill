import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { imagePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = imagePrompt({
      art_style: body.art_style || "Watercolor",
      color_palette: body.color_palette || "Warm & Cozy",
      main_character: body.main_character || "",
      supporting_characters: body.supporting_characters || "None",
      scene_description: body.scene_description || "",
      environment: body.environment || "",
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    const image_base64 = response.data?.[0]?.b64_json || "";
    return NextResponse.json({ image_base64 });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
