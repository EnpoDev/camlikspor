export const i18n = {
  defaultLocale: "tr",
  locales: ["tr", "en", "es"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeNames: Record<Locale, string> = {
  tr: "Turkce",
  en: "English",
  es: "Espanol",
};
