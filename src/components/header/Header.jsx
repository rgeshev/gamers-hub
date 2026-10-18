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
                        <a href="create.html">Add Topic</a>
                        <span className="user">Hi, NightOwl</span>
                        <a href="index.html">Logout</a>
                    </div>
                    {/* Guest users */}
                    <div id="guest">
                        <a href="login.html">Login</a>
                        <a href="register.html">Register</a>
                    </div>
                </nav>
            </div>
        </header>
    )
}