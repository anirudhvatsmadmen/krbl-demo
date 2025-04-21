import { Trip, Activity, Document, Announcement } from "../type/trip";

const generateId = () => Math.random().toString(36).substring(2, 10);

export const mockActivities: Activity[] = [
  {
    id: generateId(),
    title: "Flight to Paris",
    description: "Air France AF1234",
    startTime: "2023-06-15T08:30:00",
    endTime: "2023-06-15T10:45:00",
    category: "transportation",
    completed: true,
    bookingReference: "AF1234567",
    cost: 450,
    currency: "USD",
  },
  {
    id: generateId(),
    title: "Check-in at Hotel de Ville",
    description: "Luxury room with Eiffel Tower view",
    startTime: "2023-06-15T14:00:00",
    endTime: "2023-06-15T15:00:00",
    category: "accommodation",
    completed: true,
    bookingReference: "HV78901",
    cost: 1200,
    currency: "EUR",
  },
  {
    id: generateId(),
    title: "Eiffel Tower Visit",
    description: "Skip the line tickets",
    startTime: "2023-06-16T10:00:00",
    endTime: "2023-06-16T13:00:00",
    category: "sightseeing",
    completed: false,
    cost: 25,
    currency: "EUR",
  },
  {
    id: generateId(),
    title: "Dinner at Le Jules Verne",
    description: "Michelin star restaurant at the Eiffel Tower",
    startTime: "2023-06-16T20:00:00",
    endTime: "2023-06-16T22:30:00",
    category: "food",
    completed: false,
    bookingReference: "JV4567",
    cost: 300,
    currency: "EUR",
  },
  {
    id: generateId(),
    title: "Louvre Museum",
    description: "Guided tour of the main exhibits",
    startTime: "2023-06-17T09:00:00",
    endTime: "2023-06-17T12:00:00",
    category: "sightseeing",
    completed: false,
    cost: 45,
    currency: "EUR",
  },
];

export const mockDocuments: Document[] = [
  {
    id: generateId(),
    title: "Passport",
    type: "passport",
    expiryDate: "2028-05-20",
    notes: "Keep a digital copy in case of loss",
  },
  {
    id: generateId(),
    title: "Travel Insurance",
    type: "insurance",
    expiryDate: "2023-06-25",
    notes: "Policy number: TI789456123",
  },
  {
    id: generateId(),
    title: "Hotel Reservation",
    type: "reservation",
    notes: "Confirmation number: HV78901",
  },
  {
    id: generateId(),
    title: "Return Flight Ticket",
    type: "ticket",
    notes: "Air France AF4321, June 22, 2023",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: generateId(),
    title: "Welcome to Paris!",
    content:
      "We hope you enjoy your stay in the city of lights. Check the itinerary for exciting activities!",
    createdAt: "2023-06-15T07:00:00",
    priority: "medium",
    author: "Trip Organizer",
  },
  {
    id: generateId(),
    title: "Weather Alert",
    content:
      "Expect light rain tomorrow afternoon. Don't forget to pack an umbrella!",
    createdAt: "2023-06-15T18:30:00",
    priority: "high",
    author: "Weather Service",
  },
  {
    id: generateId(),
    title: "Restaurant Recommendation",
    content:
      'Try the local bistro "Le Petit Parisien" near the hotel. Great authentic French cuisine!',
    createdAt: "2023-06-16T08:15:00",
    priority: "low",
    author: "Local Guide",
  },
];

export const mockTrips: Trip[] = [
  {
    id: generateId(),
    title: "Paris Adventure",
    description: "Exploring the city of lights",
    startDate: "2023-06-15",
    endDate: "2023-06-22",
    coverImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    destination: {
      id: generateId(),
      name: "Paris",
      country: "France",
      city: "Paris",
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    },
    activities: mockActivities,
    documents: mockDocuments,
    announcements: mockAnnouncements,
    participants: ["user1", "user2"],
    budget: {
      total: 3000,
      spent: 2020,
      currency: "EUR",
    },
    isActive: true,
  },
  {
    id: generateId(),
    title: "Tokyo Exploration",
    description: "Discovering Japanese culture and cuisine",
    startDate: "2023-08-10",
    endDate: "2023-08-20",
    coverImage:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop",
    destination: {
      id: generateId(),
      name: "Tokyo",
      country: "Japan",
      city: "Tokyo",
      coordinates: {
        latitude: 35.6762,
        longitude: 139.6503,
      },
    },
    activities: [],
    documents: [],
    announcements: [],
    participants: ["user1"],
    budget: {
      total: 4500,
      spent: 0,
      currency: "USD",
    },
    isActive: false,
  },
  {
    id: generateId(),
    title: "New York City Weekend",
    description: "Quick getaway to the Big Apple",
    startDate: "2023-07-21",
    endDate: "2023-07-23",
    coverImage:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    destination: {
      id: generateId(),
      name: "New York",
      country: "United States",
      city: "New York",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    activities: [],
    documents: [],
    announcements: [],
    participants: ["user1", "user3"],
    budget: {
      total: 1500,
      spent: 0,
      currency: "USD",
    },
    isActive: false,
  },
];
