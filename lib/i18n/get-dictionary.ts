import "server-only";
import type { Locale } from "./config";

const dictionaries = {
  tr: () => import("@/dictionaries/tr.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.tr();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
