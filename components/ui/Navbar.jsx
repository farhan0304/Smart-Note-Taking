'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold font-heading text-primary">
            NoteWise
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            {user ? (
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:opacity-90"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-primary hover:underline">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:opacity-90">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;