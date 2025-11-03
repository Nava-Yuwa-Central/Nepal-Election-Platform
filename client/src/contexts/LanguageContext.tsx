import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ne';

interface Translations {
  [key: string]: {
    en: string;
    ne: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ne: 'गृह' },
  'nav.leaders': { en: 'Leaders', ne: 'नेताहरू' },
  'nav.agendas': { en: 'Agendas', ne: 'एजेन्डा' },
  'nav.leaderboard': { en: 'Leaderboard', ne: 'नेतृत्व बोर्ड' },
  'nav.search': { en: 'Search', ne: 'खोज' },

  // Home page
  'home.hero.title': { en: "Know Your Neta. Shape Nepal's Future.", ne: 'आफ्नो नेता जान्नुहोस्। नेपालको भविष्य आकार दिनुहोस्।' },
  'home.hero.subtitle': { en: 'Rate leaders and agendas. Engage in civic discussions. Build public consensus.', ne: 'नेताहरू र एजेन्डा मूल्यांकन गर्नुहोस्। नागरिक छलफलमा संलग्न हुनुहोस्। सार्वजनिक सहमति निर्माण गर्नुहोस्।' },
  'home.featured': { en: 'Featured Leaders', ne: 'विशेष नेताहरू' },
  'home.trending': { en: 'Trending Leaders', ne: 'ट्रेन्डिङ नेताहरू' },
  'home.discussions': { en: 'Discussion Highlights', ne: 'छलफल हाइलाइटहरू' },

  // Leader profile
  'leader.bio': { en: 'Biography', ne: 'जीवनी' },
  'leader.manifesto': { en: 'Manifesto', ne: 'घोषणापत्र' },
  'leader.agendas': { en: 'Agendas', ne: 'एजेन्डा' },
  'leader.affiliation': { en: 'Affiliation', ne: 'सम्बद्धता' },
  'leader.region': { en: 'Region', ne: 'क्षेत्र' },
  'leader.verified': { en: 'Verified', ne: 'सत्यापित' },
  'leader.discussions': { en: 'Discussions', ne: 'छलफलहरू' },
  'leader.rating': { en: 'Approval Rating', ne: 'अनुमोदन मूल्यांकन' },

  // Voting
  'vote.upvote': { en: 'Upvote', ne: 'माथिको भोट' },
  'vote.downvote': { en: 'Downvote', ne: 'तलको भोट' },
  'vote.upvotes': { en: 'Upvotes', ne: 'माथिको भोटहरू' },
  'vote.downvotes': { en: 'Downvotes', ne: 'तलको भोटहरू' },
  'vote.net': { en: 'Net Approval', ne: 'शुद्ध अनुमोदन' },

  // Comments
  'comment.add': { en: 'Add Comment', ne: 'टिप्पणी जोड्नुहोस्' },
  'comment.placeholder': { en: 'Share your thoughts...', ne: 'आफ्नो विचार साझा गर्नुहोस्...' },
  'comment.submit': { en: 'Post', ne: 'पोस्ट गर्नुहोस्' },
  'comment.cancel': { en: 'Cancel', ne: 'रद्द गर्नुहोस्' },
  'comment.name': { en: 'Name (optional)', ne: 'नाम (वैकल्पिक)' },
  'comment.noComments': { en: 'No comments yet. Be the first to share!', ne: 'अभी कुनै टिप्पणी छैन। पहिलो साझा गर्नुहोस्!' },

  // Leaderboard
  'leaderboard.title': { en: 'Leaderboard', ne: 'नेतृत्व बोर्ड' },
  'leaderboard.rank': { en: 'Rank', ne: 'श्रेणी' },
  'leaderboard.name': { en: 'Name', ne: 'नाम' },
  'leaderboard.score': { en: 'Score', ne: 'स्कोर' },

  // Agendas
  'agenda.title': { en: 'Agendas', ne: 'एजेन्डा' },
  'agenda.category': { en: 'Category', ne: 'श्रेणी' },
  'agenda.description': { en: 'Description', ne: 'विवरण' },
  'agenda.leader': { en: 'Leader', ne: 'नेता' },

  // General
  'general.loading': { en: 'Loading...', ne: 'लोड हो रहेको छ...' },
  'general.error': { en: 'Error loading data', ne: 'डेटा लोड गर्न त्रुटि' },
  'general.noResults': { en: 'No results found', ne: 'कुनै परिणाम फेला परेन' },
  'general.language': { en: 'Language', ne: 'भाषा' },
  'general.english': { en: 'English', ne: 'English' },
  'general.nepali': { en: 'नेपाली', ne: 'नेपाली' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && ['en', 'ne'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
