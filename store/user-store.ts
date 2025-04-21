import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../type/trip";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // User actions
  updateUser: (updatedUser: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User["preferences"]>) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
}

// Mock user for demo purposes
const mockUser: User = {
  id: "user1",
  name: "Sarah Johnson",
  email: "sarah@example.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
  trips: ["trip1", "trip2", "trip3"],
  savedPosts: [],
  preferences: {
    language: "en",
    currency: "USD",
    notifications: true,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser, // Pre-authenticated for demo
      isAuthenticated: true, // Pre-authenticated for demo
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // In a real app, this would be an API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (email === "sarah@example.com" && password === "password") {
            set({ user: mockUser, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: "Invalid credentials", isLoading: false });
          }
        } catch (error) {
          set({ error: "Login failed", isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      updatePreferences: (preferences) => {
        set((state: any) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  ...preferences,
                },
              }
            : null,
        }));
      },

      savePost: (postId) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                savedPosts: [...state.user.savedPosts, postId],
              }
            : null,
        }));
      },

      unsavePost: (postId) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                savedPosts: state.user.savedPosts.filter((id) => id !== postId),
              }
            : null,
        }));
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
