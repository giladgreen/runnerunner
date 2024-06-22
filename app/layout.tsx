import '@/app/global.css';

import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import SetupStyle from "@/app/ui/players/setup-style";


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
    <body className={`${inter.className} antialiased`}>
    <SetupStyle/>
    {children}</body>
    </html>
  );
}
