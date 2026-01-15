import '../../styles/globals.scss';
import * as React from 'react';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ClientProviders from './ClientProviders';

export async function generateStaticParams() {
  return [
    { locale: 'pt' },
    { locale: 'en' }
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientProviders>
        {children}
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
