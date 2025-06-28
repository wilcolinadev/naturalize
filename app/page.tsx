import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>🇺🇸 U.S. Citizenship Practice</Link>
            </div>
            <AuthButton />
          </div>
        </nav>
        
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="flex flex-col gap-16 items-center">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                🇺🇸 U.S. Citizenship Practice
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl">
                Master the U.S. Naturalization Test with interactive quizzes, reading practice, and progress tracking.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold mb-2">Interactive Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Practice with official USCIS questions in English and Spanish
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-lg font-semibold mb-2">Reading & Writing</h3>
                <p className="text-sm text-muted-foreground">
                  Master the reading and writing portions of the test
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your improvement and identify areas to focus on
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/protected" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Start Practicing
              </Link>
            </div>
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Built to help you achieve your American dream 🇺🇸
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
