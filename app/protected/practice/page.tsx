import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { BookOpen, PenTool, FileText, Trophy, Clock } from "lucide-react";
import Link from "next/link";

export default async function PracticePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);

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
        <div className="p-6 border rounded-lg text-center">
          <Trophy className="h-6 w-6 mx-auto mb-3 text-yellow-500" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Quizzes Completed</div>
        </div>
        
        <div className="p-6 border rounded-lg text-center">
          <Clock className="h-6 w-6 mx-auto mb-3 text-blue-500" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">Study Time (mins)</div>
        </div>
        
        <div className="p-6 border rounded-lg text-center">
          <FileText className="h-6 w-6 mx-auto mb-3 text-green-500" />
          <div className="text-2xl font-bold">0%</div>
          <div className="text-sm text-muted-foreground">Average Score</div>
        </div>
      </div>

      {/* Practice Categories */}
      <div className="space-y-8">
        <h2 className="font-semibold text-2xl">Choose Your Practice</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Civics Test */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">{t('dashboard.civicsTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.civicsTest.description')}
            </p>
            <div className="space-y-4">
              <Link 
                href="/protected/practice/civics"
                className="w-full bg-primary text-primary-foreground rounded-md py-3 px-4 text-sm hover:bg-primary/90 inline-flex items-center justify-center font-medium"
              >
                {t('startQuiz')}
              </Link>
              <div className="text-xs text-muted-foreground text-center">
                100 Questions Available
              </div>
            </div>
          </div>

          {/* Reading Test */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">{t('dashboard.readingTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.readingTest.description')}
            </p>
            <div className="space-y-4">
              <button className="w-full bg-primary text-primary-foreground rounded-md py-3 px-4 text-sm hover:bg-primary/90 font-medium">
                {t('practiceReading')}
              </button>
              <div className="text-xs text-muted-foreground text-center">
                Reading Comprehension Exercises
              </div>
            </div>
          </div>

          {/* Writing Test */}
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <PenTool className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold">{t('dashboard.writingTest.title')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t('dashboard.writingTest.description')}
            </p>
            <div className="space-y-4">
              <button className="w-full bg-primary text-primary-foreground rounded-md py-3 px-4 text-sm hover:bg-primary/90 font-medium">
                {t('practiceWriting')}
              </button>
              <div className="text-xs text-muted-foreground text-center">
                Writing Practice Exercises
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-8">
        <h2 className="font-semibold text-2xl">Recent Activity</h2>
        
        <div className="p-6 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            No recent activity. Start practicing to see your progress here!
          </p>
        </div>
      </div>
    </div>
  );
} 