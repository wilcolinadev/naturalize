'use client';

import { useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';
import { switchLanguage } from '@/lib/language-actions';

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'es';
  translations: {
    language: string;
    english: string;
    spanish: string;
  };
}

export function LanguageSwitcher({ currentLanguage, translations }: LanguageSwitcherProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  const handleLanguageChange = async (lang: 'en' | 'es') => {
    if (lang === currentLanguage) return;
    
    setIsChanging(true);
    
    startTransition(async () => {
      await switchLanguage(lang, pathname);
    });
  };

  const isLoading = isChanging || isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isLoading}>
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{translations.language}</span>
          <span className="text-xs">{currentLanguage.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')} 
          className="cursor-pointer"
          disabled={currentLanguage === 'en' || isLoading}
        >
          🇺🇸 {translations.english}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')} 
          className="cursor-pointer"
          disabled={currentLanguage === 'es' || isLoading}
        >
          🇪🇸 {translations.spanish}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 