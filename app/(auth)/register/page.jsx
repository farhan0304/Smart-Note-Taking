'use client';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) { router.push('/dashboard'); }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-lg shadow-lg border border-border">
                <div>
                    <h2 className="text-center text-3xl font-extrabold font-heading text-text">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-text/70">
                        Or{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    );
}