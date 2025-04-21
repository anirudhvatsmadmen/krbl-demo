import { Post } from "../type/trip";

const generateId = () => Math.random().toString(36).substring(2, 10);

export const mockPosts: Post[] = [
  {
    id: generateId(),
    userId: "user1",
    userName: "Sarah Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    tripId: "paris123",
    content:
      "Just arrived in Paris! The Eiffel Tower is even more beautiful in person. Can't wait to explore more tomorrow!",
    mediaUrls: [
      "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=2001&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=1974&auto=format&fit=crop",
    ],
    likes: 42,
    comments: 8,
    createdAt: "2023-06-15T18:30:00",
  },
  {
    id: generateId(),
    userId: "user2",
    userName: "Michael Chen",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    tripId: "tokyo456",
    content:
      "Exploring the streets of Tokyo. The blend of traditional and modern architecture is fascinating!",
    mediaUrls: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1988&auto=format&fit=crop",
    ],
    likes: 37,
    comments: 5,
    createdAt: "2023-06-14T12:15:00",
  },
  {
    id: generateId(),
    userId: "user3",
    userName: "Emma Wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    tripId: "bali789",
    content: "Sunset at Bali beach. Pure magic! 🌅 #BaliVibes #Paradise",
    mediaUrls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop",
    ],
    likes: 89,
    comments: 12,
    createdAt: "2023-06-13T19:45:00",
  },
  {
    id: generateId(),
    userId: "user4",
    userName: "David Rodriguez",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    tripId: "nyc101",
    content:
      "New York City never sleeps! Amazing energy in Times Square tonight.",
    mediaUrls: [
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    ],
    likes: 65,
    comments: 9,
    createdAt: "2023-06-12T23:10:00",
  },
  {
    id: generateId(),
    userId: "user5",
    userName: "Olivia Brown",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    tripId: "rome202",
    content:
      "When in Rome, eat gelato! 🍦 Found this amazing little shop near the Trevi Fountain.",
    mediaUrls: [
      "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=2076&auto=format&fit=crop",
    ],
    likes: 53,
    comments: 7,
    createdAt: "2023-06-11T16:20:00",
  },
];
