export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navigation
    siteTitle: 'U.S. Citizenship Practice',
    login: 'Login',
    signup: 'Sign up',
    logout: 'Logout',
    
    // Home page
    hero: {
      title: 'U.S. Citizenship Practice',
      subtitle: 'Master the U.S. Naturalization Test with interactive quizzes, reading practice, and progress tracking.'
    },
    
    // Features
    features: {
      quizzes: {
        title: 'Interactive Quizzes',
        description: 'Practice with official USCIS questions in English and Spanish'
      },
      reading: {
        title: 'Reading & Writing',
        description: 'Master the reading and writing portions of the test'
      },
      progress: {
        title: 'Track Progress',
        description: 'Monitor your improvement and identify areas to focus on'
      }
    },
    
    // Actions
    startPracticing: 'Start Practicing',
    startQuiz: 'Start Quiz',
    practiceReading: 'Practice Reading',
    practiceWriting: 'Practice Writing',
    
    // Protected page
    dashboard: {
      welcome: 'Welcome to your citizenship practice dashboard!',
      title: 'Practice Dashboard',
      subtitle: 'Ready to continue your citizenship journey?',
      civicsTest: {
        title: '📚 Civics Test',
        description: 'Practice the 100 civics questions for the naturalization test'
      },
      readingTest: {
        title: '✍️ Reading Test',
        description: 'Practice reading sentences about civics and history'
      },
      writingTest: {
        title: '📝 Writing Test',
        description: 'Practice writing sentences about civics and history'
      },
      progressTitle: '📊 Your Progress',
      progressComingSoon: 'Progress tracking coming soon! Start practicing to see your improvement over time.'
    },
    
    // Footer
    footer: 'Built to help you achieve your American dream 🇺🇸',
    
    // Greetings
    hey: 'Hey',
    
    // Language
    language: 'Language',
    english: 'English',
    spanish: 'Spanish'
  },
  es: {
    // Navigation
    siteTitle: 'Práctica de Ciudadanía Estadounidense',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
    
    // Home page
    hero: {
      title: '🇺🇸 Práctica de Ciudadanía Estadounidense',
      subtitle: 'Domina el Examen de Naturalización de EE.UU. con cuestionarios interactivos, práctica de lectura y seguimiento de progreso.'
    },
    
    // Features
    features: {
      quizzes: {
        title: 'Cuestionarios Interactivos',
        description: 'Practica con preguntas oficiales del USCIS en inglés y español'
      },
      reading: {
        title: 'Lectura y Escritura',
        description: 'Domina las partes de lectura y escritura del examen'
      },
      progress: {
        title: 'Seguir Progreso',
        description: 'Monitorea tu mejora e identifica áreas en las que enfocarte'
      }
    },
    
    // Actions
    startPracticing: 'Comenzar a Practicar',
    startQuiz: 'Comenzar Cuestionario',
    practiceReading: 'Practicar Lectura',
    practiceWriting: 'Practicar Escritura',
    
    // Protected page
    dashboard: {
      welcome: '¡Bienvenido a tu panel de práctica de ciudadanía!',
      title: 'Panel de Práctica',
      subtitle: '¿Listo para continuar tu viaje hacia la ciudadanía?',
      civicsTest: {
        title: '📚 Examen Cívico',
        description: 'Practica las 100 preguntas cívicas para el examen de naturalización'
      },
      readingTest: {
        title: '✍️ Examen de Lectura',
        description: 'Practica leyendo oraciones sobre civismo e historia'
      },
      writingTest: {
        title: '📝 Examen de Escritura',
        description: 'Practica escribiendo oraciones sobre civismo e historia'
      },
      progressTitle: '📊 Tu Progreso',
      progressComingSoon: '¡El seguimiento de progreso viene pronto! Comienza a practicar para ver tu mejora con el tiempo.'
    },
    
    // Footer
    footer: 'Construido para ayudarte a lograr tu sueño americano 🇺🇸',
    
    // Greetings
    hey: 'Hola',
    
    // Language
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español'
  }
} as const;

// Simple function to get translations for a specific language
export function getTranslations(language: Language = 'en') {
  return {
    language,
    t: (key: string): string => {
      const keys = key.split('.');
      let value: unknown = translations[language];
      
      for (const k of keys) {
        if (typeof value === 'object' && value !== null && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    }
  };
} 