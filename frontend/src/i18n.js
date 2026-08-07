import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Eses from "./locales/Es-es.json";
import Enus from "./locales/En-us.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: Enus,
      es: Eses,
    },
    fallbackLng: "es",
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

// Restore the language chosen on a previous visit
i18n.changeLanguage(localStorage.getItem('lang') || 'es');

export default i18n;
