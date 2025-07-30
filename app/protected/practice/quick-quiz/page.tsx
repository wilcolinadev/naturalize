'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Crown, Zap, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import { updateQuickQuizUsage } from '@/lib/supabase/users';
import { getRandomQuestion, type CivicsQuestion } from '@/lib/questions';
import { getCurrentLanguage } from '@/lib/language-actions';
import { getTranslations } from '@/lib/translations';

export default function QuickQuizPage() {
  const { supabaseUser, loading, error } = useUserContext();
  const [currentQuestion, setCurrentQuestion] = useState<CivicsQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const { t } = getTranslations(language);

  useEffect(() => {
    // Load user's language preference
    getCurrentLanguage().then(setLanguage);
    
    // Get first random question
    setCurrentQuestion(getRandomQuestion(language));
  }, [language]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setIsCorrect(answerIndex === currentQuestion.correctAnswer);

    // Update usage in Supabase if user is logged in
    if (supabaseUser) {
      await updateQuickQuizUsage(supabaseUser.auth0_id);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(getRandomQuestion(language));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('quickQuiz.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-500 mb-4">{t('quickQuiz.error')}</p>
            <Link href="/protected/practice" className="text-primary hover:underline">
              {t('quickQuiz.backToPractice')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No question loaded yet
  if (!currentQuestion) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('quickQuiz.loadingQuestion')}</p>
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
          <Zap className="h-8 w-8" />
          {t('quickQuiz.title')}
        </h1>
        <Link 
          href="/protected/practice"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-5 w-5" />
          {t('quickQuiz.backToPractice')}
        </Link>
      </div>

      {/* Question Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm">
        <div className="p-6">
          {/* Question */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-semibold flex-1 pr-4">{currentQuestion.question}</h2>
            <TextToSpeech text={currentQuestion.question} />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = currentQuestion.correctAnswer === index;
              
              let optionClass = "p-4 border rounded-lg cursor-pointer transition-all";
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  optionClass += " bg-green-500/10 dark:bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300";
                } else if (isSelected) {
                  optionClass += " bg-red-500/10 dark:bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300";
                } else {
                  optionClass += " opacity-50";
                }
              } else {
                optionClass += isSelected 
                  ? " border-primary bg-primary/10 dark:bg-primary/20" 
                  : " hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10";
              }

              return (
                <div
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-500/10 dark:bg-green-500/20 border border-green-500/50' 
                : 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/50'
            }`}>
              <p className={`font-medium mb-2 ${
                isCorrect 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p className="text-foreground/80">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Question Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              {t('quickQuiz.nextQuestion')}
            </button>
          )}
        </div>
      </div>

      {/* Premium Upgrade Card */}
      {supabaseUser?.plan !== 'premium' && (
        <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{t('quickQuiz.upgradeToPremium.title')}</h3>
              <p className="text-foreground/80 mb-4">
                {t('quickQuiz.upgradeToPremium.description')}
              </p>
              <Link
                href="/protected/upgrade"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Crown className="h-5 w-5" />
                {t('quickQuiz.upgradeToPremium.button')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 