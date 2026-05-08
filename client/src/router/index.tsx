import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage, RegisterPage } from '@/pages';
import { AuthLayout, ChatLayout } from '@/layouts';
import { ProtectedRoute } from '@/components';
import { ChatRoom } from '@/features/chats/components';

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
            element: (
              <div className='text-xl text-center h-full p-2 flex items-center justify-center text-muted-foreground'>
                Select a Chat
              </div>
            ),
          },
          {
            path: 'chats/:chatId',
            element: <ChatRoom />,
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
