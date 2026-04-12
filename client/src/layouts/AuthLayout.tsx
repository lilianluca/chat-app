import { Outlet, NavLink, Navigate } from 'react-router';
import { Logo } from '@/components';
import { cn } from '@/utils';
import { useMe } from '@/features/users/hooks';

export const AuthLayout = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return null;
  }

  if (user) {
    // TODO: Show a toast message "You are already logged in" or something like that
    return <Navigate to='/my-profile' replace />;
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-slate-100'>
        <div className='flex justify-center pb-2'>
          <Logo className='h-12 w-auto' showText={false} />
        </div>

        <div className='relative flex w-full rounded-xl bg-slate-100 p-1'>
          <NavLink
            to='/login'
            className={({ isActive }) =>
              cn(
                'flex w-1/2 items-center justify-center rounded-lg py-2 text-sm font-medium transition-all duration-200',
                {
                  'bg-white text-slate-900 shadow-sm': isActive,
                  'text-slate-500 hover:text-slate-900': !isActive,
                },
              )
            }
          >
            Log In
          </NavLink>
          <NavLink
            to='/register'
            className={({ isActive }) =>
              cn(
                'flex w-1/2 items-center justify-center rounded-lg py-2 text-sm font-medium transition-all duration-200',
                {
                  'bg-white text-slate-900 shadow-sm': isActive,
                  'text-slate-500 hover:text-slate-900': !isActive,
                },
              )
            }
          >
            Register
          </NavLink>
        </div>

        <div className='mt-4'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
