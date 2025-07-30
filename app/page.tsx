import { AuthButton } from "@/components/auth-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PublicMobileMenu } from "@/components/public-mobile-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { auth0 } from "@/lib/auth0";
import { BookOpen, CheckCircle, BarChart, Globe2, Crown } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);
  const session = await auth0.getSession();
  const userName = session?.user?.name || session?.user?.email;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"} className="flex items-center transition-transform hover:scale-105">
                <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent font-extrabold text-lg tracking-wider">
                  NATURALIZE
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-extrabold text-lg tracking-wider">
                  US
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher 
                  currentLanguage={language} 
                  translations={{
                    language: t('language'),
                    english: t('english'),
                    spanish: t('spanish')
                  }}
                />
                <AuthButton />
              </div>
              <PublicMobileMenu 
                language={language}
                translations={{
                  language: t('language'),
                  english: t('english'),
                  spanish: t('spanish')
                }}
                userName={userName}
                isAuthenticated={!!session}
              />
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <div className="w-full py-20 bg-gradient-to-b from-background to-background/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-bold tracking-tighter text-4xl md:text-6xl lg:text-7xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-8">
                <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent font-bold">
                  Naturalize
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-bold">
                  US
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/80 mb-8">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/protected"
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                >
                  {t('startPracticing')}
                </Link>
                <Link
                  href="/auth/login?screen_hint=signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                >
                  {t('signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full py-20 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('features.title')}</h2>
              <p className="text-lg text-foreground/80">{t('features.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full w-fit">
                  <BookOpen className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
                <h3 className="font-semibold text-xl">{t('features.quizzes.title')}</h3>
                <p className="text-foreground/80">{t('features.quizzes.description')}</p>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                  <Globe2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-xl">{t('features.reading.title')}</h3>
                <p className="text-foreground/80">{t('features.reading.description')}</p>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-lg border bg-card hover:shadow-lg transition-all">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
                  <BarChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-xl">{t('features.progress.title')}</h3>
                <p className="text-foreground/80">{t('features.progress.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="w-full py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('premium.title')}</h2>
              <p className="text-lg text-foreground/80">{t('premium.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{t('premium.features.questionBank.title')}</h3>
                    <p className="text-foreground/80">{t('premium.features.questionBank.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{t('premium.features.progress.title')}</h3>
                    <p className="text-foreground/80">{t('premium.features.progress.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{t('premium.features.bilingual.title')}</h3>
                    <p className="text-foreground/80">{t('premium.features.bilingual.description')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-rose-500/10 to-blue-500/10 border rounded-lg p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">{t('premium.plan.title')}</h3>
                </div>
                <p className="text-foreground/80 mb-6">{t('premium.plan.description')}</p>
                <Link
                  href="/auth/login?screen_hint=signup"
                  className="block w-full bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg font-medium text-center transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
                >
                  {t('premium.plan.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p className="text-foreground/80">{t('footer')}</p>
        </footer>
      </div>
    </main>
  );
}
