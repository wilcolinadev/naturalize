import { Language } from './translations';
import civicsDataEn from './civics-questions.json';
import civicsDataEs from './civics-questions-es.json';

export type CivicsQuestion = typeof civicsDataEn.questions[0];
export type CivicsSection = typeof civicsDataEn.sections;

export function getCivicsData(language: Language = 'en') {
  return language === 'en' ? civicsDataEn : civicsDataEs;
}

export function getRandomQuestion(language: Language = 'en'): CivicsQuestion {
  const questions = getCivicsData(language).questions;
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

export function getQuestionsForUser(userPlan: string, language: Language = 'en') {
  const allQuestions = getCivicsData(language).questions;
  
  // Shuffle questions for all users to ensure random order
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  
  if (userPlan === 'premium') {
    // Premium users get all questions in random order
    return shuffled;
  } else {
    // Free users can access questions (daily limit enforced in the page)
    return shuffled;
  }
} 