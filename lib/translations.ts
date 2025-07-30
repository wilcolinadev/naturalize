export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navigation
    siteTitle: 'NaturalizeUS',
    login: 'Login',
    signup: 'Sign up',
    logout: 'Logout',
    
    // Home page
    hero: {
      title: 'NaturalizeUS',
      subtitle: 'Master the U.S. Naturalization Test with interactive quizzes, reading practice, and progress tracking.'
    },
    
    // Features
    features: {
      title: 'Everything you need to succeed',
      subtitle: 'Comprehensive tools and resources for your citizenship journey',
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

    // Dashboard
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
      }
    },

    // Practice page
    practice: {
      title: 'Practice Center',
      subtitle: 'Improve your English skills with interactive quizzes and exercises',
      chooseYourPractice: 'Choose Your Practice',
      stats: {
        totalQuestions: 'Total Questions',
        studyTime: 'Study Time (mins)',
        bestScore: 'Best Score'
      },
      quickQuiz: {
        title: 'Quick Quiz',
        description: 'Fast-paced single questions with instant feedback',
        start: 'Start Quick Quiz',
        feedback: 'Instant Feedback'
      },
      comingSoon: 'Coming Soon',
      questionsAvailable: '100 Questions Available',
      readingExercises: 'Reading Comprehension Exercises',
      writingExercises: 'Writing Practice Exercises'
    },

    // Premium section
    premium: {
      title: 'Premium Benefits',
      subtitle: 'Unlock advanced features to enhance your learning experience',
      features: {
        questionBank: {
          title: 'Full Question Bank Access',
          description: 'Practice with all 100 official USCIS civics questions'
        },
        progress: {
          title: 'Progress Tracking',
          description: 'Monitor your improvement and focus on weak areas'
        },
        bilingual: {
          title: 'Bilingual Support',
          description: 'Study in both English and Spanish'
        }
      },
      plan: {
        title: 'Premium Plan',
        description: 'Get unlimited access to all features and maximize your chances of success.',
        cta: 'Get Started'
      }
    },
    
    // Actions
    startPracticing: 'Start Practicing',
    startQuiz: 'Start Quiz',
    practiceReading: 'Practice Reading',
    practiceWriting: 'Practice Writing',
    
    // Footer
    footer: 'Built to help you achieve your American dream 🇺🇸',
    
    // Language
    language: 'Language',
    english: 'English',
    spanish: 'Spanish'
  },
  es: {
    // Navigation
    siteTitle: 'NaturalizeUS',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
    
    // Home page
    hero: {
      title: 'NaturalizeUS',
      subtitle: 'Domina el Examen de Naturalización de EE.UU. con cuestionarios interactivos, práctica de lectura y seguimiento de progreso.'
    },
    
    // Features
    features: {
      title: 'Todo lo que necesitas para tener éxito',
      subtitle: 'Herramientas y recursos completos para tu camino hacia la ciudadanía',
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

    // Dashboard
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
      }
    },

    // Practice page
    practice: {
      title: 'Centro de Práctica',
      subtitle: 'Mejora tus habilidades en inglés con cuestionarios y ejercicios interactivos',
      chooseYourPractice: 'Elige Tu Práctica',
      stats: {
        totalQuestions: 'Total de Preguntas',
        studyTime: 'Tiempo de Estudio (mins)',
        bestScore: 'Mejor Puntuación'
      },
      quickQuiz: {
        title: 'Cuestionario Rápido',
        description: 'Preguntas individuales rápidas con retroalimentación instantánea',
        start: 'Iniciar Cuestionario Rápido',
        feedback: 'Retroalimentación Instantánea'
      },
      comingSoon: 'Próximamente',
      questionsAvailable: '100 Preguntas Disponibles',
      readingExercises: 'Ejercicios de Comprensión Lectora',
      writingExercises: 'Ejercicios de Práctica de Escritura'
    },

    // Premium section
    premium: {
      title: 'Beneficios Premium',
      subtitle: 'Desbloquea funciones avanzadas para mejorar tu experiencia de aprendizaje',
      features: {
        questionBank: {
          title: 'Acceso Completo al Banco de Preguntas',
          description: 'Practica con todas las 100 preguntas cívicas oficiales del USCIS'
        },
        progress: {
          title: 'Seguimiento de Progreso',
          description: 'Monitorea tu mejora y concéntrate en las áreas débiles'
        },
        bilingual: {
          title: 'Soporte Bilingüe',
          description: 'Estudia tanto en inglés como en español'
        }
      },
      plan: {
        title: 'Plan Premium',
        description: 'Obtén acceso ilimitado a todas las funciones y maximiza tus posibilidades de éxito.',
        cta: 'Comenzar'
      }
    },
    
    // Actions
    startPracticing: 'Comenzar a Practicar',
    startQuiz: 'Comenzar Cuestionario',
    practiceReading: 'Practicar Lectura',
    practiceWriting: 'Practicar Escritura',
    
    // Footer
    footer: 'Construido para ayudarte a lograr tu sueño americano 🇺🇸',
    
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