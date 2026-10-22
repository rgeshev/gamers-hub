import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuthContext } from '../../contexts/authContext';

export default function Logout() {
    const { logout } = useAuthContext();

    useEffect(() => {
        logout();
    }, [logout]);

    return <Navigate to="/" replace />;
}
