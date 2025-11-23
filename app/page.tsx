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
                <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent font-extrabold text-sm md:text-lg tracking-wider">
                  NATURALIZE
                </span>
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-extrabold text-sm md:text-lg tracking-wider">
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
        <div className="relative w-full py-24 md:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-background to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card/50 backdrop-blur-sm mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">100% Free Practice Questions</span>
              </div>

              <h1 className="font-bold tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in">
                <span className="flex flex-row items-center justify-center gap-2 md:gap-3 whitespace-nowrap">
                  <span className="bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 bg-clip-text text-transparent font-extrabold animate-gradient-x">
                    Naturalize
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-clip-text text-transparent font-extrabold animate-gradient-x">
                    US
                  </span>
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground/70 mb-10 leading-relaxed animate-fade-in">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto animate-fade-in">
                <Link
                  href="/protected/practice"
                  className="group relative w-full sm:w-auto text-center bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg hover:shadow-rose-500/50"
                >
                  <span className="relative z-10">{t('startPracticing')}</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/auth/login?screen_hint=signup"
                  className="group relative w-full sm:w-auto text-center border-2 border-blue-500 hover:border-blue-600 text-blue-600 dark:text-blue-400 hover:text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
                >
                  {t('signup')}
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 animate-fade-in">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">128</div>
                  <div className="text-sm text-muted-foreground mt-1">Official Civics Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">2</div>
                  <div className="text-sm text-muted-foreground mt-1">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Free</div>
                  <div className="text-sm text-muted-foreground mt-1">Forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full py-24 bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t('features.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group flex flex-col gap-4 p-8 rounded-2xl border-2 bg-gradient-to-br from-rose-50/50 to-card dark:from-rose-950/10 dark:to-card hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-700">
                <div className="p-4 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-2xl">{t('features.quizzes.title')}</h3>
                <p className="text-foreground/70 leading-relaxed">{t('features.quizzes.description')}</p>
              </div>
              <div className="group flex flex-col gap-4 p-8 rounded-2xl border-2 bg-gradient-to-br from-blue-50/50 to-card dark:from-blue-950/10 dark:to-card hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-2xl">{t('features.reading.title')}</h3>
                <p className="text-foreground/70 leading-relaxed">{t('features.reading.description')}</p>
              </div>
              <div className="group flex flex-col gap-4 p-8 rounded-2xl border-2 bg-gradient-to-br from-green-50/50 to-card dark:from-green-950/10 dark:to-card hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-green-300 dark:hover:border-green-700">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-2xl">{t('features.progress.title')}</h3>
                <p className="text-foreground/70 leading-relaxed">{t('features.progress.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="relative w-full py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-rose-50/30 to-blue-50/30 dark:from-background dark:via-rose-950/10 dark:to-blue-950/10"></div>
          
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500/10 to-blue-500/10 border mb-4">
                <Crown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-semibold">Premium</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">{t('premium.title')}</h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">{t('premium.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{t('premium.features.questionBank.title')}</h3>
                    <p className="text-foreground/70">{t('premium.features.questionBank.description')}</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{t('premium.features.progress.title')}</h3>
                    <p className="text-foreground/70">{t('premium.features.progress.description')}</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{t('premium.features.bilingual.title')}</h3>
                    <p className="text-foreground/70">{t('premium.features.bilingual.description')}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-blue-500 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-card to-card border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-blue-500 rounded-2xl">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold">{t('premium.plan.title')}</h3>
                  </div>
                  <p className="text-foreground/70 mb-8 text-lg leading-relaxed">{t('premium.plan.description')}</p>
                  <Link
                    href="/auth/login?screen_hint=signup"
                    className="block w-full bg-gradient-to-r from-rose-500 to-blue-500 hover:from-rose-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-center text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
                  >
                    {t('premium.plan.cta')}
                  </Link>
                </div>
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
