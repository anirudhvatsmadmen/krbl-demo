export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
];

export const commonPhrases = [
  { id: "1", phrase: "Hello", category: "Greetings" },
  { id: "2", phrase: "Thank you", category: "Courtesy" },
  { id: "3", phrase: "Excuse me", category: "Courtesy" },
  { id: "4", phrase: "Where is the bathroom?", category: "Questions" },
  { id: "5", phrase: "How much does this cost?", category: "Shopping" },
  { id: "6", phrase: "I need help", category: "Emergency" },
  { id: "7", phrase: "I don't understand", category: "Communication" },
  { id: "8", phrase: "Can you speak slower?", category: "Communication" },
  { id: "9", phrase: "Where is the nearest hotel?", category: "Accommodation" },
  { id: "10", phrase: "I would like to order this", category: "Dining" },
];

// Mock translation function (in a real app, this would call an API)
export const translateText = (
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> => {
  // This is a mock function that just returns the original text with a prefix
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just a simple mock translation
      if (toLang === "fr") {
        const translations: Record<string, string> = {
          Hello: "Bonjour",
          "Thank you": "Merci",
          "Excuse me": "Excusez-moi",
          "Where is the bathroom?": "Où sont les toilettes?",
          "How much does this cost?": "Combien ça coûte?",
          "I need help": "J'ai besoin d'aide",
          "I don't understand": "Je ne comprends pas",
          "Can you speak slower?": "Pouvez-vous parler plus lentement?",
          "Where is the nearest hotel?": "Où est l'hôtel le plus proche?",
          "I would like to order this": "Je voudrais commander ceci",
        };
        resolve(translations[text] || `[${toLang}] ${text}`);
      } else if (toLang === "es") {
        const translations: Record<string, string> = {
          Hello: "Hola",
          "Thank you": "Gracias",
          "Excuse me": "Disculpe",
          "Where is the bathroom?": "¿Dónde está el baño?",
          "How much does this cost?": "¿Cuánto cuesta esto?",
          "I need help": "Necesito ayuda",
          "I don't understand": "No entiendo",
          "Can you speak slower?": "¿Puede hablar más despacio?",
          "Where is the nearest hotel?": "¿Dónde está el hotel más cercano?",
          "I would like to order this": "Me gustaría ordenar esto",
        };
        resolve(translations[text] || `[${toLang}] ${text}`);
      } else {
        resolve(`[${toLang}] ${text}`);
      }
    }, 500);
  });
};
