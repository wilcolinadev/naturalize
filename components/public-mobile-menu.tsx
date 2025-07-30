'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './language-switcher'
import { ThemeSwitcher } from './theme-switcher'

type PublicMobileMenuProps = {
  language: 'en' | 'es';
  translations: {
    language: string;
    english: string;
    spanish: string;
  };
  userName?: string | null;
  isAuthenticated?: boolean;
}

export function PublicMobileMenu({ language, translations, userName, isAuthenticated }: PublicMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="block md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 py-2 bg-card border rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 space-y-4">
            <div className="flex items-center justify-between">
              <ThemeSwitcher />
              <LanguageSwitcher 
                currentLanguage={language}
                translations={translations}
              />
            </div>
            
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  {userName && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Hey, {userName}!
                    </div>
                  )}
                  <a
                    href="/auth/logout"
                    className="block w-full py-2 px-3 text-center rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/auth/login"
                    className="block w-full py-2 px-3 text-center rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-sm"
                  >
                    Login
                  </a>
                  <a
                    href="/auth/login?screen_hint=signup"
                    className="block w-full py-2 px-3 text-center rounded-md no-underline bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                  >
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 