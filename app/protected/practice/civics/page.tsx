'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy, CheckCircle, XCircle, Crown, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import civicsData from '@/lib/civics-questions.json';

// Function to get questions based on user plan
const getQuestionsForUser = (userPlan: string) => {
  const allQuestions = civicsData.questions;
  
  // Shuffle questions for all users to ensure random order
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  
  if (userPlan === 'premium') {
    // Premium users get all 100 questions in random order
    return shuffled;
  } else {
    // Free users cannot access the full civics test - redirect to upgrade
    return [];
  }
};

export default function CivicsQuizPage() {
  const { supabaseUser, loading, error } = useUserContext();
  
  // No need to calculate daily usage since free users are now blocked from full civics test
  
  // State for triggering question reshuffling
  const [restartKey, setRestartKey] = useState(0);
  
  // Memoize questions to prevent reshuffling on every render
  const CIVICS_QUESTIONS = useMemo(() => {
    return supabaseUser ? getQuestionsForUser(supabaseUser.plan) : [];
  }, [supabaseUser?.plan, restartKey]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(CIVICS_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  // Reset answers when questions change
  useEffect(() => {
    setAnswers(new Array(CIVICS_QUESTIONS.length).fill(null));
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
    }
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
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResults(false);
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
            <Link href="/protected/practice" className="text-primary hover:underline">
              Back to Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No questions available (free users cannot access full civics test)
  if (CIVICS_QUESTIONS.length === 0 && supabaseUser.plan === 'free') {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/protected" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href="/protected/practice" className="hover:text-foreground">Practice</Link>
          <span>/</span>
          <span className="text-foreground">Civics Quiz</span>
        </div>

        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            {/* Animated Icon */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Lock className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 shadow-lg animate-bounce">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Title and Description */}
            <div className="mb-10">
              <h1 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Premium Feature
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The full 100-question civics test is available exclusively for Premium members.
              </p>
            </div>
            
            {/* Premium Benefits Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-8 max-w-lg mx-auto mb-10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h3 className="font-bold text-2xl mb-6 text-gray-900 dark:text-gray-100">Premium Civics Test</h3>
              
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">All 100 official USCIS questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Full-length practice exams</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Detailed answer explanations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Progress tracking & analytics</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  💡 Try our Quick Quiz feature for free practice questions!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl py-4 px-8 font-bold text-lg hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 group-hover:animate-pulse" />
                  Upgrade to Premium
                </span>
              </button>
              <Link
                href="/protected/practice/quick-quiz"
                className="border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl py-4 px-8 font-bold text-lg hover:bg-blue-50 hover:dark:bg-blue-950/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Try Quick Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/protected" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href="/protected/practice" className="hover:text-foreground">Practice</Link>
          <span>/</span>
          <span className="text-foreground">Civics Quiz Results</span>
        </div>

        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <h1 className="font-bold text-4xl">Quiz Complete!</h1>
          </div>
          
          <div className="p-8 border rounded-lg bg-muted/50">
            <div className="text-6xl font-bold mb-4 text-primary">{percentage}%</div>
            <div className="text-xl mb-2">Your Score: {score} out of {CIVICS_QUESTIONS.length}</div>
            <div className="text-muted-foreground">
              {percentage >= 80 ? "Excellent work! 🎉" : 
               percentage >= 60 ? "Good job! Keep practicing 👍" : 
               "Keep studying! You'll get there 💪"}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-md py-3 px-6 hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/protected/practice"
              className="flex items-center gap-2 border border-primary text-primary rounded-md py-3 px-6 hover:bg-primary/10"
            >
              Back to Practice
            </Link>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl">Review Your Answers</h2>
          {CIVICS_QUESTIONS.map((question: typeof civicsData.questions[0], index: number) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={question.id} className="p-6 border rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold flex-1 pr-2">Question {index + 1}: {question.question}</h3>
                      <TextToSpeech text={question.question} size="sm" />
                    </div>
                                          <div className="space-y-2">
                        <div className={`p-2 rounded flex items-center justify-between ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          <span>Your answer: {userAnswer !== null && userAnswer < question.options.length ? question.options[userAnswer] : 'Not answered'}</span>
                          {userAnswer !== null && userAnswer < question.options.length && (
                            <TextToSpeech text={question.options[userAnswer]} size="sm" />
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="p-2 rounded bg-green-100 text-green-800 flex items-center justify-between">
                            <span>Correct answer: {question.options[question.correctAnswer]}</span>
                            <TextToSpeech text={question.options[question.correctAnswer]} size="sm" />
                          </div>
                        )}
                      <div className="text-sm text-muted-foreground">
                        {question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const question = CIVICS_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / CIVICS_QUESTIONS.length) * 100;

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/protected" className="hover:text-foreground">Dashboard</Link>
        <span>/</span>
        <Link href="/protected/practice" className="hover:text-foreground">Practice</Link>
        <span>/</span>
        <span className="text-foreground">Civics Quiz</span>
      </div>

      {/* Plan Status Banner - Only shown for premium users since free users are blocked */}

      {supabaseUser.plan === 'premium' && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base text-gray-900">Premium Plan - Full Access</p>
              <p className="text-sm text-gray-700 font-medium">
                Complete 100-question official civics test
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Question {currentQuestion + 1} of {CIVICS_QUESTIONS.length}
            </span>
            <span className="text-lg font-bold text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 border rounded-lg bg-card">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold flex-1 pr-4">{question.question}</h2>
          <TextToSpeech text={question.question} size="lg" />
        </div>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left border rounded-lg transition-all hover:border-primary ${
                selectedAnswer === index
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="flex-1">{option}</span>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <TextToSpeech text={option} size="sm" asDiv />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="text-sm text-muted-foreground">
          {answers.filter(a => a !== null).length} of {CIVICS_QUESTIONS.length} answered
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === CIVICS_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 