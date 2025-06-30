'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Trophy, CheckCircle, XCircle, Crown, Lock } from "lucide-react";
import Link from "next/link";
import { useUserContext } from '@/components/user-provider';
import { TextToSpeech } from '@/components/text-to-speech';
import civicsData from '@/lib/civics-questions.json';

// Function to get questions based on user plan
const getQuestionsForUser = (userPlan: string, dailyCount: number) => {
  const allQuestions = civicsData.questions;
  
  // Shuffle questions for all users to ensure random order
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  
  if (userPlan === 'premium') {
    // Premium users get all 100 questions in random order
    return shuffled;
  } else {
    // Free users get limited random questions
    const maxFreeQuestions = Math.min(10, 5 - dailyCount); // Max 10, but respect daily limit
    if (maxFreeQuestions <= 0) {
      return [];
    }
    
    return shuffled.slice(0, maxFreeQuestions);
  }
};

export default function CivicsQuizPage() {
  const { supabaseUser, loading, error } = useUserContext();
  
  // Calculate available questions based on user plan and daily usage
  const today = new Date().toISOString().split('T')[0];
  const isToday = supabaseUser?.daily_question_usage.date === today;
  const dailyCount = isToday ? supabaseUser?.daily_question_usage.count || 0 : 0;
  
  // State for triggering question reshuffling
  const [restartKey, setRestartKey] = useState(0);
  
  // Memoize questions to prevent reshuffling on every render
  const CIVICS_QUESTIONS = useMemo(() => {
    return supabaseUser ? getQuestionsForUser(supabaseUser.plan, dailyCount) : [];
  }, [supabaseUser?.plan, dailyCount, restartKey]);
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

  // No questions available (free user hit daily limit)
  if (CIVICS_QUESTIONS.length === 0) {
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

        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-bold text-3xl mb-4">Daily Limit Reached</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You&apos;ve used all your free questions for today. Upgrade to Premium for unlimited access!
          </p>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto mb-6">
            <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Premium Benefits</h3>
            <ul className="text-sm text-left space-y-2">
              <li>• Access to all 100 official civics questions</li>
              <li>• Unlimited daily practice</li>
              <li>• Full-length practice exams</li>
              <li>• Detailed progress tracking</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md py-3 px-6 font-semibold hover:from-yellow-600 hover:to-orange-600">
              Upgrade to Premium
            </button>
            <Link
              href="/protected/practice"
              className="border border-primary text-primary rounded-md py-3 px-6 hover:bg-primary/10"
            >
              Back to Practice
            </Link>
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

      {/* Plan Status Banner */}
      {supabaseUser.plan === 'free' && (
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-base text-gray-900">Free Plan - Limited Practice</p>
                <p className="text-sm text-gray-700 font-medium">
                  {CIVICS_QUESTIONS.length} random questions available today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-yellow-600" />
              <button className="text-sm font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg py-2 px-4 hover:from-yellow-600 hover:to-orange-600 shadow-md transition-all duration-200 hover:shadow-lg">
                Upgrade for 100 Questions
              </button>
            </div>
          </div>
        </div>
      )}

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