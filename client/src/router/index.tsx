import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { LoginPage, MyProfilePage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div className='text-2xl font-bold bg-green-500'>Home</div>,
      },
      {
        path: 'my-profile',
        element: <MyProfilePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);
