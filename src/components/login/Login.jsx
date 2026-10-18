import { Link } from 'react-router';

export default function Login() {
    return (
        <main className="container">
            <section className="page" id="login-page">
                <h1>Log in</h1>
                <form className="form-card" onSubmit={(e) => e.preventDefault()} noValidate>
                    {/* API error example */}
                    <div className="alert-error" role="alert">
                        Wrong email or password. Please try again.
                    </div>
                    <div className="field">
                        <label htmlFor="l-email">Email</label>
                        <input id="l-email" type="email" autoComplete="email" />
                    </div>
                    <div className="field">
                        <label htmlFor="l-pass">Password</label>
                        <input id="l-pass" type="password" autoComplete="current-password" />
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Log in
                    </button>
                    <p className="form-note">
                        New here? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
