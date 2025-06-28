import { auth0 } from '@/lib/auth0';

export async function AuthButton() {
  const session = await auth0.getSession();

  if (session) {
    return (
    <div className="flex items-center gap-4">
        <span className="text-sm">
          Hey, {session.user.name || session.user.email}!
        </span>
        <a
          href="/auth/logout"
          className="py-2 px-3 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
        >
          Logout
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
        Login
      </a>
      <a
        href="/auth/login?screen_hint=signup"
        className="py-2 px-3 rounded-md no-underline bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
      >
        Sign up
      </a>
    </div>
  );
}
