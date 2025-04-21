import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  translateText,
  supportedLanguages,
  commonPhrases,
} from "@/mocks/translations";

interface TranslatorState {
  sourceLanguage: string;
  targetLanguage: string;
  recentTranslations: {
    id: string;
    sourceText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: string;
  }[];
  favoriteTranslations: string[]; // IDs of favorite translations
  isTranslating: boolean;

  // Actions
  setSourceLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;
  translateText: (text: string) => Promise<string>;
  addToFavorites: (translationId: string) => void;
  removeFromFavorites: (translationId: string) => void;
  clearHistory: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useTranslatorStore = create<TranslatorState>()(
  persist(
    (set, get) => ({
      sourceLanguage: "en",
      targetLanguage: "fr",
      recentTranslations: [],
      favoriteTranslations: [],
      isTranslating: false,

      setSourceLanguage: (language) => set({ sourceLanguage: language }),

      setTargetLanguage: (language) => set({ targetLanguage: language }),

      translateText: async (text) => {
        set({ isTranslating: true });

        try {
          const { sourceLanguage, targetLanguage } = get();
          const translatedText = await translateText(
            text,
            sourceLanguage,
            targetLanguage
          );

          const translationId = generateId();

          set((state) => ({
            recentTranslations: [
              {
                id: translationId,
                sourceText: text,
                translatedText,
                sourceLanguage,
                targetLanguage,
                timestamp: new Date().toISOString(),
              },
              ...state.recentTranslations.slice(0, 19), // Keep only the 20 most recent
            ],
            isTranslating: false,
          }));

          return translatedText;
        } catch (error) {
          set({ isTranslating: false });
          throw error;
        }
      },

      addToFavorites: (translationId) =>
        set((state) => ({
          favoriteTranslations: [...state.favoriteTranslations, translationId],
        })),

      removeFromFavorites: (translationId) =>
        set((state) => ({
          favoriteTranslations: state.favoriteTranslations.filter(
            (id) => id !== translationId
          ),
        })),

      clearHistory: () => set({ recentTranslations: [] }),
    }),
    {
      name: "translator-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
