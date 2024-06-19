import '@/app/global.css';
import '@/app/style.css';
import '@/app/ui/style.css';
import '@/app/signin/style.css';
import '@/app/signup/style.css';
import '@/app/ui/players/style.css';
import '@/app/ui/dashboard/style.css';

import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runner Runner',
  description: 'Runner Runner.'
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
