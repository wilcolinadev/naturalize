'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, CheckCircle, XCircle, RotateCcw, Home, Languages, FileText, Crown, Lightbulb, Volume2 } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { getCurrentLanguage, setLanguage as saveLanguage } from '@/lib/language-actions';
import { updatePracticeStats, updateUserDailyUsage } from '@/lib/supabase/users';
import { getTranslations } from '@/lib/translations';
import writingDataEn from '@/lib/writing-sentences.json';
import writingDataEs from '@/lib/writing-sentences-es.json';

type ReadingSentence = {
  id: number;
  sentence: string;
  category: string;
  difficulty: string;
};

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export default function ReadingPracticePage() {
  const { supabaseUser, loading, error, refreshUser } = useUserContext();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [currentSentence, setCurrentSentence] = useState<ReadingSentence | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [recentSentenceIds, setRecentSentenceIds] = useState<number[]>([]);
  const [canAnswerQuestions, setCanAnswerQuestions] = useState<boolean>(true);
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isActiveRef = useRef<boolean>(false);
  
  const { t } = getTranslations(language);

  // Memoize loadRandomSentence to avoid recreation
  const loadRandomSentence = useCallback((lang: 'en' | 'es' = language) => {
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
    setTranscript('');
    setIsSubmitted(false);
    setStartTime(Date.now());
    
    // Track recent sentences (keep last 5)
    setRecentSentenceIds(prev => {
      const updated = [selectedSentence.id, ...prev];
      return updated.slice(0, 5);
    });
  }, [language, recentSentenceIds]);

  // Initialize speech recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript = transcriptPart;
        }
      }

      // Update transcript state
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('Speech recognition event:', event.error);
      
      // Only handle critical errors
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert('Microphone permission is required. Please allow microphone access and try again.');
        isActiveRef.current = false;
        setIsListening(false);
      } else if (event.error === 'network') {
        console.error('Network error in speech recognition');
        isActiveRef.current = false;
        setIsListening(false);
      }
      // Ignore: 'no-speech', 'aborted', 'audio-capture' - these are expected
    };

    recognition.onend = () => {
      isActiveRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
    };
  }, [language]); // Only recreate when language changes

  // Load initial sentence
  useEffect(() => {
    const loadData = async () => {
      const lang = await getCurrentLanguage();
      setLanguage(lang);
      loadRandomSentence(lang);
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Check daily limit when user data changes
  useEffect(() => {
    if (supabaseUser) {
      if (supabaseUser.plan === 'free') {
        const today = new Date().toISOString().split('T')[0];
        const isToday = supabaseUser.daily_question_usage.date === today;
        const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
        setCanAnswerQuestions(dailyCount < 10);
      } else {
        setCanAnswerQuestions(true);
      }
    }
  }, [supabaseUser]);

  // Handle language changes for current sentence
  useEffect(() => {
    if (currentSentence && currentSentence.id) {
      const data = language === 'en' ? writingDataEn : writingDataEs;
      const sentence = data.practiceSentences.find(s => s.id === currentSentence.id);
      if (sentence && sentence.sentence !== currentSentence.sentence) {
        setCurrentSentence(sentence);
        setTranscript('');
        setIsSubmitted(false);
        setStartTime(Date.now());
      }
    }
  }, [language, currentSentence]);

  const handleLanguageToggle = async () => {
    // Stop recognition if active before changing language
    if (isActiveRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const startListening = () => {
    if (!recognitionRef.current || !currentSentence || isActiveRef.current) return;
    
    if (supabaseUser?.plan === 'free' && !canAnswerQuestions) {
      return;
    }

    // Clear previous transcript
    setTranscript('');
    
    try {
      isActiveRef.current = true;
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      isActiveRef.current = false;
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isActiveRef.current) return;
    
    isActiveRef.current = false;
    setIsListening(false);
    
    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore stop errors
    }
  };

  const normalizeText = (text: string): string => {
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

  const handleSubmit = async () => {
    if (!transcript.trim() || !currentSentence || !supabaseUser) return;
    
    // Stop listening if still active
    stopListening();
    
    // For free users, check if they've reached the daily limit
    if (supabaseUser.plan === 'free') {
      const today = new Date().toISOString().split('T')[0];
      const isToday = supabaseUser.daily_question_usage.date === today;
      const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
      
      if (dailyCount >= 10) {
        setCanAnswerQuestions(false);
        return;
      }
    }
    
    setIsSubmitted(true);
    
    const similarity = calculateSimilarity(transcript, currentSentence.sentence);
    const timeSpentMinutes = (Date.now() - startTime) / (1000 * 60);
    
    // Track practice stats
    await updatePracticeStats(supabaseUser.auth0_id, {
      quick_questions_answered: 1,
      total_study_time_minutes: timeSpentMinutes,
      score_percentage: similarity
    });
    
    // Update daily usage
    await updateUserDailyUsage(supabaseUser.auth0_id);
    
    // Refresh user context
    if (refreshUser) {
      await refreshUser();
    }
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
    utterance.onerror = () => {
      console.error('Speech synthesis error');
      setIsPlaying(false);
    };
    
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  const handleNextSentence = () => {
    stopListening();
    // Stop any playing audio
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    loadRandomSentence();
  };

  const getAccuracy = () => {
    if (!currentSentence || !transcript) return 0;
    return calculateSimilarity(transcript, currentSentence.sentence);
  };

  const isPassing = () => getAccuracy() >= 80;

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('readingTest.loading')}</p>
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
            <p className="text-red-500 mb-4">{t('readingTest.error')}</p>
            <Link href="/dashboard/practice" className="text-primary hover:underline">
              {t('readingTest.backToPractice')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Speech recognition not supported
  if (!isSupported) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-lg">
            <div className="mb-6">
              <MicOff className="h-12 w-12 text-primary mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('readingTest.notSupported')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('readingTest.notSupportedMessage')}
            </p>
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Home className="h-5 w-5" />
              {t('readingTest.backToPractice')}
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
            <p className="text-muted-foreground">{t('readingTest.loadingSentence')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
          <span className="truncate">{t('readingTest.title')}</span>
        </h1>
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
          {supabaseUser?.plan === 'free' && (() => {
            const today = new Date().toISOString().split('T')[0];
            const isToday = supabaseUser.daily_question_usage.date === today;
            const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
            return (
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {dailyCount} / 10
              </span>
            );
          })()}
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
          >
            <Languages className="h-4 w-4" />
            <span className="text-xs sm:text-sm font-medium">{language === 'en' ? 'ES' : 'EN'}</span>
          </button>
          <Link 
            href="/dashboard/practice"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors p-1.5 sm:p-0"
            title={t('readingTest.backToPractice')}
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">{t('readingTest.backToPractice')}</span>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-5">
        <h2 className="font-semibold text-sm sm:text-base mb-2 text-blue-900 dark:text-blue-100">{t('readingTest.instructions.title')}</h2>
        <ol className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>{t('readingTest.instructions.step1')}</li>
          <li>{t('readingTest.instructions.step2')}</li>
          <li>{t('readingTest.instructions.step3')}</li>
          <li>{t('readingTest.instructions.step4')}</li>
        </ol>
      </div>

      {/* Practice Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm">
        <div className="p-6">
          {/* Sentence Display */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <label className="block text-sm font-medium">
                {t('readingTest.readPrompt')}
              </label>
              <button
                onClick={playSentence}
                disabled={isPlaying || isListening}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                title="Listen to pronunciation"
              >
                <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{isPlaying ? t('readingTest.playing') : t('readingTest.listenToPronunciation')}</span>
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-muted rounded-lg border-2 border-primary/20">
              <p className="text-xl sm:text-2xl font-semibold text-center leading-relaxed">
                {currentSentence.sentence}
              </p>
            </div>
          </div>

          {/* Microphone Button */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSubmitted || (supabaseUser?.plan === 'free' && !canAnswerQuestions)}
              className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all text-base sm:text-lg w-full sm:w-auto ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />
                  {t('readingTest.stopListening')}
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                  {t('readingTest.startListening')}
                </>
              )}
            </button>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-6">
              <label className="block text-xs sm:text-sm font-medium mb-2">
                {t('readingTest.yourReading')}
              </label>
              <div className="p-3 sm:p-4 bg-muted rounded-lg border min-h-[60px]">
                <p className="text-base sm:text-lg break-words">{transcript}</p>
              </div>
            </div>
          )}

          {/* Listening Indicator */}
          {isListening && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                🎤 {t('readingTest.listening')}
              </p>
            </div>
          )}

          {/* Limit warning for free users */}
          {supabaseUser?.plan === 'free' && !isSubmitted && (() => {
            const today = new Date().toISOString().split('T')[0];
            const isToday = supabaseUser.daily_question_usage.date === today;
            const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
            if (dailyCount >= 9 && dailyCount < 10) {
              return (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ {t('readingTest.limitWarning')
                      .replace('{count}', dailyCount.toString())
                      .replace('{remaining}', (10 - dailyCount).toString())
                      .replace('{plural}', 10 - dailyCount === 1 ? '' : 's')}
                  </p>
                </div>
              );
            }
            return null;
          })()}
          
          {/* Limit reached message */}
          {supabaseUser?.plan === 'free' && (() => {
            const today = new Date().toISOString().split('T')[0];
            const isToday = supabaseUser.daily_question_usage.date === today;
            const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
            if (dailyCount >= 10 && !canAnswerQuestions) {
              return (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                    {t('readingTest.limitReachedInline')}
                  </p>
                  <Link
                    href="/dashboard/upgrade"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Crown className="h-4 w-4" />
                    {t('readingTest.upgradeButton')}
                  </Link>
                </div>
              );
            }
            return null;
          })()}

          {/* Submit Button */}
          {!isSubmitted && transcript.trim() && (
            <button
              onClick={handleSubmit}
              disabled={!transcript.trim() || isListening || (supabaseUser?.plan === 'free' && !canAnswerQuestions)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('readingTest.checkAnswer')}
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
                        {t('readingTest.greatJob')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        {t('readingTest.keepPracticing')}
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
                    ? t('readingTest.passMessage')
                    : t('readingTest.failMessage')}
                </p>
              </div>

              {/* Your Reading vs Correct */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t('readingTest.yourReading')}</p>
                  <p className="text-lg font-medium">{transcript}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{t('readingTest.correctAnswer')}</p>
                  <p className="text-lg font-medium">{currentSentence.sentence}</p>
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextSentence}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                {t('readingTest.nextSentence')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {t('readingTest.tipsTitle')}
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>{t('readingTest.tips.tip1')}</li>
          <li>{t('readingTest.tips.tip2')}</li>
          <li>{t('readingTest.tips.tip3')}</li>
          <li>{t('readingTest.tips.tip4')}</li>
          <li>{t('readingTest.tips.tip5')}</li>
        </ul>
      </div>
    </div>
  );
}
