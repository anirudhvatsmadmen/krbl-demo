import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowDownUp, Mic, Send, X } from 'lucide-react-native';
import { useTranslatorStore } from '@/store/translator-store';
import { supportedLanguages, commonPhrases } from '@/mocks/translations';
import TranslationCard from '@/components/TranslationCard';
import Colors from '../constants/Colors';

export default function TranslatorScreen() {
  const router = useRouter();
  const { 
    sourceLanguage, 
    targetLanguage, 
    setSourceLanguage, 
    setTargetLanguage, 
    translateText, 
    recentTranslations, 
    favoriteTranslations, 
    addToFavorites, 
    removeFromFavorites, 
    isTranslating 
  } = useTranslatorStore();
  
  const [inputText, setInputText] = useState('');
  
  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };
  
  const handleTranslate = async () => {
    if (inputText.trim() === '') return;
    
    try {
      await translateText(inputText.trim());
      setInputText('');
    } catch (error) {
      console.error('Translation error:', error);
    }
  };
  
  const handleVoiceInput = () => {
    // In a real app, this would trigger voice recognition
    console.log('Voice input triggered');
  };
  
  const handleCopyTranslation = (text: string) => {
    // In a real app, this would copy to clipboard
    console.log('Copied to clipboard:', text);
  };
  
  const handleToggleFavorite = (translationId: string) => {
    if (favoriteTranslations.includes(translationId)) {
      removeFromFavorites(translationId);
    } else {
      addToFavorites(translationId);
    }
  };
  
  const handlePhrasePress = (phrase: string) => {
    setInputText(phrase);
  };
  
  const getLanguageName = (code: string) => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Translator' }} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.languageSelector}>
          <TouchableOpacity 
            style={styles.languageButton}
            // onPress={() => router.push(('/translator/select-language?type=source'))}
            
          >
            <Text style={styles.languageCode}>{sourceLanguage.toUpperCase()}</Text>
            <Text style={styles.languageName}>{getLanguageName(sourceLanguage)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapLanguages}
          >
            <ArrowDownUp size={20} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.languageButton}
            // onPress={() => router.push('/translator/select-language?type=target')}
          >
            <Text style={styles.languageCode}>{targetLanguage.toUpperCase()}</Text>
            <Text style={styles.languageName}>{getLanguageName(targetLanguage)}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Enter text in ${getLanguageName(sourceLanguage)}`}
            placeholderTextColor={Colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          {inputText.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setInputText('')}
            >
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.voiceButton}
            onPress={handleVoiceInput}
          >
            <Mic size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.translateButton,
              (inputText.trim() === '' || isTranslating) && styles.disabledButton
            ]}
            onPress={handleTranslate}
            disabled={inputText.trim() === '' || isTranslating}
          >
            {isTranslating ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Send size={20} color={Colors.white} />
                <Text style={styles.translateButtonText}>Translate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.phrasesContainer}>
          <Text style={styles.sectionTitle}>Common Phrases</Text>
          <FlatList
            data={commonPhrases}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.phraseButton}
                onPress={() => handlePhrasePress(item.phrase)}
              >
                <Text style={styles.phraseText}>{item.phrase}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.phrasesList}
          />
        </View>
        
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Translations</Text>
          
          {recentTranslations.length > 0 ? (
            <FlatList
              data={recentTranslations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TranslationCard
                  sourceText={item.sourceText}
                  translatedText={item.translatedText}
                  sourceLanguage={item.sourceLanguage}
                  targetLanguage={item.targetLanguage}
                  timestamp={item.timestamp}
                  isFavorite={favoriteTranslations.includes(item.id)}
                  onCopy={() => handleCopyTranslation(item.translatedText)}
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                />
              )}
              contentContainerStyle={styles.translationsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Your translations will appear here
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  languageCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  languageName: {
    fontSize: 14,
    color: Colors.text,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  translateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: Colors.lightGray,
  },
  translateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  phrasesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  phrasesList: {
    paddingRight: 16,
  },
  phraseButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  phraseText: {
    fontSize: 14,
    color: Colors.text,
  },
  historyContainer: {
    flex: 1,
    padding: 16,
  },
  translationsList: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});