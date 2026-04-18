import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage, RegisterPage } from '@/pages';
import { AuthLayout, ChatLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';

export const router = createBrowserRouter([
  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <ChatLayout />,
        children: [
          {
            path: 'chats',
            element: <div className='text-2xl font-bold h-full p-2'>Chats Page</div>,
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
  // Catch-all route to redirect to /chats
  {
    path: '*',
    element: <Navigate to='/chats' replace />,
  },
]);
