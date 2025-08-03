import { Geist, Geist_Mono, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
});
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter' 
});

export const metadata = {
  title: 'NoteWise',
  description: 'Take Notes Smarter, Not Harder.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} bg-bg text-text font-body transition-colors duration-300`}>
        <Providers>
          <div className="flex flex-col bg-bg min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
// accounts/fireworks/models/llama-v3p3-70b-instruct