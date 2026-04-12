import { Navigate, Outlet, useLocation } from 'react-router';
import { useMe } from '@/features/users/hooks';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
  const { data: user, isLoading } = useMe();
  const location = useLocation();

  useEffect(
    () => console.log('ProtectedRoute: user data changed', { user, isLoading }),
    [user, isLoading],
  );

  if (isLoading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center gap-2 bg-slate-50'>
        <Loader className='animate-spin text-slate-500 size-10' />
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <Outlet />;
};
