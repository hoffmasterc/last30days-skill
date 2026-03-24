export interface QuestionConfig {
  id: string;
  type: "multiple_choice" | "open_ended";
  question: string;
  hint: string;
  options?: { value: string; label: string; icon?: string }[];
  required_attributes?: string[];
  optional?: boolean;
  placeholder?: string;
}

export const QUESTIONS: QuestionConfig[] = [
  {
    id: "page_count",
    type: "multiple_choice",
    question: "How long should your book be?",
    hint: "Shorter books work well for younger readers. Longer books allow for more detailed stories.",
    options: [
      { value: "5", label: "5 pages", icon: "📖" },
      { value: "7", label: "7 pages", icon: "📚" },
      { value: "10", label: "10 pages", icon: "📕" },
    ],
  },
  {
    id: "audience_age",
    type: "multiple_choice",
    question: "Who is this book for?",
    hint: "This helps us adjust vocabulary and sentence complexity to match the reader's level.",
    options: [
      { value: "3-4", label: "Ages 3–4", icon: "🧸" },
      { value: "5-6", label: "Ages 5–6", icon: "🎨" },
      { value: "7-8", label: "Ages 7–8", icon: "🌟" },
    ],
  },
  {
    id: "tone",
    type: "multiple_choice",
    question: "What feeling should the book have?",
    hint: "The tone sets the mood for the entire story — from silly and fun to calm and cozy.",
    options: [
      { value: "Playful", label: "Playful", icon: "🎪" },
      { value: "Adventurous", label: "Adventurous", icon: "🗺️" },
      { value: "Calm", label: "Calm", icon: "🌙" },
      { value: "Funny", label: "Funny", icon: "😄" },
      { value: "Heartwarming", label: "Heartwarming", icon: "💛" },
    ],
  },
  {
    id: "theme",
    type: "open_ended",
    question: "What is the book about?",
    hint: "Describe the main idea or topic. This is the heart of your story!",
    placeholder: "A little fox who is scared of the dark",
    required_attributes: ["subject", "conflict_or_situation"],
  },
  {
    id: "moral",
    type: "open_ended",
    question: "Is there a lesson? (optional — press skip if none)",
    hint: "A moral gives the story a deeper meaning. It's okay to skip this!",
    placeholder: "Being brave means trying even when you're scared",
    optional: true,
  },
  {
    id: "main_character",
    type: "open_ended",
    question: "Describe your main character.",
    hint: "The more detail you give, the better the illustrations will be. Include what they look like and how they act.",
    placeholder: "A small orange fox with big green eyes who is shy but curious",
    required_attributes: ["appearance", "color_or_texture", "personality_or_emotion"],
  },
  {
    id: "supporting_characters",
    type: "open_ended",
    question: "Any other characters? (optional — press skip)",
    hint: "Supporting characters add richness to the story. Describe them like you did the main character.",
    placeholder: "A wise old owl named Theodore",
    optional: true,
  },
  {
    id: "setting",
    type: "open_ended",
    question: "Where does the story take place?",
    hint: "Paint a picture with words! The setting becomes the backdrop for every illustration.",
    placeholder: "A cozy forest at night with glowing mushrooms",
    required_attributes: ["location", "atmosphere_or_detail"],
  },
  {
    id: "art_style",
    type: "multiple_choice",
    question: "Choose an illustration style",
    hint: "This determines the visual look and feel of every page in your book.",
    options: [
      { value: "Watercolor", label: "Watercolor", icon: "🎨" },
      { value: "Cartoon", label: "Cartoon", icon: "✏️" },
      { value: "Classic Storybook", label: "Classic Storybook", icon: "📖" },
      { value: "Minimalist", label: "Minimalist", icon: "◻️" },
      { value: "Crayon", label: "Crayon", icon: "🖍️" },
    ],
  },
  {
    id: "color_palette",
    type: "multiple_choice",
    question: "Choose a color mood",
    hint: "Colors set the emotional tone of the illustrations.",
    options: [
      { value: "Warm & Cozy", label: "Warm & Cozy", icon: "🟠" },
      { value: "Cool & Dreamy", label: "Cool & Dreamy", icon: "🔵" },
      { value: "Bright & Bold", label: "Bright & Bold", icon: "🟡" },
      { value: "Earthy & Natural", label: "Earthy & Natural", icon: "🟤" },
      { value: "Pastel Soft", label: "Pastel Soft", icon: "🩷" },
    ],
  },
  {
    id: "story_beats",
    type: "open_ended",
    question: "What happens in the story? Include a beginning, something exciting, and how it ends.",
    hint: "Think of it as a mini-outline: what happens first, what's the exciting part, and how does it wrap up?",
    placeholder: "Fox gets lost, meets the owl, learns the forest sounds are just crickets, finds home",
    required_attributes: ["beginning", "conflict_or_excitement", "resolution"],
  },
  {
    id: "title",
    type: "open_ended",
    question: "What would you like to call your book?",
    hint: "Leave blank and we'll suggest one based on your story.",
    placeholder: "",
    optional: true,
  },
];
