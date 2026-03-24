import { create } from "zustand";

export interface BookInputs {
  page_count?: string;
  audience_age?: string;
  tone?: string;
  theme?: string;
  moral?: string;
  main_character?: string;
  supporting_characters?: string;
  setting?: string;
  art_style?: string;
  color_palette?: string;
  story_beats?: string;
  title?: string;
  [key: string]: string | undefined;
}

export interface PageData {
  page_number: number;
  text: string;
  image_base64: string;
}

export interface GenerationStatus {
  stage: "idle" | "outline" | "text" | "images" | "saving" | "complete" | "error";
  currentPage?: number;
  totalPages?: number;
  message: string;
}

interface BookStore {
  currentStep: number;
  inputs: BookInputs;
  followUpCounts: Record<string, number>;
  followUpQuestion: string | null;
  pages: PageData[];
  bookTitle: string;
  bookId: string | null;
  generationStatus: GenerationStatus;
  slideDirection: "left" | "right";

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setInput: (key: string, value: string) => void;
  setFollowUp: (questionId: string, question: string | null) => void;
  incrementFollowUpCount: (questionId: string) => void;
  getFollowUpCount: (questionId: string) => number;
  setPages: (pages: PageData[]) => void;
  setBookTitle: (title: string) => void;
  setBookId: (id: string) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setSlideDirection: (dir: "left" | "right") => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  inputs: {},
  followUpCounts: {},
  followUpQuestion: null,
  pages: [],
  bookTitle: "",
  bookId: null,
  generationStatus: { stage: "idle" as const, message: "" },
  slideDirection: "right" as const,
};

export const useBookStore = create<BookStore>((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => {
    set({ slideDirection: "right", currentStep: get().currentStep + 1, followUpQuestion: null });
  },
  prevStep: () => {
    if (get().currentStep > 0) {
      set({ slideDirection: "left", currentStep: get().currentStep - 1, followUpQuestion: null });
    }
  },
  setInput: (key, value) =>
    set({ inputs: { ...get().inputs, [key]: value } }),
  setFollowUp: (questionId, question) =>
    set({ followUpQuestion: question }),
  incrementFollowUpCount: (questionId) => {
    const counts = { ...get().followUpCounts };
    counts[questionId] = (counts[questionId] || 0) + 1;
    set({ followUpCounts: counts });
  },
  getFollowUpCount: (questionId) => get().followUpCounts[questionId] || 0,
  setPages: (pages) => set({ pages }),
  setBookTitle: (title) => set({ bookTitle: title }),
  setBookId: (id) => set({ bookId: id }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setSlideDirection: (dir) => set({ slideDirection: dir }),
  reset: () => set(initialState),
}));
