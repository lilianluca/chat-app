import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage, MyProfilePage } from '@/pages';
import { AuthLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: <div className='text-2xl font-bold bg-green-500'>Home</div>,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'my-profile',
            element: <MyProfilePage />,
          },
          {
            path: 'settings',
            element: <div>Settings Page</div>,
          },
        ],
      },
    ],
  },
  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <div className='text-2xl font-bold bg-blue-200'>Register</div>,
      },
    ],
  },
]);
