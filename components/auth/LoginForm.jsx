'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <div className="mb-4">
        <label htmlFor="email-login" className="block text-sm font-medium text-text/80">Email</label>
        <input
          type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mt-1 block text-text w-full px-3 py-2 bg-bg border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password-login" className="block text-sm font-medium text-text/80">Password</label>
        <input
          type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mt-1 text-text block w-full px-3 py-2 bg-bg border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}