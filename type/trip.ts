export interface Location {
  id: string;
  name: string;
  country: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  location?: Location;
  startTime: string;
  endTime: string;
  cost?: number;
  currency?: string;
  bookingReference?: string;
  category:
    | "accommodation"
    | "transportation"
    | "sightseeing"
    | "food"
    | "event"
    | "other";
  completed: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: "passport" | "visa" | "ticket" | "reservation" | "insurance" | "other";
  expiryDate?: string;
  fileUri?: string;
  notes?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  tripId: string;
  content: string;
  mediaUrls: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
  author: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  destination: Location;
  activities: Activity[];
  documents: Document[];
  announcements: Announcement[];
  participants: string[];
  budget?: {
    total: number;
    spent: number;
    currency: string;
  };
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  trips: string[];
  savedPosts: string[];
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
}
