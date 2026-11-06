export const locales = ['zh-CN', 'en'] as const;
export type Locale = typeof locales[number];
export function localeFromPath(path: string): Locale {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh-CN';
}
export function sourcePath(path: string) {
  return path.replace(/^\/(en)(?=\/|$)/, '') || '/';
}
export function localizedPath(path: string, locale: Locale) {
  const base = sourcePath(path);
  return locale === 'zh-CN' ? base : `/${locale}${base}`;
}
export function preferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    if (/^zh(-|$)/i.test(language)) return 'zh-CN';
    if (/^en(-|$)/i.test(language)) return 'en';
  }
  return 'en';
}
