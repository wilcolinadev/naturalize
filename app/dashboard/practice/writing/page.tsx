'use client';

import { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, RotateCcw, Home, Languages, PenTool, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { getCurrentLanguage, setLanguage as saveLanguage } from '@/lib/language-actions';
import { updatePracticeStats } from '@/lib/supabase/users';
import { getTranslations } from '@/lib/translations';
import writingDataEn from '@/lib/writing-sentences.json';
import writingDataEs from '@/lib/writing-sentences-es.json';

type WritingSentence = {
  id: number;
  sentence: string;
  category: string;
  difficulty: string;
};

type AnswerState = {
  input: string;
  isSubmitted: boolean;
  startTime: number;
};

export default function WritingPracticePage() {
  const { supabaseUser, loading, error } = useUserContext();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [currentSentence, setCurrentSentence] = useState<WritingSentence | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentSentenceIds, setRecentSentenceIds] = useState<number[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  const { t } = getTranslations(language);

  // Get storage key for current sentence + language
  const getStorageKey = (sentenceId: number, lang: 'en' | 'es') => {
    return `writing_answer_${sentenceId}_${lang}`;
  };

  // Save answer state to localStorage
  const saveAnswerState = (sentenceId: number, lang: 'en' | 'es', state: AnswerState) => {
    try {
      localStorage.setItem(getStorageKey(sentenceId, lang), JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save answer state:', e);
    }
  };

  // Load answer state from localStorage
  const loadAnswerState = (sentenceId: number, lang: 'en' | 'es'): AnswerState | null => {
    try {
      const stored = localStorage.getItem(getStorageKey(sentenceId, lang));
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error('Failed to load answer state:', e);
      return null;
    }
  };

  // Clear answer state from localStorage
  const clearAnswerState = (sentenceId: number, lang: 'en' | 'es') => {
    try {
      localStorage.removeItem(getStorageKey(sentenceId, lang));
    } catch (e) {
      console.error('Failed to clear answer state:', e);
    }
  };

  useEffect(() => {
    // Load user's language preference and get first sentence
    getCurrentLanguage().then((lang) => {
      setLanguage(lang);
      loadRandomSentence(lang);
    });
    
    // Cleanup function: cancel any ongoing speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When language changes, load the same sentence ID in the new language
  // and restore any saved answer state for that language
  useEffect(() => {
    if (currentSentence) {
      const data = language === 'en' ? writingDataEn : writingDataEs;
      const sentence = data.practiceSentences.find(s => s.id === currentSentence.id);
      if (sentence) {
        setCurrentSentence(sentence);
        
        // Try to load saved state for this sentence + language
        const savedState = loadAnswerState(sentence.id, language);
        if (savedState) {
          // Restore the saved state
          setUserInput(savedState.input);
          setIsSubmitted(savedState.isSubmitted);
          setStartTime(savedState.startTime);
        } else {
          // No saved state, reset for fresh attempt
          setUserInput('');
          setIsSubmitted(false);
          setStartTime(Date.now());
        }
        setShowHint(false);
        setRevealedIndices([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currentSentence?.id]);

  const loadRandomSentence = (lang: 'en' | 'es' = language) => {
    const data = lang === 'en' ? writingDataEn : writingDataEs;
    const sentences = data.practiceSentences;
    
    // Filter out recently shown sentences (last 5) for better variety
    const availableSentences = sentences.filter(s => !recentSentenceIds.includes(s.id));
    
    // If we've filtered out too many, reset and use all sentences
    const sentencePool = availableSentences.length > 0 ? availableSentences : sentences;
    
    // Use Fisher-Yates shuffle for better randomization
    const shuffled = [...sentencePool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedSentence = shuffled[0];
    setCurrentSentence(selectedSentence);
    setStartTime(Date.now());
    
    // Track recent sentences (keep last 5)
    setRecentSentenceIds(prev => {
      const updated = [selectedSentence.id, ...prev];
      return updated.slice(0, 5);
    });
  };

  const handleLanguageToggle = async () => {
    // Save current state before switching
    if (currentSentence && isSubmitted) {
      saveAnswerState(currentSentence.id, language, {
        input: userInput,
        isSubmitted: true,
        startTime: startTime
      });
    }
    
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
    
    // The useEffect will handle loading the saved state or resetting
  };

  const playSentence = () => {
    if (!currentSentence || isPlaying) return;
    
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentSentence.sentence);
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES';
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.volume = 1.0;
    
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPlaying(false);
    };
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const normalizeText = (text: string): string => {
    // Remove extra spaces, normalize punctuation, convert to lowercase for comparison
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?;:]/g, '');
  };

  const calculateSimilarity = (input: string, correct: string): number => {
    const normalizedInput = normalizeText(input);
    const normalizedCorrect = normalizeText(correct);
    
    if (normalizedInput === normalizedCorrect) return 100;
    
    // Calculate word-by-word accuracy
    const inputWords = normalizedInput.split(' ');
    const correctWords = normalizedCorrect.split(' ');
    
    let matches = 0;
    const maxLength = Math.max(inputWords.length, correctWords.length);
    
    for (let i = 0; i < Math.min(inputWords.length, correctWords.length); i++) {
      if (inputWords[i] === correctWords[i]) {
        matches++;
      }
    }
    
    return Math.round((matches / maxLength) * 100);
  };

  const highlightDifferences = () => {
    if (!currentSentence || !userInput) return null;
    
    const inputWords = userInput.toLowerCase().trim().split(/\s+/);
    const correctWords = currentSentence.sentence.toLowerCase().trim().split(/\s+/);
    
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <span className="text-sm text-muted-foreground mr-2">{t('writingTest.yourAnswer')}</span>
          {inputWords.map((word, i) => {
            const isCorrect = correctWords[i] && normalizeText(word) === normalizeText(correctWords[i]);
            return (
              <span
                key={i}
                className={`px-2 py-1 rounded text-sm ${
                  isCorrect
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!userInput.trim() || !currentSentence || !supabaseUser) return;
    
    setIsSubmitted(true);
    
    const similarity = calculateSimilarity(userInput, currentSentence.sentence);
    const timeSpentMinutes = (Date.now() - startTime) / (1000 * 60);
    
    // Save the submitted state
    saveAnswerState(currentSentence.id, language, {
      input: userInput,
      isSubmitted: true,
      startTime: startTime
    });
    
    // Track practice stats
    await updatePracticeStats(supabaseUser.auth0_id, {
      quick_questions_answered: 1,
      total_study_time_minutes: timeSpentMinutes,
      score_percentage: similarity
    });
  };

  const handleNextSentence = () => {
    // Clear saved states for current sentence in both languages
    if (currentSentence) {
      clearAnswerState(currentSentence.id, 'en');
      clearAnswerState(currentSentence.id, 'es');
    }
    
    loadRandomSentence();
    setUserInput('');
    setIsSubmitted(false);
    setShowHint(false);
    setRevealedIndices([]);
  };

  const getAccuracy = () => {
    if (!currentSentence || !userInput) return 0;
    return calculateSimilarity(userInput, currentSentence.sentence);
  };

  const isPassing = () => getAccuracy() >= 80;

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('writingTest.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !supabaseUser) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{t('writingTest.error')}</p>
            <Link href="/dashboard/practice" className="text-primary hover:underline">
              {t('writingTest.backToPractice')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No sentence loaded yet
  if (!currentSentence) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('writingTest.loadingSentence')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <PenTool className="h-8 w-8" />
          {t('writingTest.title')}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
          >
            <Languages className="h-4 w-4" />
            <span className="text-sm font-medium">{language === 'en' ? 'ES' : 'EN'}</span>
          </button>
          <Link 
            href="/dashboard/practice"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            {t('writingTest.backToPractice')}
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h2 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">{t('writingTest.instructions.title')}</h2>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
          <li>{t('writingTest.instructions.step1')}</li>
          <li>{t('writingTest.instructions.step2')}</li>
          <li>{t('writingTest.instructions.step3')}</li>
          <li>{t('writingTest.instructions.step4')}</li>
        </ol>
      </div>

      {/* Practice Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm">
        <div className="p-6">
          {/* Audio Playback */}
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={playSentence}
              disabled={isPlaying}
              className="flex items-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-4 rounded-lg font-medium transition-colors disabled:opacity-50 text-lg"
            >
              <Volume2 className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying ? t('writingTest.playing') : t('writingTest.playSentence')}
            </button>
          </div>

          {/* Hint Button */}
          {!isSubmitted && (
            <div className="flex justify-center mb-4">
              <button
                onClick={() => {
                  if (!showHint && currentSentence) {
                    // Reveal random letters from the middle section (20%-80% of sentence)
                    const sentence = currentSentence.sentence;
                    const startPos = Math.floor(sentence.length * 0.2);
                    const endPos = Math.floor(sentence.length * 0.8);
                    const middleRange = endPos - startPos;
                    
                    // Reveal 20-30% of the middle section, with minimum of 2 letters
                    const revealCount = Math.max(2, Math.floor(middleRange * 0.25));
                    const revealed: number[] = [];
                    
                    // Safety check: prevent infinite loop on very short sentences
                    let attempts = 0;
                    const maxAttempts = sentence.length * 2;
                    
                    while (revealed.length < revealCount && attempts < maxAttempts) {
                      const randomPos = startPos + Math.floor(Math.random() * middleRange);
                      if (!revealed.includes(randomPos) && sentence[randomPos] !== ' ') {
                        revealed.push(randomPos);
                      }
                      attempts++;
                    }
                    
                    setRevealedIndices(revealed.sort((a, b) => a - b));
                  } else {
                    setRevealedIndices([]);
                  }
                  setShowHint(!showHint);
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? t('writingTest.hideHint') : t('writingTest.showHint')}
              </button>
            </div>
          )}

          {/* Hint Display */}
          {showHint && !isSubmitted && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <span className="font-semibold">{t('writingTest.category')}:</span> {currentSentence.category} • 
                <span className="font-semibold ml-2">{t('writingTest.wordCount')}:</span> {currentSentence.sentence.split(' ').length} {t('writingTest.words')}
              </p>
            </div>
          )}

          {/* Letter-by-Letter Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-4">
              {t('writingTest.writePrompt')}
            </label>
            <div className="flex flex-wrap gap-1 mb-4 justify-center max-w-full overflow-x-auto">
              {currentSentence.sentence.split('').map((char, index) => {
                const userChar = userInput[index] || '';
                const isSpace = char === ' ';
                const isRevealed = showHint && revealedIndices.includes(index);
                const isCorrect = isSubmitted && userChar.toLowerCase() === char.toLowerCase();
                const isIncorrect = isSubmitted && userChar && userChar.toLowerCase() !== char.toLowerCase();
                
                return (
                  <div
                    key={`${currentSentence.id}-${index}`}
                    className={`
                      ${isSpace ? 'w-2 sm:w-3' : 'w-7 h-10 sm:w-8 sm:h-12'}
                      flex items-center justify-center
                      ${!isSpace && 'border-2 rounded'}
                      ${!isSpace && !isSubmitted && !isRevealed && 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}
                      ${!isSpace && isRevealed && !isSubmitted && 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'}
                      ${!isSpace && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-900/20'}
                      ${!isSpace && isIncorrect && 'border-red-500 bg-red-50 dark:bg-red-900/20'}
                      text-base sm:text-lg font-mono
                      transition-colors
                      flex-shrink-0
                    `}
                    role="presentation"
                    aria-label={!isSpace ? `Letter ${index + 1}` : undefined}
                  >
                    {!isSpace && (
                      <span className={`
                        ${isRevealed ? 'text-yellow-700 dark:text-yellow-300 font-semibold' : ''}
                        ${isCorrect ? 'text-green-700 dark:text-green-300' : ''}
                        ${isIncorrect ? 'text-red-700 dark:text-red-300' : ''}
                      `}>
                        {isRevealed ? char : (isSubmitted ? (userChar || '_') : (userChar || ''))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => {
                const newValue = e.target.value;
                // Limit to sentence length
                if (newValue.length <= currentSentence.sentence.length) {
                  setUserInput(newValue);
                }
              }}
              disabled={isSubmitted}
              placeholder={t('writingTest.typePlaceholder')}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted text-base sm:text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isSubmitted && userInput.trim()) {
                  handleSubmit();
                }
              }}
              maxLength={currentSentence.sentence.length}
              autoFocus
              aria-label={t('writingTest.writePrompt')}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('writingTest.checkAnswer')}
            </button>
          )}

          {/* Results */}
          {isSubmitted && (
            <div className="space-y-4">
              {/* Accuracy Score */}
              <div className={`p-4 rounded-lg border ${
                isPassing()
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold flex items-center gap-2 ${
                    isPassing() ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {isPassing() ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        {t('writingTest.greatJob')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        {t('writingTest.keepPracticing')}
                      </>
                    )}
                  </span>
                  <span className={`text-2xl font-bold ${
                    isPassing() ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {getAccuracy()}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isPassing() 
                    ? t('writingTest.passMessage')
                    : t('writingTest.failMessage')}
                </p>
              </div>

              {/* Word-by-word comparison */}
              {getAccuracy() < 100 && highlightDifferences()}

              {/* Correct Answer */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{t('writingTest.correctAnswer')}</p>
                <p className="text-lg font-medium">{currentSentence.sentence}</p>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextSentence}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                {t('writingTest.nextSentence')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {t('writingTest.tipsTitle')}
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>{t('writingTest.tips.tip1')}</li>
          <li>{t('writingTest.tips.tip2')}</li>
          <li>{t('writingTest.tips.tip3')}</li>
          <li>{t('writingTest.tips.tip4')}</li>
          <li>{t('writingTest.tips.tip5')}</li>
        </ul>
      </div>
    </div>
  );
}

