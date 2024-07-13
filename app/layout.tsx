import '@/app/global.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runner Runner',
  description: 'Runner Runner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-project-id="bEjW3thbOGbrhv74GMfN46hNJydELbAVuIYZBwxm"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        }
      </head>
      <body className={`${inter.className} antialiased`}>
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
