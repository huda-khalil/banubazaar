import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import faTranslation from "../locales/fa/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  fa: {
    translation: faTranslation,
  },
};

// Get the saved language from localStorage (if any)
const savedLanguage = localStorage.getItem("i18nextLng") || "en";

// Set the dir IMMEDIATELY before i18n initializes
if (savedLanguage === "fa") {
  document.documentElement.dir = "rtl";
} else {
  document.documentElement.dir = "ltr";
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Also update dir when language changes
i18n.on("languageChanged", (lng) => {
  if (lng === "fa") {
    document.documentElement.dir = "rtl";
  } else {
    document.documentElement.dir = "ltr";
  }
});

export default i18n;
