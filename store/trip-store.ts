import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip, Activity, Document, Announcement, Post } from "../type/trip";
import { mockTrips } from "../mocks/trip";
import { mockPosts } from "@/mocks/social";

interface TripState {
  trips: Trip[];
  currentTripId: string | null;
  posts: Post[];
  isLoading: boolean;
  error: string | null;

  // Trip actions
  setCurrentTrip: (tripId: string) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updatedTrip: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;

  // Activity actions
  addActivity: (tripId: string, activity: Activity) => void;
  updateActivity: (
    tripId: string,
    activityId: string,
    updatedActivity: Partial<Activity>
  ) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  toggleActivityCompletion: (tripId: string, activityId: string) => void;

  // Document actions
  addDocument: (tripId: string, document: Document) => void;
  updateDocument: (
    tripId: string,
    documentId: string,
    updatedDocument: Partial<Document>
  ) => void;
  deleteDocument: (tripId: string, documentId: string) => void;

  // Announcement actions
  addAnnouncement: (tripId: string, announcement: Announcement) => void;
  updateAnnouncement: (
    tripId: string,
    announcementId: string,
    updatedAnnouncement: Partial<Announcement>
  ) => void;
  deleteAnnouncement: (tripId: string, announcementId: string) => void;

  // Social actions
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  deletePost: (postId: string) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: mockTrips,
      currentTripId: mockTrips.length > 0 ? mockTrips[0].id : null,
      posts: mockPosts,
      isLoading: false,
      error: null,

      // Trip actions
      setCurrentTrip: (tripId) => set({ currentTripId: tripId }),

      addTrip: (trip) =>
        set((state) => ({
          trips: [...state.trips, trip],
          currentTripId: trip.id,
        })),

      updateTrip: (tripId, updatedTrip) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, ...updatedTrip } : trip
          ),
        })),

      deleteTrip: (tripId) =>
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== tripId),
          currentTripId:
            state.currentTripId === tripId
              ? state.trips.length > 1
                ? state.trips.find((t) => t.id !== tripId)?.id || null
                : null
              : state.currentTripId,
        })),

      // Activity actions
      addActivity: (tripId, activity) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? { ...trip, activities: [...trip.activities, activity] }
              : trip
          ),
        })),

      updateActivity: (tripId, activityId, updatedActivity) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  activities: trip.activities.map((activity) =>
                    activity.id === activityId
                      ? { ...activity, ...updatedActivity }
                      : activity
                  ),
                }
              : trip
          ),
        })),

      deleteActivity: (tripId, activityId) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  activities: trip.activities.filter(
                    (activity) => activity.id !== activityId
                  ),
                }
              : trip
          ),
        })),

      toggleActivityCompletion: (tripId, activityId) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  activities: trip.activities.map((activity) =>
                    activity.id === activityId
                      ? { ...activity, completed: !activity.completed }
                      : activity
                  ),
                }
              : trip
          ),
        })),

      // Document actions
      addDocument: (tripId, document) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? { ...trip, documents: [...trip.documents, document] }
              : trip
          ),
        })),

      updateDocument: (tripId, documentId, updatedDocument) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  documents: trip.documents.map((document) =>
                    document.id === documentId
                      ? { ...document, ...updatedDocument }
                      : document
                  ),
                }
              : trip
          ),
        })),

      deleteDocument: (tripId, documentId) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  documents: trip.documents.filter(
                    (document) => document.id !== documentId
                  ),
                }
              : trip
          ),
        })),

      // Announcement actions
      addAnnouncement: (tripId, announcement) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  announcements: [...trip.announcements, announcement],
                }
              : trip
          ),
        })),

      updateAnnouncement: (tripId, announcementId, updatedAnnouncement) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  announcements: trip.announcements.map((announcement) =>
                    announcement.id === announcementId
                      ? { ...announcement, ...updatedAnnouncement }
                      : announcement
                  ),
                }
              : trip
          ),
        })),

      deleteAnnouncement: (tripId, announcementId) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  announcements: trip.announcements.filter(
                    (announcement) => announcement.id !== announcementId
                  ),
                }
              : trip
          ),
        })),

      // Social actions
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      likePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          ),
        })),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
    }),
    {
      name: "trip-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
