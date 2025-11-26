import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { InfoIcon, BookOpen, Settings, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function ProtectedPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl mx-auto p-5">
      <div className="w-full">
        <div className="bg-gradient-to-r from-blue-500/10 to-rose-500/10 border border-blue-200 dark:border-blue-800 text-sm p-4 px-6 rounded-xl text-foreground flex gap-3 items-center backdrop-blur-sm shadow-sm">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <InfoIcon size="16" strokeWidth={2} className="text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium">{t('dashboard.welcome')}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <h1 className="font-bold text-4xl mb-2 bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text text-transparent">{t('dashboard.title')}</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/practice" 
          className="group relative p-6 border-2 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden bg-gradient-to-br from-blue-50/50 to-card dark:from-blue-950/20 dark:to-card hover:border-blue-300 dark:hover:border-blue-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-1 duration-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Practice Center</h3>
          <p className="text-sm text-foreground/70">
            Access all quizzes and practice exercises in one place
          </p>
        </Link>

        <Link 
          href="/dashboard/settings" 
          className="group relative p-6 border-2 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden bg-gradient-to-br from-green-50/50 to-card dark:from-green-950/20 dark:to-card hover:border-green-300 dark:hover:border-green-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors group-hover:translate-x-1 duration-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">User Settings</h3>
          <p className="text-sm text-foreground/70">
            Manage your account, preferences, and profile information
          </p>
        </Link>

        <div className="group relative p-6 border-2 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50/50 to-card dark:from-purple-950/20 dark:to-card opacity-75 cursor-not-allowed">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-semibold">Soon</div>
          </div>
          <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
          <p className="text-sm text-foreground/70">
            View your learning progress and achievements
          </p>
        </div>
      </div>

      {/* Quick Start Options */}
      <div className="space-y-6">
        <h2 className="font-bold text-3xl">Quick Start</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-8 border-2 rounded-2xl bg-gradient-to-br from-rose-50/50 to-card dark:from-rose-950/10 dark:to-card hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">{t('dashboard.civicsTest.title')}</h3>
            <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
              {t('dashboard.civicsTest.description')}
            </p>
            <Link 
              href="/dashboard/practice/civics"
              className="inline-flex w-full items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 h-11 px-6 transition-all duration-300 hover:shadow-lg"
            >
              {t('startQuiz')}
            </Link>
          </div>

          <div className="group p-8 border-2 rounded-2xl bg-gradient-to-br from-green-50/50 to-card dark:from-green-950/10 dark:to-card hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-green-300 dark:hover:border-green-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">{t('dashboard.readingTest.title')}</h3>
            <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
              {t('dashboard.readingTest.description')}
            </p>
            <Link 
              href="/dashboard/practice/reading"
              className="inline-flex w-full items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 h-11 px-6 transition-all duration-300 hover:shadow-lg"
            >
              {t('practiceReading')}
            </Link>
          </div>

          <div className="group p-8 border-2 rounded-2xl bg-gradient-to-br from-blue-50/50 to-card dark:from-blue-950/10 dark:to-card hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">{t('dashboard.writingTest.title')}</h3>
            <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
              {t('dashboard.writingTest.description')}
            </p>
            <Link 
              href="/dashboard/practice/writing"
              className="inline-flex w-full items-center justify-center rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 h-11 px-6 transition-all duration-300 hover:shadow-lg"
            >
              {t('practiceWriting')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
