'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const HeroCTAButton = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleRedirect = () => {
    if (loading) return; 
    router.push(user ? '/dashboard' : '/login');
  };

  return (
    <button
      onClick={handleRedirect}
      className="px-8 py-3 mt-8 font-semibold text-white bg-primary rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
    >
      {loading ? 'Loading...' : 'Start Writing'}
    </button>
  );
};
export default HeroCTAButton;