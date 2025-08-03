'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if(!email || email.length === 0){
      setLoading(false);
      return alert("Email is required field")
    } 
    if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
      setLoading(false);
      return alert("Please enter valid mail")
    } 
    if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        setLoading(false);
        return;
    }
    if(password !== confirmPassword){
      setLoading(false);
      return alert("Password and Confirm Password do not match. Please try again.")
    } 
    try {
      await signUpWithEmail(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError("Failed to create an account. The email might already be in use.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-text/80">Email</label>
        <input
          type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mt-1 text-text block w-full px-3 py-2 bg-bg border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-text/80">Password</label>
        <input
          type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mt-1 text-text block w-full px-3 py-2 bg-bg border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text/80">Confirm Password</label>
        <input
          type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
          className="mt-1 text-text block w-full px-3 py-2 bg-bg border border-border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      <button
        type="submit" disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}