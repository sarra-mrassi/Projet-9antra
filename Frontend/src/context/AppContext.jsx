import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const translations = {
  fr: {
    home: "Accueil",
    search: "Rechercher",
    about: "À propos",
    mySpace: "Mon Espace",
    login: "Se connecter",
    register: "S'inscrire",
    logout: "Déconnexion",
    hello: "Bonjour",
    heroTitle_1: "Gagnez du temps.",
    heroTitle_2: "Planifiez vos réservations avec",
    heroPlaceholder: "Quel service, hôtel, restaurant ou pro ?",
    searchBtn: "Rechercher",
    allCategories: "Toutes les catégories",
    browseByCategory: "Parcourez par catégorie",
    categorySubtitle: "Découvrez des professionnels rigoureusement sélectionnés près de chez vous",
    doctors: "Médecins",
    doctorsDesc: "Trouvez un médecin spécialiste (ophtalmologue, etc.) et réservez votre consultation.",
    beauty: "Beauté",
    beautyDesc: "Salons de coiffure, spas, massages et soins d’éclat corporel.",
    restaurants: "Restaurants",
    restaurantsDesc: "Réservez la table de votre choix (vue mer, terrasse, fenêtre) en direct.",
    hotels: "Hôtels",
    hotelsDesc: "Réservez des séjours, suites ou chambres selon la vue (mer/jardin) ou le prix.",
    clinics: "Cliniques",
    clinicsDesc: "Bilans de santé globaux, radiologie et cliniques privées.",
    infirmiere: "Infirmier(e)s",
    infirmiereDesc: "Soins à domicile, injections, pansements et suivi médical personnalisé.",
    trust_title_1: "Dispo 24h/7",
    trust_desc_1: "Réservez à tout moment, depuis votre ordinateur ou votre mobile.",
    trust_title_2: "Professionnels vérifiés",
    trust_desc_2: "Tous les prestataires sont agréés et notés par de vrais clients.",
    trust_title_3: "Réservation sécurisée",
    trust_desc_3: "Annulation sans frais et notifications de rappels SMS / Email.",
    featuredServices: "Services Populaires",
    featuredSubtitle: "Découvrez les prestations les plus demandées en ce moment",
    loading: "Chargement...",
    noServices: "Aucun service disponible pour le moment.",
    bookNow: "Réserver",
    from: "à partir de",
    dt: "DT",
    themeLight: "Mode Clair",
    themeDark: "Mode Sombre",
    viewAll: "Voir tout"
  },
  en: {
    home: "Home",
    search: "Search",
    about: "About",
    mySpace: "My Space",
    login: "Login",
    register: "Register",
    logout: "Logout",
    hello: "Hello",
    heroTitle_1: "Save your time.",
    heroTitle_2: "Plan your bookings with",
    heroPlaceholder: "What service, hotel, restaurant or pro?",
    searchBtn: "Search",
    allCategories: "All categories",
    browseByCategory: "Browse by Category",
    categorySubtitle: "Discover rigorously selected professionals near you",
    doctors: "Doctors",
    doctorsDesc: "Find a medical specialist (ophthalmologist, etc.) and book your consultation.",
    beauty: "Beauty",
    beautyDesc: "Hair salons, spas, massages and body care treatment.",
    restaurants: "Restaurants",
    restaurantsDesc: "Book the table of your choice (sea view, terrace, window) live.",
    hotels: "Hotels",
    hotelsDesc: "Book stays, suites or rooms according to the view (sea/garden) or price.",
    clinics: "Clinics",
    clinicsDesc: "Global health checks, radiology and private clinics.",
    infirmiere: "Nurses",
    infirmiereDesc: "Home care, injections, dressings and personalized medical assistance.",
    trust_title_1: "Available 24/7",
    trust_desc_1: "Book at any time, from your computer or mobile.",
    trust_title_2: "Verified Pros",
    trust_desc_2: "All service providers are certified and rated by real clients.",
    trust_title_3: "Secure Booking",
    trust_desc_3: "Free cancellation and SMS / Email reminder notifications.",
    featuredServices: "Popular Services",
    featuredSubtitle: "Discover the most requested services right now",
    loading: "Loading...",
    noServices: "No services available right now.",
    bookNow: "Book",
    from: "starting from",
    dt: "DT",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    viewAll: "View All"
  },
  ar: {
    home: "الرئيسية",
    search: "بحث",
    about: "حول",
    mySpace: "حسابي",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    hello: "مرحبًا",
    heroTitle_1: "وفر وقتك.",
    heroTitle_2: "خطط لحجوزاتك مع",
    heroPlaceholder: "ما هي الخدمة، الفندق، المطعم أو المحترف؟",
    searchBtn: "بحث",
    allCategories: "جميع الفئات",
    browseByCategory: "تصفح حسب الفئة",
    categorySubtitle: "اكتشف محترفين مختارين بعناية بالقرب منك",
    doctors: "الأطباء",
    doctorsDesc: "ابحث عن طبيب مختص (عيون، إلخ) واحجز موعد استشارتك.",
    beauty: "الجمال",
    beautyDesc: "صالونات الحلاقة، المنتجعات الصحية، التدليك والعناية بالجسم.",
    restaurants: "المطاعم",
    restaurantsDesc: "احجز الطاولة التي تختارها (إطلالة بحرية، شرفة، نافذة) مباشرة.",
    hotels: "الفنادق",
    hotelsDesc: "احجز إقامات، أجنحة أو غرف حسب الإطلالة (بحر/حديقة) أو السعر.",
    clinics: "العيادات",
    clinicsDesc: "فحوصات صحية شاملة، الأشعة والعيادات الخاصة.",
    infirmiere: "ممرضون",
    infirmiereDesc: "الرعاية المنزلية، الحقن، الضمادات والمساعدة الطبية المخصصة.",
    trust_title_1: "متاح 24/7",
    trust_desc_1: "احجز في أي وقت، من جهاز الكمبيوتر أو الهاتف الخاص بك.",
    trust_title_2: "محترفون موثوقون",
    trust_desc_2: "جميع مقدمي الخدمات معتمدون ومقيمون من قبل عملاء حقيقيين.",
    trust_title_3: "حجز آمن",
    trust_desc_3: "إلغاء مجاني وإشعارات تذكير عبر الرسائل القصيرة / البريد الإلكتروني.",
    featuredServices: "الخدمات الشائعة",
    featuredSubtitle: "اكتشف الخدمات الأكثر طلباً في الوقت الحالي",
    loading: "جاري التحميل...",
    noServices: "لا توجد خدمات متاحة حالياً.",
    bookNow: "احجز الآن",
    from: "ابتداءً من",
    dt: "د.ت",
    themeLight: "الوضع المضيء",
    themeDark: "الوضع المظلم",
    viewAll: "عرض الكل"
  }
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang ? savedLang : 'fr';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    const html = document.documentElement;
    if (language === 'ar') {
      html.dir = 'rtl';
      html.lang = 'ar';
    } else {
      html.dir = 'ltr';
      html.lang = language;
    }
  }, [language]);

  const t = (key) => {
    const langObj = translations[language] || translations.fr;
    return langObj[key] || translations.fr[key] || key;
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
