import { getRequestConfig } from 'next-intl/server';

export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // For static export, we trust that only valid locales from generateStaticParams are used
  const validLocale = locales.includes(locale as Locale) ? locale : 'pt';

  return {
    locale: validLocale as string,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
