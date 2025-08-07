import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div>
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
