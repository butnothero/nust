import { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { DATE_FORMATS } from './date-formats';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';
import { NUMBER_FORMATS } from './number-formats';

export {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  SUPPORTED_LANGUAGES,
  extractLocaleFromPath,
} from './locales';

// Dynamic import current locale
// @ts-ignore
const messageImports = import.meta.glob('./translations/*.ts');

export const importLocale = (locale: string) => {
  const [, importLocale] =
    Object.entries(messageImports).find(([key]) => key.includes(`/${locale}.`)) || [];

  // @ts-ignore
  return importLocale && importLocale();
};

export const loadAsyncLanguage = async (i18n: any, locale = DEFAULT_LOCALE) => {
  try {
    const result = await importLocale(locale);
    if (result) {
      i18n.setLocaleMessage(locale, result.default || result);
      i18n.locale.value = locale;
    }
  } catch (error) {
    console.error(error);
  }
};

export const installI18n = async (app: App, locale = '') => {
  locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const messages = await importLocale(locale);

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      // @ts-ignore
      [locale]: messages.default || messages,
    },
    datetimeFormats: DATE_FORMATS,
    numberFormats: NUMBER_FORMATS,
  });

  app.use(i18n);
};
