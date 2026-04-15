import { Button } from '@/components';
import { useLogoutMutation } from '@/features/auth/hooks';
import { Link, Outlet } from 'react-router';

export const MainLayout = () => {
  const logoutMutation = useLogoutMutation();

  return (
    <div>
      <nav className='bg-gray-800 text-white p-4 flex gap-4'>
        <Link to='/' className='hover:text-gray-300'>
          Home
        </Link>
        <Link to='/my-profile' className='hover:text-gray-300'>
          My Profile
        </Link>
        <Link to='/settings' className='hover:text-gray-300'>
          Settings
        </Link>
        <Button
          variant='outline'
          className='ml-auto text-white hover:text-brand'
          isLoading={logoutMutation.isPending}
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </Button>
      </nav>

      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  );
};
