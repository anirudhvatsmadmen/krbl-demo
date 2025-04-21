export const assistantResponses = [
  {
    query: "What should I pack for Paris?",
    response:
      "For Paris, I recommend packing comfortable walking shoes, a light jacket (even in summer), an umbrella, adaptors for European outlets, and a small daypack. Don't forget your camera and a portable charger for sightseeing days!",
  },
  {
    query: "Best time to visit the Eiffel Tower?",
    response:
      "The best time to visit the Eiffel Tower is either early morning (around 9 AM) or in the evening after 7 PM to avoid the largest crowds. For a magical experience, visit at sunset and stay to see the tower sparkle on the hour after dark.",
  },
  {
    query: "Local transportation in Tokyo?",
    response:
      "Tokyo has an excellent public transportation system. The metro and JR lines cover most of the city. Consider getting a SUICA or PASMO card for convenient travel. Taxis are clean and reliable but expensive. Avoid rush hour (7:30-9:00 AM and 5:30-7:00 PM) if possible.",
  },
  {
    query: "Restaurant recommendations in New York?",
    response:
      "New York offers incredible dining options! For pizza, try Joe's Pizza in Greenwich Village. For a special dinner, consider Gramercy Tavern or Le Bernardin. Chelsea Market has great food stalls for casual dining. Don't miss trying a classic New York bagel from Ess-a-Bagel or Russ & Daughters!",
  },
  {
    query: "What's the weather like in Bali in June?",
    response:
      "June is a great time to visit Bali! It's in the dry season with average temperatures between 23-31°C (73-88°F). You can expect sunny days with low humidity and very little rainfall. Perfect for beach activities and exploring the island.",
  },
];

export const generateAssistantResponse = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to find a matching query
      const matchingResponse = assistantResponses.find(
        (item) =>
          item.query.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(item.query.toLowerCase())
      );

      if (matchingResponse) {
        resolve(matchingResponse.response);
      } else {
        // Generic responses if no match found
        const genericResponses = [
          "I'm searching for information about that. In the meantime, you might want to check the trip itinerary for details.",
          "That's a great question! I recommend checking local guides or asking at your hotel's concierge desk for the most up-to-date information.",
          "I don't have specific information about that yet, but I can help you research it. Would you like me to add a reminder to your trip planner?",
          "Based on your trip details, I'd suggest looking into local options when you arrive. Would you like me to add this to your trip notes?",
          "I'm still learning about that destination. For now, I'd recommend checking travel blogs or guidebooks for the most accurate information.",
        ];

        const randomIndex = Math.floor(Math.random() * genericResponses.length);
        resolve(genericResponses[randomIndex]);
      }
    }, 1000);
  });
};
