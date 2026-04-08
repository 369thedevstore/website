import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '369 The Dev Store',
  description: 'Simple landing page for 369 The Dev Store with enquiry capture.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}