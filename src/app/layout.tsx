// src/app/layout.tsx

import Head from 'next/head';
import './globals.css'; // Ensure to keep your global styles

export const metadata = {
  title: 'Boxes Game',
  description: 'A simple boxes game in React',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-100 antialiased">
        <main className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-6">{metadata.title}</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
