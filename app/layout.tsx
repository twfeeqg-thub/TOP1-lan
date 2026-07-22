import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';
import { OfflineBanner } from '@/components/offline-banner';
import { ServiceWorkerRegister } from '@/components/service-worker-register';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ذكاء سهل | المنصة السحابية الموحدة للتحول الرقمي',
  description: 'البوابة السحابية متعددة المستأجرين لتقديم حلول التحول الرقمي السيادي المتكامل في قطاعات التعليم، الصحة، العقارات، والتجارة.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <AppProviders>
          <OfflineBanner />
          <ServiceWorkerRegister />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
