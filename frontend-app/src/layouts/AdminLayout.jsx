import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar admin */}
      <aside style={{ width: '220px', background: '#f4f4f4', padding: '1rem' }}>
        <h3>Admin Panel</h3>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
        </ul>
      </aside>

      {/* Contenu de page */}
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
