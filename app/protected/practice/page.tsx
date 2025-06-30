import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { findOrCreateUser } from "@/lib/supabase/users";
import { BookOpen, PenTool, FileText, Trophy, Clock, Zap } from "lucide-react";
import Link from "next/link";

export default async function PracticePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);
  
  // Get user data with practice stats
  const user = await findOrCreateUser(session.user);
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto px-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/protected" className="hover:text-foreground">
          {t('dashboard.title')}
        </Link>
        <span>/</span>
        <span className="text-foreground">Practice</span>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          <h1 className="font-bold text-3xl">Practice Center</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Improve your English skills with interactive quizzes and exercises
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg text-center bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full w-fit mx-auto mb-3">
            <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {user.practice_stats.full_exams_completed + user.practice_stats.quick_questions_answered}
          </div>
          <div className="text-sm text-muted-foreground">Total Questions</div>
        </div>
        
        <div className="p-6 border rounded-lg text-center bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-3">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {user.practice_stats.total_study_time_minutes}
          </div>
          <div className="text-sm text-muted-foreground">Study Time (mins)</div>
        </div>
        
        <div className="p-6 border rounded-lg text-center bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-3">
            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {user.practice_stats.best_score > 0 ? `${Math.round(user.practice_stats.best_score)}%` : '0%'}
          </div>
          <div className="text-sm text-muted-foreground">Best Score</div>
        </div>
      </div>

      {/* Practice Categories */}
      <div className="space-y-8">
        <h2 className="font-semibold text-2xl">Choose Your Practice</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Quiz */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Quick Quiz</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Fast-paced single questions with instant feedback
            </p>
            <div className="space-y-4">
              <Link 
                href="/protected/practice/quick-quiz"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md py-3 px-4 text-sm hover:from-orange-600 hover:to-red-600 inline-flex items-center justify-center font-medium shadow-sm hover:shadow-md transition-all"
              >
                Start Quick Quiz
              </Link>
              <div className="text-xs text-muted-foreground text-center">
                Instant Feedback
              </div>
            </div>
          </div>

          {/* Civics Test */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('dashboard.civicsTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.civicsTest.description')}
            </p>
            <div className="space-y-4">
              <Link 
                href="/protected/practice/civics"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md py-3 px-4 text-sm hover:from-blue-600 hover:to-indigo-600 inline-flex items-center justify-center font-medium shadow-sm hover:shadow-md transition-all"
              >
                {t('startQuiz')}
              </Link>
              <div className="text-xs text-muted-foreground text-center">
                100 Questions Available
              </div>
            </div>
          </div>

          {/* Reading Test */}
          <div className="relative p-6 border rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 opacity-75">
            <div className="absolute top-4 right-4 bg-yellow-500 dark:bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Coming Soon
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('dashboard.readingTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.readingTest.description')}
            </p>
            <div className="space-y-4">
              <button 
                disabled 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md py-3 px-4 text-sm font-medium shadow-sm opacity-50 cursor-not-allowed"
              >
                {t('practiceReading')}
              </button>
              <div className="text-xs text-muted-foreground text-center">
                Reading Comprehension Exercises
              </div>
            </div>
          </div>

          {/* Writing Test */}
          <div className="relative p-6 border rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800 opacity-75">
            <div className="absolute top-4 right-4 bg-yellow-500 dark:bg-yellow-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Coming Soon
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{t('dashboard.writingTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.writingTest.description')}
            </p>
            <div className="space-y-4">
              <button 
                disabled 
                className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-md py-3 px-4 text-sm font-medium shadow-sm opacity-50 cursor-not-allowed"
              >
                {t('practiceWriting')}
              </button>
              <div className="text-xs text-muted-foreground text-center">
                Writing Practice Exercises
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
} 