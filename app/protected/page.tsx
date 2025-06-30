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
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          {t('dashboard.welcome')}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 items-start">
        <h1 className="font-bold text-3xl mb-4">{t('dashboard.title')}</h1>
        <p className="text-lg text-muted-foreground mb-6">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/protected/practice" 
          className="group p-6 border rounded-lg hover:shadow-lg transition-all hover:border-primary"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Practice Center</h3>
          <p className="text-sm text-muted-foreground">
            Access all quizzes and practice exercises in one place
          </p>
        </Link>

        <Link 
          href="/protected/settings" 
          className="group p-6 border rounded-lg hover:shadow-lg transition-all hover:border-primary"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <h3 className="text-lg font-semibold mb-2">User Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account, preferences, and profile information
          </p>
        </Link>

        <div className="p-6 border rounded-lg bg-muted/50">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
          <p className="text-sm text-muted-foreground">
            View your learning progress and achievements (Coming Soon)
          </p>
        </div>
      </div>

      {/* Quick Start Options */}
      <div className="space-y-6">
        <h2 className="font-bold text-2xl">Quick Start</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.civicsTest.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.civicsTest.description')}
            </p>
                         <Link 
               href="/protected/practice/civics"
               className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
             >
               {t('startQuiz')}
             </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.readingTest.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.readingTest.description')}
            </p>
            <Link 
              href="/protected/practice"
              className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t('practiceReading')}
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.writingTest.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.writingTest.description')}
            </p>
            <Link 
              href="/protected/practice"
              className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {t('practiceWriting')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
