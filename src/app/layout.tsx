import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Providers } from './providers';
import { LoadingProvider } from '../context/LoadingContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Waste Sorting App',
  description: 'A web application for waste sorting and management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LoadingProvider>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
