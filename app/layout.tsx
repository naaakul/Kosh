// File location: ./app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletConnectionProvider } from '../components/WalletConnection';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeFi AI Assistant',
  description: 'AI-powered DeFi transaction optimizer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectionProvider>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </WalletConnectionProvider>
      </body>
    </html>
  );
}