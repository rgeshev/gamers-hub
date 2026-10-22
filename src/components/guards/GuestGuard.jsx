import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../contexts/authContext';

export default function GuestGuard() {
    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
