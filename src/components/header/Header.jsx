import { Link } from 'react-router';
import { useAuthContext } from '../../contexts/authContext';

export default function Header() {
    const { user, isAuthenticated } = useAuthContext();

    return (
        <header className="site-header">
            <div className="container">
                <Link className="logo" to="/">
                    Gamers<span>Hub</span>
                </Link>
                <nav className="nav" aria-label="Main">
                    <Link to="/catalog">Catalog</Link>
                    {isAuthenticated ? (
                        <div id="user">
                            <Link to="/create">Add Topic</Link>
                            <span className="user">Hi, {user.username}</span>
                            <Link to="/logout">Logout</Link>
                        </div>
                    ) : (
                        <div id="guest">
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
