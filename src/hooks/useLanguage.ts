import { useEffect, useState } from "react";
import type { Language } from "../types/Language";
import { ptBR } from "../locales/pt-BR";
import { en } from "../locales/en";

const translations = {
  "pt-BR": ptBR,
  en,
};

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage === "pt-BR" || savedLanguage === "en") {
      return savedLanguage;
    }

    return "pt-BR";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((currentLanguage) =>
      currentLanguage === "pt-BR" ? "en" : "pt-BR"
    );
  }

  return {
    language,
    toggleLanguage,
    t: translations[language],
  };
}