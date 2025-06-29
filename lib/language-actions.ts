'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Language } from './translations';

export async function setLanguage(language: Language) {
  const cookieStore = await cookies();
  cookieStore.set('language', language, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
}

export async function getCurrentLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get('language')?.value as Language;
  return lang && (lang === 'en' || lang === 'es') ? lang : 'en';
}

export async function switchLanguage(language: Language, currentPath: string = '/') {
  await setLanguage(language);
  redirect(currentPath);
} 