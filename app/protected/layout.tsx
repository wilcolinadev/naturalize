import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserProvider, UserLoadingWrapper } from "@/components/user-provider";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import Link from "next/link";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  console.log('🔄 ProtectedLayout render');
  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);
  return (
    <UserProvider>
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                         <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
               <div className="flex gap-5 items-center font-semibold">
                 <Link href={"/"}>{t('siteTitle')}</Link>
               </div>
               <div className="flex items-center gap-2">
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
             </div>
          </nav>
          <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
            <UserLoadingWrapper>
              {children}
            </UserLoadingWrapper>
          </div>

                     <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
             <p>
               {t('footer')}
             </p>
             <ThemeSwitcher />
           </footer>
        </div>
      </main>
    </UserProvider>
  );
}
