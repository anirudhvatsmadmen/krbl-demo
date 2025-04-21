import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { ArrowDownUp, Bookmark, Copy } from "lucide-react-native";
import Colors from '../constants/Colors';

interface TranslationCardProps {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
  isFavorite?: boolean;
  onCopy?: () => void;
  onToggleFavorite?: () => void;
  onSwapLanguages?: () => void;
}

const TranslationCard: React.FC<TranslationCardProps> = ({
  sourceText,
  translatedText,
  sourceLanguage,
  targetLanguage,
  timestamp,
  isFavorite = false,
  onCopy,
  onToggleFavorite,
  onSwapLanguages,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      fr: "French",
      es: "Spanish",
      de: "German",
      it: "Italian",
      ja: "Japanese",
      zh: "Chinese",
      ru: "Russian",
      ar: "Arabic",
      pt: "Portuguese",
    };

    return languages[code] || code;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.languageRow}>
          <Text style={styles.languageText}>
            {getLanguageName(sourceLanguage)}
          </Text>

          <TouchableOpacity style={styles.swapButton} onPress={onSwapLanguages}>
            <ArrowDownUp size={16} color={Colors.primary} />
          </TouchableOpacity>

          <Text style={styles.languageText}>
            {getLanguageName(targetLanguage)}
          </Text>
        </View>

        <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.sourceText}>{sourceText}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.textContainer}>
          <Text style={styles.translatedText}>{translatedText}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCopy}>
          <Copy size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Copy</Text>
        </TouchableOpacity>

        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onToggleFavorite}
          >
            <Bookmark
              size={18}
              color={isFavorite ? Colors.primary : Colors.textSecondary}
              fill={isFavorite ? Colors.primary : Colors.transparent}
            />
            <Text
              style={[
                styles.actionText,
                isFavorite && { color: Colors.primary },
              ]}
            >
              {isFavorite ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  swapButton: {
    padding: 4,
    marginHorizontal: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contentContainer: {
    marginBottom: 12,
  },
  textContainer: {
    padding: 12,
  },
  sourceText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  translatedText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.primary,
  },
});

export default TranslationCard;
