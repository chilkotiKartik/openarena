"use client"

import { useCallback, useEffect, useState } from "react"

// Mock translations
const translations = {
  en: {
    hero: {
      title: "Collab-Sphere",
      subtitle: "A gamified, multilingual collaboration platform for developers worldwide",
      cta: "Find a Project",
      secondary: "Explore Learning Tracks",
    },
    features: {
      title: "Platform Features",
      subtitle: "Everything you need to collaborate effectively and grow your skills",
      multilingual: {
        title: "Multilingual Support",
        description: "Collaborate with developers from around the world with real-time translation",
      },
      matchmaking: {
        title: "Smart Matchmaking",
        description: "Find the perfect project or team members based on skills, interests, and goals",
      },
      gamification: {
        title: "Gamified Learning",
        description: "Earn points, badges, and level up as you complete projects and help others",
      },
      liveCode: {
        title: "Live Collaboration",
        description: "Code together in real-time with integrated chat, video, and code sharing",
      },
      openSource: {
        title: "Open Source Friendly",
        description: "Seamless GitHub integration and tools designed for open source contribution",
      },
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "Hear from developers who have grown their skills on our platform",
      alex: "Collab-Sphere X helped me find my first open source project. The mentorship and gamification made learning fun and engaging!",
      priya:
        "As a non-native English speaker, the translation features made it possible for me to collaborate with teams worldwide.",
      miguel:
        "I went from beginner to landing a junior dev role in 6 months thanks to the projects and connections I made here.",
    },
    cta: {
      title: "Ready to Start Collaborating?",
      subtitle: "Join thousands of developers already building amazing projects together",
      button: "Get Started Now",
    },
    footer: {
      platform: "Platform",
      resources: "Resources",
      company: "Company",
      legal: "Legal",
      rights: "All rights reserved.",
      links: {
        projectMatcher: "Project Matcher",
        matchmaking: "Team Matchmaking",
        dashboard: "Dashboard",
        learningTracks: "Learning Tracks",
        discussions: "Discussions",
        posterGenerator: "Poster Generator",
        about: "About Us",
        contact: "Contact",
        careers: "Careers",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
      },
    },
    mentors: {
      title: "Expert Mentors",
      subtitle: "Learn from industry professionals who are passionate about helping you grow",
      cta: "Become a Mentor",
      availability: "Availability",
      expertise: "Areas of Expertise",
      experience: "Years of Experience",
      sessions: "Sessions Completed",
      rating: "Rating",
      bookSession: "Book a Session",
      viewProfile: "View Full Profile",
    },
    chatbot: {
      title: "AI Assistant",
      subtitle: "Get instant help with coding questions, project ideas, and more",
      placeholder: "Ask me anything about coding or collaboration...",
      send: "Send",
      suggestions: {
        title: "Try asking about:",
        items: [
          "How to find a good first project?",
          "Tips for remote collaboration",
          "Recommended learning resources",
          "How to prepare for technical interviews",
        ],
      },
    },
  },
  es: {
    hero: {
      title: "Collab-Sphere",
      subtitle: "Una plataforma de colaboración gamificada y multilingüe para desarrolladores de todo el mundo",
      cta: "Encontrar un Proyecto",
      secondary: "Explorar Rutas de Aprendizaje",
    },
    features: {
      title: "Características de la Plataforma",
      subtitle: "Todo lo que necesitas para colaborar efectivamente y desarrollar tus habilidades",
      multilingual: {
        title: "Soporte Multilingüe",
        description: "Colabora con desarrolladores de todo el mundo con traducción en tiempo real",
      },
      matchmaking: {
        title: "Emparejamiento Inteligente",
        description: "Encuentra el proyecto perfecto o miembros del equipo basado en habilidades, intereses y metas",
      },
      gamification: {
        title: "Aprendizaje Gamificado",
        description: "Gana puntos, insignias y sube de nivel mientras completas proyectos y ayudas a otros",
      },
      liveCode: {
        title: "Colaboración en Vivo",
        description: "Programa junto a otros en tiempo real con chat integrado, video y compartición de código",
      },
      openSource: {
        title: "Compatible con Open Source",
        description: "Integración perfecta con GitHub y herramientas diseñadas para contribución open source",
      },
    },
    testimonials: {
      title: "Historias de Éxito",
      subtitle: "Escucha a los desarrolladores que han mejorado sus habilidades en nuestra plataforma",
      alex: "Collab-Sphere X me ayudó a encontrar mi primer proyecto open source. ¡La mentoría y gamificación hicieron que aprender fuera divertido y atractivo!",
      priya:
        "Como hablante no nativa de inglés, las funciones de traducción me permitieron colaborar con equipos de todo el mundo.",
      miguel:
        "Pasé de principiante a conseguir un puesto de desarrollador junior en 6 meses gracias a los proyectos y conexiones que hice aquí.",
    },
    cta: {
      title: "¿Listo para Empezar a Colaborar?",
      subtitle: "Únete a miles de desarrolladores que ya están construyendo proyectos increíbles juntos",
      button: "Comenzar Ahora",
    },
    footer: {
      platform: "Plataforma",
      resources: "Recursos",
      company: "Empresa",
      legal: "Legal",
      rights: "Todos los derechos reservados.",
      links: {
        projectMatcher: "Buscador de Proyectos",
        matchmaking: "Emparejamiento de Equipos",
        dashboard: "Panel de Control",
        learningTracks: "Rutas de Aprendizaje",
        discussions: "Discusiones",
        posterGenerator: "Generador de Pósters",
        about: "Sobre Nosotros",
        contact: "Contacto",
        careers: "Carreras",
        terms: "Términos de Servicio",
        privacy: "Política de Privacidad",
        cookies: "Política de Cookies",
      },
    },
    mentors: {
      title: "Mentores Expertos",
      subtitle: "Aprende de profesionales de la industria apasionados por ayudarte a crecer",
      cta: "Conviértete en Mentor",
      availability: "Disponibilidad",
      expertise: "Áreas de Experiencia",
      experience: "Años de Experiencia",
      sessions: "Sesiones Completadas",
      rating: "Calificación",
      bookSession: "Reservar una Sesión",
      viewProfile: "Ver Perfil Completo",
    },
    chatbot: {
      title: "Asistente IA",
      subtitle: "Obtén ayuda instantánea con preguntas de programación, ideas de proyectos y más",
      placeholder: "Pregúntame cualquier cosa sobre programación o colaboración...",
      send: "Enviar",
      suggestions: {
        title: "Intenta preguntar sobre:",
        items: [
          "¿Cómo encontrar un buen primer proyecto?",
          "Consejos para colaboración remota",
          "Recursos de aprendizaje recomendados",
          "Cómo prepararse para entrevistas técnicas",
        ],
      },
    },
  },
  fr: {
    hero: {
      title: "Collab-Sphere",
      subtitle: "Une plateforme de collaboration ludique et multilingue pour les développeurs du monde entier",
      cta: "Trouver un Projet",
      secondary: "Explorer les Parcours d'Apprentissage",
    },
    features: {
      title: "Fonctionnalités de la Plateforme",
      subtitle: "Tout ce dont vous avez besoin pour collaborer efficacement et développer vos compétences",
      multilingual: {
        title: "Support Multilingue",
        description: "Collaborez avec des développeurs du monde entier grâce à la traduction en temps réel",
      },
      matchmaking: {
        title: "Matchmaking Intelligent",
        description:
          "Trouvez le projet parfait ou les membres de l'équipe en fonction des compétences, des intérêts et des objectifs",
      },
      gamification: {
        title: "Apprentissage Ludique",
        description:
          "Gagnez des points, des badges et montez de niveau en complétant des projets et en aidant les autres",
      },
      liveCode: {
        title: "Collaboration en Direct",
        description: "Codez ensemble en temps réel avec chat intégré, vidéo et partage de code",
      },
      openSource: {
        title: "Compatible Open Source",
        description: "Intégration transparente avec GitHub et outils conçus pour la contribution open source",
      },
    },
    testimonials: {
      title: "Histoires de Réussite",
      subtitle: "Écoutez les développeurs qui ont amélioré leurs compétences sur notre plateforme",
      alex: "Collab-Sphere X m'a aidé à trouver mon premier projet open source. Le mentorat et la gamification ont rendu l'apprentissage amusant et engageant !",
      priya:
        "En tant que non-anglophone, les fonctionnalités de traduction m'ont permis de collaborer avec des équipes du monde entier.",
      miguel:
        "Je suis passé de débutant à l'obtention d'un poste de développeur junior en 6 mois grâce aux projets et aux connexions que j'ai établis ici.",
    },
    cta: {
      title: "Prêt à Commencer à Collaborer ?",
      subtitle: "Rejoignez des milliers de développeurs qui construisent déjà des projets incroyables ensemble",
      button: "Commencer Maintenant",
    },
    footer: {
      platform: "Plateforme",
      resources: "Ressources",
      company: "Entreprise",
      legal: "Légal",
      rights: "Tous droits réservés.",
      links: {
        projectMatcher: "Recherche de Projets",
        matchmaking: "Matchmaking d'Équipe",
        dashboard: "Tableau de Bord",
        learningTracks: "Parcours d'Apprentissage",
        discussions: "Discussions",
        posterGenerator: "Générateur d'Affiches",
        about: "À Propos de Nous",
        contact: "Contact",
        careers: "Carrières",
        terms: "Conditions d'Utilisation",
        privacy: "Politique de Confidentialité",
        cookies: "Politique de Cookies",
      },
    },
    mentors: {
      title: "Mentors Experts",
      subtitle: "Apprenez des professionnels de l'industrie passionnés par votre développement",
      cta: "Devenir Mentor",
      availability: "Disponibilité",
      expertise: "Domaines d'Expertise",
      experience: "Années d'Expérience",
      sessions: "Sessions Complétées",
      rating: "Évaluation",
      bookSession: "Réserver une Session",
      viewProfile: "Voir le Profil Complet",
    },
    chatbot: {
      title: "Assistant IA",
      subtitle: "Obtenez une aide instantanée pour vos questions de codage, idées de projets et plus",
      placeholder: "Posez-moi n'importe quelle question sur le codage ou la collaboration...",
      send: "Envoyer",
      suggestions: {
        title: "Essayez de demander :",
        items: [
          "Comment trouver un bon premier projet ?",
          "Conseils pour la collaboration à distance",
          "Ressources d'apprentissage recommandées",
          "Comment se préparer aux entretiens techniques",
        ],
      },
    },
  },
}

// Type for the translation function
type TranslationFunction = (key: string) => string

// Hook for accessing translations
export function useTranslation() {
  const [language, setLanguage] = useState("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Function to change the language
  const changeLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }, [])

  // Translation function
  const t: TranslationFunction = useCallback(
    (key: string) => {
      // Split the key by dots to access nested properties
      const keys = key.split(".")

      // Get the current language translations
      const currentTranslations = translations[language as keyof typeof translations] || translations.en

      // Navigate through the nested properties
      let result: any = currentTranslations
      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k]
        } else {
          // Fallback to English if key not found
          let fallback = translations.en
          for (const k of keys) {
            if (fallback && typeof fallback === "object" && k in fallback) {
              fallback = fallback[k]
            } else {
              return key // Return the key itself if not found in fallback
            }
          }
          return typeof fallback === "string" ? fallback : key
        }
      }

      return typeof result === "string" ? result : key
    },
    [language],
  )

  return {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations),
  }
}
