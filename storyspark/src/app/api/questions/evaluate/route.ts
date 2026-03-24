import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { evaluateResponsePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question_id, question_text, response, required_attributes } = body;

    if (!response || !response.trim()) {
      return NextResponse.json({
        score: 0,
        needs_followup: true,
        followup_question: "Could you add a bit more detail? Even a short description helps create better illustrations.",
      });
    }

    const prompt = evaluateResponsePrompt({
      question_id,
      question_text,
      response,
      required_attributes: required_attributes || [],
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ score: 70, needs_followup: false, followup_question: null });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluate error:", error);
    return NextResponse.json({ score: 70, needs_followup: false, followup_question: null });
  }
}
