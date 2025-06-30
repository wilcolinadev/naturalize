'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Crown, Lock, Zap, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import { updateQuickQuizUsage } from '@/lib/supabase/users';
import civicsData from '@/lib/civics-questions.json';

// Get a random question
const getRandomQuestion = () => {
  const questions = civicsData.questions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export default function QuickQuizPage() {
  const { supabaseUser, loading, error } = useUserContext();
  const [currentQuestion, setCurrentQuestion] = useState(() => getRandomQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [canTakeQuiz, setCanTakeQuiz] = useState(false);
  const [dailyQuickQuizCount, setDailyQuickQuizCount] = useState(0);

  // Check if user can take quick quiz
  useEffect(() => {
    if (supabaseUser) {
      const today = new Date().toISOString().split('T')[0];
      const usage = supabaseUser.daily_quick_quiz_usage || { count: 0, date: today };
      const isToday = usage.date === today;
      const quickQuizCount = isToday ? usage.count : 0;
      
      setDailyQuickQuizCount(quickQuizCount);
      
      if (supabaseUser.plan === 'premium') {
        setCanTakeQuiz(true);
      } else {
        // Free users get 1 quick quiz per day
        setCanTakeQuiz(quickQuizCount < 1);
      }
    }
  }, [supabaseUser]);

  const handleAnswerSelect = async (answerIndex: number) => {
    if (showResult) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Add animation classes
    setAnimationClass(correct ? 'animate-bounce' : 'animate-pulse');
    
    // Remove animation after a delay
    setTimeout(() => {
      setAnimationClass('');
    }, 1000);
    
    // Update user's daily quick quiz count in database
    if (supabaseUser?.auth0_id) {
      const success = await updateQuickQuizUsage(supabaseUser.auth0_id);
      if (success && supabaseUser.plan === 'free') {
        // Update local state to reflect the usage
        setDailyQuickQuizCount(prev => prev + 1);
        setCanTakeQuiz(false); // Free users can only do 1 per day
      }
    }
  };

  const handleNextQuestion = () => {
    // Check if user can still take more quick quizzes
    if (supabaseUser?.plan === 'free' && dailyQuickQuizCount >= 1) {
      // Redirect to limit reached page or show message
      return;
    }
    
    setCurrentQuestion(getRandomQuestion());
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setAnimationClass('');
  };



  // Loading state
  if (loading) {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading quick quiz...</p>
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
            <p className="text-red-500 mb-4">Unable to load quick quiz. Please try again.</p>
            <Link href="/protected/practice" className="text-primary hover:underline">
              Back to Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Daily limit reached for free users
  if (!canTakeQuiz && supabaseUser.plan === 'free') {
    return (
      <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/protected" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href="/protected/practice" className="hover:text-foreground">Practice</Link>
          <span>/</span>
          <span className="text-foreground">Quick Quiz</span>
        </div>

        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            {/* Animated Icon */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Lock className="h-16 w-16 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-3 shadow-lg animate-bounce">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Title and Description */}
            <div className="mb-10">
              <h1 className="font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Daily Quick Quiz Used
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                You&apos;ve completed your daily quick quiz! Unlock unlimited practice with Premium.
              </p>
            </div>
            
            {/* Premium Benefits Card */}
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-orange-950/20 dark:via-yellow-950/20 dark:to-red-950/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-8 max-w-lg mx-auto mb-10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h3 className="font-bold text-2xl mb-6 text-gray-900 dark:text-gray-100">Premium Benefits</h3>
              
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Unlimited daily quick quizzes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Instant feedback on all questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Access to all question categories</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Detailed progress tracking</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl py-4 px-8 font-bold text-lg hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 group-hover:animate-pulse" />
                  Upgrade to Premium
                </span>
              </button>
              <Link
                href="/protected/practice"
                className="border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-xl py-4 px-8 font-bold text-lg hover:bg-orange-50 hover:dark:bg-orange-950/20 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Back to Practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto px-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/protected" className="hover:text-foreground">Dashboard</Link>
        <span>/</span>
        <Link href="/protected/practice" className="hover:text-foreground">Practice</Link>
        <span>/</span>
        <span className="text-foreground">Quick Quiz</span>
      </div>

      {/* Plan Status Banner */}
      {supabaseUser.plan === 'free' && (
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-base text-gray-900">Free Plan - Daily Quick Quiz</p>
                <p className="text-sm text-gray-700 font-medium">
                  {1 - dailyQuickQuizCount} quick quiz remaining today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-orange-600" />
              <button className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg py-2 px-4 hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200 hover:shadow-lg">
                Upgrade for Unlimited
              </button>
            </div>
          </div>
        </div>
      )}

      {supabaseUser.plan === 'premium' && (
        <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-base text-gray-900">Premium Plan - Unlimited Quick Quizzes</p>
              <p className="text-sm text-gray-700 font-medium">
                Practice as much as you want with instant feedback
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Quiz Header */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full ${animationClass}`}>
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-bold text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quick Quiz
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Answer quickly and get instant feedback!
        </p>
      </div>

      {/* Question Card */}
      <div className="relative">
        <div className={`p-8 border-2 rounded-xl bg-card shadow-lg transition-all duration-500 ${
          showResult 
            ? isCorrect 
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
              : 'border-red-500 bg-red-50 dark:bg-red-950/20'
            : 'border-border hover:border-orange-500'
        }`}>
          
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold flex-1 pr-4">
                {currentQuestion.question}
              </h2>
              <TextToSpeech text={currentQuestion.question} size="lg" />
            </div>
          </div>
          
          {/* Answer Options */}
          <div className="space-y-4 mb-8">
                         {currentQuestion.options.map((option: string, index: number) => {
               let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ";
               
               if (!showResult) {
                 buttonClass += "border-border hover:border-orange-500 hover:bg-orange-50 hover:dark:bg-orange-950/20 hover:shadow-md";
               } else {
                 if (index === currentQuestion.correctAnswer) {
                   buttonClass += "border-green-500 bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200";
                 } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                   buttonClass += "border-red-500 bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-200";
                 } else {
                   buttonClass += "border-border bg-muted text-muted-foreground";
                 }
               }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                         showResult && index === currentQuestion.correctAnswer
                           ? 'border-green-500 bg-green-500'
                           : showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer
                           ? 'border-red-500 bg-red-500'
                           : 'border-muted-foreground'
                       }`}>
                        {showResult && index === currentQuestion.correctAnswer && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <TextToSpeech text={option} size="sm" asDiv />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Display */}
          {showResult && (
                         <div className={`text-center p-6 rounded-lg mb-6 ${
               isCorrect 
                 ? 'bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-700' 
                 : 'bg-red-100 dark:bg-red-950/30 border border-red-300 dark:border-red-700'
             }`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                {isCorrect ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
                <div>
                                     <h3 className={`text-2xl font-bold ${
                     isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                   }`}>
                     {isCorrect ? 'Correct! 🎉' : 'Incorrect'}
                   </h3>
                   {!isCorrect && (
                     <p className="text-red-700 dark:text-red-300 mt-2">
                       The correct answer is: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                     </p>
                   )}
                </div>
              </div>
              
                             <div className="text-sm text-foreground bg-background/80 p-4 rounded-lg border border-border">
                 <strong>Explanation:</strong> {currentQuestion.explanation}
               </div>
            </div>
          )}

          {/* Action Buttons */}
          {showResult && (
            <div className="flex gap-4 justify-center">
              {supabaseUser?.plan === 'premium' || dailyQuickQuizCount < 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md py-3 px-6 hover:from-orange-600 hover:to-red-600 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Next Question
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Daily limit reached! Upgrade to Premium for unlimited quick quizzes.
                  </p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md py-3 px-6 font-semibold shadow-lg hover:shadow-xl transition-all">
                    Upgrade to Premium
                  </button>
                </div>
              )}
                             <Link
                 href="/protected/practice"
                 className="flex items-center gap-2 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-md py-3 px-6 hover:bg-orange-50 hover:dark:bg-orange-950/20 font-semibold transition-all"
               >
                <Home className="h-4 w-4" />
                Back to Practice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 