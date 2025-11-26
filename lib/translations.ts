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
        description: 'Practice the 128 civics questions for the naturalization test'
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
      questionsAvailable: '128 Questions Available',
      readingExercises: 'Reading Comprehension Exercises',
      writingExercises: 'Writing Practice Exercises'
    },

    // Quick Quiz page
    quickQuiz: {
      title: 'Quick Quiz',
      loading: 'Loading quiz...',
      error: 'Unable to load quiz. Please try again.',
      backToPractice: 'Back to Practice',
      loadingQuestion: 'Loading question...',
      nextQuestion: 'Next Question',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      upgradeToPremium: {
        title: 'Upgrade to Premium',
        description: 'Get unlimited quick quizzes, track your progress, and access all 128 civics questions.',
        button: 'Upgrade Now'
      },
      limitWarning: 'You have answered {count} questions today. You have {remaining} question{plural} remaining.',
      limitReachedInline: 'You have reached your daily limit of 10 questions. Upgrade to Premium for unlimited practice!',
      upgradeButton: 'Upgrade to Premium',
      questionsToday: '{count} / 10 questions today',
      dailyLimitReached: 'Daily Limit Reached',
      dailyLimitMessage: 'You have answered {count} questions today. Free accounts are limited to 10 questions per day. Upgrade to Premium for unlimited practice!'
    },

    // Civics Test page
    civicsTest: {
      title: 'Civics Test',
      dailyLimitReached: 'Daily Limit Reached',
      dailyLimitMessage: 'You have answered {count} questions today. Free accounts are limited to 10 questions per day. Upgrade to Premium for unlimited practice!',
      limitWarning: 'You have answered {count} questions today. You have {remaining} question{plural} remaining.',
      limitReachedInline: 'You have reached your daily limit of 10 questions. Upgrade to Premium for unlimited practice!',
      upgradeButton: 'Upgrade to Premium',
      questionsToday: '{count} / 10 questions today'
    },

    // Writing Test page
    writingTest: {
      title: 'Writing Test Practice',
      loading: 'Loading writing practice...',
      error: 'Unable to load writing practice. Please try again.',
      loadingSentence: 'Loading sentence...',
      backToPractice: 'Back to Practice',
      instructions: {
        title: 'How it works:',
        step1: 'Click the speaker button to hear the sentence',
        step2: 'Type what you hear in the text box below',
        step3: 'Click "Check Answer" to see how you did',
        step4: 'You need 80% accuracy or higher to pass'
      },
      playSentence: 'Play Sentence',
      playing: 'Playing...',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      category: 'Category',
      wordCount: 'Word count',
      words: 'words',
      writePrompt: 'Write the sentence you heard:',
      typePlaceholder: 'Type here...',
      checkAnswer: 'Check Answer',
      greatJob: 'Great job!',
      keepPracticing: 'Keep practicing!',
      passMessage: 'You passed! You need 80% or higher.',
      failMessage: 'You need 80% or higher to pass. Try again!',
      yourAnswer: 'Your answer:',
      correctAnswer: 'Correct answer:',
      nextSentence: 'Next Sentence',
      tipsTitle: 'Writing Test Tips',
      tips: {
        tip1: 'Listen carefully to the entire sentence before writing',
        tip2: 'You can replay the audio as many times as needed',
        tip3: 'Capitalization and punctuation matter',
        tip4: 'During the actual test, you have 3 chances to write 1 sentence correctly',
        tip5: 'Practice regularly to improve your spelling and grammar'
      },
      limitWarning: 'You have answered {count} questions today. You have {remaining} question{plural} remaining.',
      limitReachedInline: 'You have reached your daily limit of 10 questions. Upgrade to Premium for unlimited practice!',
      upgradeButton: 'Upgrade to Premium',
      questionsToday: '{count} / 10 questions today'
    },

    // Reading Test page
    readingTest: {
      title: 'Reading Test Practice',
      loading: 'Loading reading practice...',
      error: 'Unable to load reading practice. Please try again.',
      loadingSentence: 'Loading sentence...',
      backToPractice: 'Back to Practice',
      notSupported: 'Speech Recognition Not Supported',
      notSupportedMessage: 'Your browser does not support speech recognition. Please use Chrome, Edge, or Safari for the best experience.',
      micPermission: 'Microphone permission is required. Please allow microphone access and try again.',
      instructions: {
        title: 'How it works:',
        step1: 'Read the sentence displayed above out loud',
        step2: 'Click the microphone button to start listening',
        step3: 'Speak clearly and read the sentence',
        step4: 'Click "Check Answer" to see your accuracy (80% or higher to pass)'
      },
      readPrompt: 'Read this sentence out loud:',
      listenToPronunciation: 'Listen to Pronunciation',
      playing: 'Playing...',
      startListening: 'Start Listening',
      stopListening: 'Stop Listening',
      listening: 'Listening... Speak now',
      yourReading: 'Your reading:',
      checkAnswer: 'Check Answer',
      greatJob: 'Great job!',
      keepPracticing: 'Keep practicing!',
      passMessage: 'You passed! You need 80% or higher.',
      failMessage: 'You need 80% or higher to pass. Try again!',
      correctAnswer: 'Correct answer:',
      nextSentence: 'Next Sentence',
      tipsTitle: 'Reading Test Tips',
      tips: {
        tip1: 'Speak clearly and at a normal pace',
        tip2: 'Make sure your microphone is working and not muted',
        tip3: 'Read the entire sentence before checking your answer',
        tip4: 'During the actual test, you have 3 chances to read 1 sentence correctly',
        tip5: 'Practice regularly to improve your pronunciation and reading fluency'
      },
      limitWarning: 'You have answered {count} questions today. You have {remaining} question{plural} remaining.',
      limitReachedInline: 'You have reached your daily limit of 10 questions. Upgrade to Premium for unlimited practice!',
      upgradeButton: 'Upgrade to Premium',
      questionsToday: '{count} / 10 questions today',
      dailyLimitReached: 'Daily Limit Reached',
      dailyLimitMessage: 'You have answered {count} questions today. Free accounts are limited to 10 questions per day. Upgrade to Premium for unlimited practice!'
    },

    // Premium section
    premium: {
      title: 'Premium Benefits',
      subtitle: 'Unlock advanced features to enhance your learning experience',
      features: {
        questionBank: {
          title: 'Full Question Bank Access',
          description: 'Practice with all 128 official USCIS civics questions'
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
        description: 'Practica las 128 preguntas cívicas para el examen de naturalización'
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
      questionsAvailable: '128 Preguntas Disponibles',
      readingExercises: 'Ejercicios de Comprensión Lectora',
      writingExercises: 'Ejercicios de Práctica de Escritura'
    },

    // Quick Quiz page
    quickQuiz: {
      title: 'Cuestionario Rápido',
      loading: 'Cargando cuestionario...',
      error: 'No se pudo cargar el cuestionario. Por favor, inténtalo de nuevo.',
      backToPractice: 'Volver a Práctica',
      loadingQuestion: 'Cargando pregunta...',
      nextQuestion: 'Siguiente Pregunta',
      correct: '¡Correcto!',
      incorrect: 'Incorrecto',
      upgradeToPremium: {
        title: 'Actualizar a Premium',
        description: 'Obtén cuestionarios rápidos ilimitados, rastrea tu progreso y accede a todas las 128 preguntas cívicas.',
        button: 'Actualizar Ahora'
      },
      limitWarning: 'Has respondido {count} preguntas hoy. Te quedan {remaining} pregunta{plural}.',
      limitReachedInline: 'Has alcanzado tu límite diario de 10 preguntas. ¡Actualiza a Premium para práctica ilimitada!',
      upgradeButton: 'Actualizar a Premium',
      questionsToday: '{count} / 10 preguntas hoy',
      dailyLimitReached: 'Límite Diario Alcanzado',
      dailyLimitMessage: 'Has respondido {count} preguntas hoy. Las cuentas gratuitas están limitadas a 10 preguntas por día. ¡Actualiza a Premium para práctica ilimitada!'
    },

    // Civics Test page
    civicsTest: {
      title: 'Examen Cívico',
      dailyLimitReached: 'Límite Diario Alcanzado',
      dailyLimitMessage: 'Has respondido {count} preguntas hoy. Las cuentas gratuitas están limitadas a 10 preguntas por día. ¡Actualiza a Premium para práctica ilimitada!',
      limitWarning: 'Has respondido {count} preguntas hoy. Te quedan {remaining} pregunta{plural}.',
      limitReachedInline: 'Has alcanzado tu límite diario de 10 preguntas. ¡Actualiza a Premium para práctica ilimitada!',
      upgradeButton: 'Actualizar a Premium',
      questionsToday: '{count} / 10 preguntas hoy'
    },

    // Writing Test page
    writingTest: {
      title: 'Práctica de Examen de Escritura',
      loading: 'Cargando práctica de escritura...',
      error: 'No se pudo cargar la práctica de escritura. Por favor, inténtalo de nuevo.',
      loadingSentence: 'Cargando oración...',
      backToPractice: 'Volver a Práctica',
      instructions: {
        title: 'Cómo funciona:',
        step1: 'Haz clic en el botón del altavoz para escuchar la oración',
        step2: 'Escribe lo que escuchas en el cuadro de texto',
        step3: 'Haz clic en "Verificar Respuesta" para ver cómo te fue',
        step4: 'Necesitas un 80% de precisión o más para aprobar'
      },
      playSentence: 'Reproducir Oración',
      playing: 'Reproduciendo...',
      showHint: 'Mostrar Pista',
      hideHint: 'Ocultar Pista',
      category: 'Categoría',
      wordCount: 'Conteo de palabras',
      words: 'palabras',
      writePrompt: 'Escribe la oración que escuchaste:',
      typePlaceholder: 'Escribe aquí...',
      checkAnswer: 'Verificar Respuesta',
      greatJob: '¡Excelente trabajo!',
      keepPracticing: '¡Sigue practicando!',
      passMessage: '¡Aprobaste! Necesitas un 80% o más.',
      failMessage: 'Necesitas un 80% o más para aprobar. ¡Inténtalo de nuevo!',
      yourAnswer: 'Tu respuesta:',
      correctAnswer: 'Respuesta correcta:',
      nextSentence: 'Siguiente Oración',
      tipsTitle: 'Consejos para el Examen de Escritura',
      tips: {
        tip1: 'Escucha cuidadosamente la oración completa antes de escribir',
        tip2: 'Puedes reproducir el audio tantas veces como necesites',
        tip3: 'Las mayúsculas y la puntuación son importantes',
        tip4: 'Durante el examen real, tienes 3 oportunidades para escribir 1 oración correctamente',
        tip5: 'Practica regularmente para mejorar tu ortografía y gramática'
      },
      limitWarning: 'Has respondido {count} preguntas hoy. Te quedan {remaining} pregunta{plural}.',
      limitReachedInline: 'Has alcanzado tu límite diario de 10 preguntas. ¡Actualiza a Premium para práctica ilimitada!',
      upgradeButton: 'Actualizar a Premium',
      questionsToday: '{count} / 10 preguntas hoy'
    },

    // Reading Test page
    readingTest: {
      title: 'Práctica de Examen de Lectura',
      loading: 'Cargando práctica de lectura...',
      error: 'No se pudo cargar la práctica de lectura. Por favor, inténtalo de nuevo.',
      loadingSentence: 'Cargando oración...',
      backToPractice: 'Volver a Práctica',
      notSupported: 'Reconocimiento de Voz No Compatible',
      notSupportedMessage: 'Tu navegador no admite reconocimiento de voz. Por favor, usa Chrome, Edge o Safari para la mejor experiencia.',
      micPermission: 'Se requiere permiso del micrófono. Por favor, permite el acceso al micrófono e inténtalo de nuevo.',
      instructions: {
        title: 'Cómo funciona:',
        step1: 'Lee la oración mostrada arriba en voz alta',
        step2: 'Haz clic en el botón del micrófono para comenzar a escuchar',
        step3: 'Habla claramente y lee la oración',
        step4: 'Haz clic en "Verificar Respuesta" para ver tu precisión (80% o más para aprobar)'
      },
      readPrompt: 'Lee esta oración en voz alta:',
      listenToPronunciation: 'Escuchar Pronunciación',
      playing: 'Reproduciendo...',
      startListening: 'Comenzar a Escuchar',
      stopListening: 'Dejar de Escuchar',
      listening: 'Escuchando... Habla ahora',
      yourReading: 'Tu lectura:',
      checkAnswer: 'Verificar Respuesta',
      greatJob: '¡Excelente trabajo!',
      keepPracticing: '¡Sigue practicando!',
      passMessage: '¡Aprobaste! Necesitas un 80% o más.',
      failMessage: 'Necesitas un 80% o más para aprobar. ¡Inténtalo de nuevo!',
      correctAnswer: 'Respuesta correcta:',
      nextSentence: 'Siguiente Oración',
      tipsTitle: 'Consejos para el Examen de Lectura',
      tips: {
        tip1: 'Habla claramente y a un ritmo normal',
        tip2: 'Asegúrate de que tu micrófono funcione y no esté silenciado',
        tip3: 'Lee la oración completa antes de verificar tu respuesta',
        tip4: 'Durante el examen real, tienes 3 oportunidades para leer 1 oración correctamente',
        tip5: 'Practica regularmente para mejorar tu pronunciación y fluidez de lectura'
      },
      limitWarning: 'Has respondido {count} preguntas hoy. Te quedan {remaining} pregunta{plural}.',
      limitReachedInline: 'Has alcanzado tu límite diario de 10 preguntas. ¡Actualiza a Premium para práctica ilimitada!',
      upgradeButton: 'Actualizar a Premium',
      questionsToday: '{count} / 10 preguntas hoy',
      dailyLimitReached: 'Límite Diario Alcanzado',
      dailyLimitMessage: 'Has respondido {count} preguntas hoy. Las cuentas gratuitas están limitadas a 10 preguntas por día. ¡Actualiza a Premium para práctica ilimitada!'
    },

    // Premium section
    premium: {
      title: 'Beneficios Premium',
      subtitle: 'Desbloquea funciones avanzadas para mejorar tu experiencia de aprendizaje',
      features: {
        questionBank: {
          title: 'Acceso Completo al Banco de Preguntas',
          description: 'Practica con todas las 128 preguntas cívicas oficiales del USCIS'
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