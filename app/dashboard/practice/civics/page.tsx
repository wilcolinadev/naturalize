'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy, CheckCircle, XCircle, Crown, Lock, BookOpen, Languages } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import { getQuestionsForUser, type CivicsQuestion } from '@/lib/questions';
import { getCurrentLanguage, setLanguage as saveLanguage } from '@/lib/language-actions';
import { updatePracticeStats } from '@/lib/supabase/users';


export default function CivicsQuizPage() {
  const { supabaseUser, loading, error } = useUserContext();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  
  // State for triggering question reshuffling
  const [restartKey, setRestartKey] = useState(0);
  
  // Store question IDs separately so we can keep the same questions when switching language
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  
  // Memoize questions to prevent reshuffling on every render
  const CIVICS_QUESTIONS = useMemo(() => {
    if (!supabaseUser) return [];
    
    const questions = getQuestionsForUser(supabaseUser.plan, language);
    
    // On first load or restart, capture the question IDs
    if (questionIds.length === 0 && questions.length > 0) {
      setQuestionIds(questions.map(q => q.id));
    }
    
    // If we have stored IDs, reorder questions to match
    if (questionIds.length > 0 && questions.length > 0) {
      return questionIds.map(id => questions.find(q => q.id === id)).filter(Boolean) as CivicsQuestion[];
    }
    
    return questions;
  }, [supabaseUser?.plan, restartKey, language, questionIds]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(CIVICS_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  // Load user's language preference and reset timer
  useEffect(() => {
    getCurrentLanguage().then(setLanguage);
    setStartTime(Date.now());
  }, []);

  // Reset answers and timer when questions change
  useEffect(() => {
    setAnswers(new Array(CIVICS_QUESTIONS.length).fill(null));
    setStartTime(Date.now());
  }, [CIVICS_QUESTIONS.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < CIVICS_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    } else {
      setShowResults(true);
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    if (!supabaseUser) return;

    const percentage = getScorePercentage();
    const timeSpentMinutes = (Date.now() - startTime) / (1000 * 60);

    await updatePracticeStats(supabaseUser.auth0_id, {
      full_exams_completed: 1,
      total_study_time_minutes: timeSpentMinutes,
      score_percentage: percentage
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleRestart = () => {
    // Update restart key to trigger new question generation
    setRestartKey(prev => prev + 1);
    setQuestionIds([]); // Clear stored IDs to get new random questions
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResults(false);
    setStartTime(Date.now()); // Reset timer for new quiz
  };

  const handleLanguageToggle = async () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    await saveLanguage(newLanguage);
  };

  const calculateScore = (): number => {
    return answers.reduce((score: number, answer, index) => {
      if (answer !== null && answer === CIVICS_QUESTIONS[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const getScorePercentage = (): number => {
    return Math.round((calculateScore() / CIVICS_QUESTIONS.length) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quiz...</p>
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
            <p className="text-red-500 mb-4">Unable to load quiz. Please try again.</p>
            <Link href="/dashboard/practice" className="text-primary hover:underline">
              Back to Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No questions available (free users cannot access full civics test)
  if (CIVICS_QUESTIONS.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-lg">
            <div className="mb-6">
              <Lock className="h-12 w-12 text-primary mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              The full civics test is available to premium users only. Upgrade to access all 128 questions and track your progress.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Crown className="h-5 w-5" />
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const isPassing = percentage >= 60;

    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            Quiz Results
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
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              Start New Quiz
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-6 mb-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
              isPassing ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-4xl font-bold ${
                isPassing ? 'text-green-700' : 'text-red-700'
              }`}>
                {percentage}%
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isPassing ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-muted-foreground">
              You answered {score} out of {CIVICS_QUESTIONS.length} questions correctly.
            </p>
          </div>

          {/* Question Review */}
          <h2 className="font-semibold text-xl mb-6">Review Your Answers</h2>
          {CIVICS_QUESTIONS.map((question: CivicsQuestion, index: number) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="p-6 border rounded-lg mb-4 last:mb-0">
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold flex-1 pr-2">Question {index + 1}: {question.question}</h3>
                      <TextToSpeech text={question.question} />
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = userAnswer === optionIndex;
                        const isCorrectOption = question.correctAnswer === optionIndex;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg ${
                              isSelected
                                ? isCorrect
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-red-50 border border-red-200'
                                : isCorrectOption
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-muted/20 border border-border'
                            }`}
                          >
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    
                    <p className="mt-4 text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          Civics Test
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {CIVICS_QUESTIONS.length}
          </span>
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
            title={`Switch to ${language === 'en' ? 'Spanish' : 'English'}`}
          >
            <Languages className="h-4 w-4" />
            <span className="text-sm font-medium">{language === 'en' ? 'ES' : 'EN'}</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Restart
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card text-card-foreground border rounded-lg shadow-sm">
        <div className="p-6">
          {/* Question */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-semibold flex-1 pr-4">
              {CIVICS_QUESTIONS[currentQuestion].question}
            </h2>
            <TextToSpeech text={CIVICS_QUESTIONS[currentQuestion].question} />
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {CIVICS_QUESTIONS[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {currentQuestion === CIVICS_QUESTIONS.length - 1 ? (
                'Finish Quiz'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 