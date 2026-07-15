import type {Metadata} from 'next';
import './globals.css';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'ذكاء سهل - بوابة التحول الرقمي السيادي',
  description: 'المنصة السحابية الموحدة لتمكين التحول الرقمي السيادي للقطاعات التعليمية والصحية والعقارية والتجارية.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark">
      <body suppressHydrationWarning className="antialiased min-h-screen">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
