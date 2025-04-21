import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateAssistantResponse } from '@/mocks/assistant';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

interface AssistantState {
  messages: Message[];
  isProcessing: boolean;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: generateId(),
          content: "Hello! I'm your travel assistant. How can I help you with your trip today?",
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        }
      ],
      isProcessing: false,
      
      sendMessage: async (content) => {
        // Add user message
        const userMessageId = generateId();
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: userMessageId,
              content,
              sender: 'user',
              timestamp: new Date().toISOString(),
            }
          ],
          isProcessing: true,
        }));
        
        try {
          // Get assistant response
          const response = await generateAssistantResponse(content);
          
          // Add assistant message
          set((state) => ({
            messages: [
              ...state.messages,
              {
                id: generateId(),
                content: response,
                sender: 'assistant',
                timestamp: new Date().toISOString(),
              }
            ],
            isProcessing: false,
          }));
        } catch (error) {
          // Add error message
          set((state) => ({
            messages: [
              ...state.messages,
              {
                id: generateId(),
                content: "I'm sorry, I couldn't process your request. Please try again later.",
                sender: 'assistant',
                timestamp: new Date().toISOString(),
              }
            ],
            isProcessing: false,
          }));
        }
      },
      
      clearMessages: () => {
        set({
          messages: [
            {
              id: generateId(),
              content: "Hello! I'm your travel assistant. How can I help you with your trip today?",
              sender: 'assistant',
              timestamp: new Date().toISOString(),
            }
          ]
        });
      },
    }),
    {
      name: 'assistant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);