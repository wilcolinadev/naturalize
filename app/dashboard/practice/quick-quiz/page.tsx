'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Crown, Zap, RotateCcw, Home, Languages } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import { updateUserDailyUsage, updatePracticeStats } from '@/lib/supabase/users';
import { getRandomQuestion, getCivicsData, type CivicsQuestion } from '@/lib/questions';
import { getCurrentLanguage, setLanguage as saveLanguage } from '@/lib/language-actions';
import { getTranslations } from '@/lib/translations';

export default function QuickQuizPage() {
  const { supabaseUser, loading, error, refreshUser } = useUserContext();
  const [currentQuestion, setCurrentQuestion] = useState<CivicsQuestion | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [canAnswerQuestions, setCanAnswerQuestions] = useState<boolean>(true);
  const { t } = getTranslations(language);

  useEffect(() => {
    // Load user's language preference and get first question
    const loadData = async () => {
      const lang = await getCurrentLanguage();
      setLanguage(lang);
      
      const question = getRandomQuestion(lang);
      setCurrentQuestion(question);
      setCurrentQuestionId(question.id);
      setStartTime(Date.now());
    };
    
    loadData();
  }, []);

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

  // When language changes, load the same question ID in the new language
  useEffect(() => {
    if (currentQuestionId !== null) {
      const questions = getCivicsData(language).questions;
      const question = questions.find(q => q.id === currentQuestionId);
      if (question) {
        setCurrentQuestion(question);
      }
    }
  }, [language, currentQuestionId]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (isAnswered || !currentQuestion || !supabaseUser) return;
    
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
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setIsCorrect(isCorrect);

    // Calculate time spent on this question
    const timeSpentMinutes = (Date.now() - startTime) / (1000 * 60);

    // Update practice stats
    await updatePracticeStats(supabaseUser.auth0_id, {
      quick_questions_answered: 1,
      total_study_time_minutes: timeSpentMinutes,
      score_percentage: isCorrect ? 100 : 0
    });

    // Update daily usage (counts all question types together)
    await updateUserDailyUsage(supabaseUser.auth0_id);
    
    // Refresh user context to update profile display and local state
    if (refreshUser) {
      await refreshUser();
    }
  };

  const handleNextQuestion = () => {
    const question = getRandomQuestion(language);
    setCurrentQuestion(question);
    setCurrentQuestionId(question.id);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setStartTime(Date.now()); // Reset timer for next question
  };

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
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
            <Link href="/dashboard/practice" className="text-primary hover:underline">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3">
          <Zap className="h-6 w-6 sm:h-8 sm:w-8" />
          <span className="truncate">{t('quickQuiz.title')}</span>
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
            title={t('quickQuiz.backToPractice')}
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline text-sm">{t('quickQuiz.backToPractice')}</span>
          </Link>
        </div>
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
              const isDisabled = supabaseUser?.plan === 'free' && !canAnswerQuestions && !isAnswered;
              
              let optionClass = "p-4 border rounded-lg transition-all";
              
              if (isDisabled) {
                optionClass += " opacity-50 cursor-not-allowed";
              } else {
                optionClass += " cursor-pointer";
              }
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  optionClass += " bg-green-500/10 dark:bg-green-500/20 border-green-500/50 text-green-700 dark:text-green-300";
                } else if (isSelected) {
                  optionClass += " bg-red-500/10 dark:bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300";
                } else {
                  optionClass += " opacity-50";
                }
              } else if (!isDisabled) {
                optionClass += isSelected 
                  ? " border-primary bg-primary/10 dark:bg-primary/20" 
                  : " hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10";
              }

              return (
                <div
                  key={index}
                  className={optionClass}
                  onClick={() => !isDisabled && handleAnswerSelect(index)}
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
                {isCorrect ? t('quickQuiz.correct') : t('quickQuiz.incorrect')}
              </p>
              <p className="text-foreground/80">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Limit warning for free users */}
          {supabaseUser?.plan === 'free' && (() => {
            const today = new Date().toISOString().split('T')[0];
            const isToday = supabaseUser.daily_question_usage.date === today;
            const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
            if (dailyCount >= 9 && dailyCount < 10) {
              return (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ {t('quickQuiz.limitWarning')
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
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                    {t('quickQuiz.limitReachedInline')}
                  </p>
                  <Link
                    href="/dashboard/upgrade"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Crown className="h-4 w-4" />
                    {t('quickQuiz.upgradeButton')}
                  </Link>
                </div>
              );
            }
            return null;
          })()}

          {/* Next Question Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              disabled={supabaseUser?.plan === 'free' && !canAnswerQuestions}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-5 w-5" />
              {t('quickQuiz.nextQuestion')}
            </button>
          )}
        </div>
      </div>
      
      {/* Daily limit reached - full page message */}
      {supabaseUser?.plan === 'free' && (() => {
        const today = new Date().toISOString().split('T')[0];
        const isToday = supabaseUser.daily_question_usage.date === today;
        const dailyCount = isToday ? supabaseUser.daily_question_usage.count : 0;
        if (dailyCount >= 10 && !canAnswerQuestions && !currentQuestion) {
          return (
            <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{t('quickQuiz.dailyLimitReached')}</h2>
                <p className="text-muted-foreground mb-6">
                  {t('quickQuiz.dailyLimitMessage').replace('{count}', dailyCount.toString())}
                </p>
                <Link
                  href="/dashboard/upgrade"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Crown className="h-5 w-5" />
                  {t('quickQuiz.upgradeButton')}
                </Link>
              </div>
            </div>
          );
        }
        return null;
      })()}

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
                href="/dashboard/upgrade"
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