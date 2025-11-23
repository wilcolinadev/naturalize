import { redirect } from 'next/navigation';
import { AuthButton } from "@/components/auth-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProtectedNav } from "@/components/protected-nav";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserProvider, UserLoadingWrapper } from "@/components/user-provider";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { auth0 } from "@/lib/auth0";
import Link from "next/link";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);
  const session = await auth0.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/login');
  }

  const userName = session.user?.name || session.user?.email;

  return (
    <UserProvider>
      <main className="min-h-screen flex flex-col items-center bg-background">
        <div className="flex-1 w-full flex flex-col items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center">
                <Link href={"/"} className="flex items-center transition-transform hover:scale-105">
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent font-extrabold text-lg tracking-wider">
                    NATURALIZE
                  </span>
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-extrabold text-lg tracking-wider">
                    US
                  </span>
                </Link>
                <ProtectedNav />
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
                <MobileMenu 
                  language={language}
                  translations={{
                    language: t('language'),
                    english: t('english'),
                    spanish: t('spanish')
                  }}
                  userName={userName}
                  isAuthenticated={true}
                />
              </div>
            </div>
          </nav>
          <div className="flex-1 flex flex-col gap-5 py-10 w-full">
            <UserLoadingWrapper>
              {children}
            </UserLoadingWrapper>
          </div>

          <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p className="text-foreground/80">{t('footer')}</p>
          </footer>
        </div>
      </main>
    </UserProvider>
  );
}
