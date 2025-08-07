import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar';

const GuestLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default GuestLayout;
