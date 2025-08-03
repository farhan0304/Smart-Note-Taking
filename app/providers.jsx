'use client';

import { ThemeProvider } from 'next-themes';
import { AuthContextProvider } from '@/context/AuthContext';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthContextProvider>{children}</AuthContextProvider>
    </ThemeProvider>
  );
}