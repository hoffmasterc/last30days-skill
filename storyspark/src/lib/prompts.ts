export function storyOutlinePrompt(inputs: {
  page_count: number;
  audience_age: string;
  theme: string;
  tone: string;
  moral: string;
  main_character: string;
  supporting_characters: string;
  setting: string;
  story_beats: string;
  title: string;
}) {
  const mid = Math.ceil(inputs.page_count / 2);
  return `You are a children's picture book author. Generate a ${inputs.page_count}-page story outline for children aged ${inputs.audience_age}.

Theme: ${inputs.theme}
Tone: ${inputs.tone}
Moral (if any): ${inputs.moral}
Main character: ${inputs.main_character}
Supporting characters: ${inputs.supporting_characters}
Setting: ${inputs.setting}
Story beats from user: ${inputs.story_beats}
Requested title: ${inputs.title}

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "title": "string (use requested title or suggest one if blank)",
  "pages": [
    {
      "page_number": 1,
      "scene_description": "one sentence: what happens and who is present",
      "characters_present": ["character names"],
      "environment": "brief visual description of surroundings"
    }
  ]
}

Structure: pages 1–2 = introduction, pages 3 to ${mid} = rising action, page ${mid + 1} = exciting moment, final 2 pages = resolution and warmth.`;
}

export function pageTextPrompt(inputs: {
  page_number: number;
  page_count: number;
  audience_age: string;
  tone: string;
  previous_summaries: string;
  scene_description: string;
}) {
  return `Write the text for page ${inputs.page_number} of ${inputs.page_count} in a children's picture book. Ages: ${inputs.audience_age}. Tone: ${inputs.tone}.

What happened on previous pages (summary): ${inputs.previous_summaries}
This page: ${inputs.scene_description}

Rules:
- Exactly 1–2 short sentences
- Simple vocabulary, no metaphors
- No dialogue tags unless essential
- End with a sense of forward motion or warmth

Return only the page text. No quotes, no labels.`;
}

export function imagePrompt(inputs: {
  art_style: string;
  color_palette: string;
  main_character: string;
  supporting_characters: string;
  scene_description: string;
  environment: string;
}) {
  const stylePrefix = `Children's picture book illustration, ${inputs.art_style} style, ${inputs.color_palette} color mood, soft lighting, no text in image, friendly expressive characters, consistent character design throughout, clean uncluttered background, safe and warm aesthetic for children ages 3–8`;

  return `${stylePrefix}

Main character visual: ${inputs.main_character}
Supporting characters (if present): ${inputs.supporting_characters}
Scene: ${inputs.scene_description}
Environment: ${inputs.environment}
Composition: single clear focal point, emotionally expressive poses, no text`;
}

export function evaluateResponsePrompt(inputs: {
  question_id: string;
  question_text: string;
  response: string;
  required_attributes: string[];
}) {
  return `You are evaluating a user's response to a children's picture book creation question.

Question: "${inputs.question_text}"
User's response: "${inputs.response}"
Required attributes we're looking for: ${inputs.required_attributes.join(", ")}

Score the response from 0-100 based on:
- Visual descriptor (color, size, pattern): +35 points
- Personality or emotion: +30 points
- Additional detail (action, relationship, name): +20 points
- Minimum length met (> 5 words): +15 points

If the score is below 65, generate a friendly follow-up question that encourages the user to add more detail about the missing attributes. The follow-up should be warm and encouraging, not critical.

Return ONLY a valid JSON object:
{
  "score": <number>,
  "needs_followup": <boolean>,
  "followup_question": "<string or null>"
}`;
}
