import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../contexts/authContext';

export default function AuthGuard() {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
