import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { UserInfo } from "@/components/user-info";
import { getTranslations } from "@/lib/translations";
import { getCurrentLanguage } from "@/lib/language-actions";
import { InfoIcon } from "lucide-react";

export default async function ProtectedPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Note: UserInfo component will automatically handle user creation in Supabase
  // via the UserProvider in the layout
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

      {/* User Info Component - automatically creates user in Supabase if needed */}
      <UserInfo />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.civicsTest.title')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('dashboard.civicsTest.description')}
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            {t('startQuiz')}
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.readingTest.title')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('dashboard.readingTest.description')}
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            {t('practiceReading')}
          </button>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">{t('dashboard.writingTest.title')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('dashboard.writingTest.description')}
          </p>
          <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4 text-sm hover:bg-primary/90">
            {t('practiceWriting')}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-4">{t('dashboard.progressTitle')}</h2>
        <div className="p-6 border rounded-lg bg-muted/50">
          <p className="text-center text-muted-foreground">
            {t('dashboard.progressComingSoon')}
          </p>
        </div>
      </div>
    </div>
  );
}
