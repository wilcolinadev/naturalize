import { auth0 } from '@/lib/auth0';
import { getTranslations } from '@/lib/translations';
import { getCurrentLanguage } from '@/lib/language-actions';

export async function AuthButton() {
  const session = await auth0.getSession();
  const language = await getCurrentLanguage();
  const { t } = getTranslations(language);

  if (session) {
    return (
    <div className="flex items-center gap-4">
        <span className="text-sm">
          {t('hey')}, {session.user.name || session.user.email}!
        </span>
        <a
          href="/auth/logout"
          className="py-2 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
        >
          {t('logout')}
        </a>
    </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href="/auth/login"
        className="py-2 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
      >
        {t('login')}
      </a>
      <a
        href="/auth/login?screen_hint=signup"
        className="py-2 px-3 rounded-md no-underline bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
      >
        {t('signup')}
      </a>
    </div>
  );
}
