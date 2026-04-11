import { Link, Outlet } from 'react-router';

export const MainLayout = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to='/' style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link to='/my-profile'>My Profile</Link>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};
