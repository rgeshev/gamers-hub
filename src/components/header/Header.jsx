import { Link } from 'react-router';

export default function Header() {
    return (
        <header className="site-header">
            <div className="container">
                <Link className="logo" to="/">
                    Gamers<span>Hub</span>
                </Link>
                {/* Navigation */}
                <nav className="nav" aria-label="Main">
                    <Link to="/catalog">Catalog</Link>
                    {/* Logged-in users */}
                    <div id="user">
                        <Link to="/create">Add Topic</Link>
                        <span className="user">Hi, NightOwl</span>
                        <a href="/logout">Logout</a>
                    </div>
                    {/* Guest users */}
                    <div id="guest">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </nav>
            </div>
        </header>
    )
}