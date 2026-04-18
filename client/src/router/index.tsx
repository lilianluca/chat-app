import { createBrowserRouter, Navigate } from 'react-router';
import { MyProfilePage, LoginPage, RegisterPage } from '@/pages';
import { AuthLayout, ChatLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatLayout />,
    children: [
      // Public routes
      {
        index: true,
        element: <Navigate to='/chats' replace />,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'chats',
            element: <div className='text-2xl font-bold bg-green-500 min-h-1250'>Chats Page</div>,
          },
          {
            path: 'profile',
            element: <MyProfilePage />,
          },
          {
            path: 'contacts',
            element: <div>Contacts Page</div>,
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
        element: <RegisterPage />,
      },
    ],
  },
]);
