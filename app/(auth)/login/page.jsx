'use client';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };

  useEffect(() => {
    if (user) { router.push('/dashboard'); }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-lg shadow-lg border border-border">
        <div>
          <h2 className="text-center text-3xl font-extrabold font-heading text-text">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-text/70">
            Or{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        <LoginForm />
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-text/60">OR</span>
            <div className="flex-grow border-t border-border"></div>
        </div>
        <div>
            <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 font-medium text-text bg-bg border border-border rounded-lg hover:bg-border/50 transition-colors"
            >
                <FcGoogle size={22} />
                Sign In with Google
            </button>
        </div>
      </div>
    </div>
  );
}