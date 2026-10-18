import { Link } from 'react-router';

export default function Register() {
    return (
        <main className="container">
            <section className="page" id="register-page">
                <h1>Create your account</h1>
                <form className="form-card" onSubmit={(e) => e.preventDefault()} noValidate>
                    <div className="field">
                        <label htmlFor="r-name">Username</label>
                        <input id="r-name" type="text" autoComplete="username" />
                    </div>
                    <div className="field">
                        <label htmlFor="r-email">Email</label>
                        <input id="r-email" type="email" autoComplete="email" />
                    </div>
                    <div className="field">
                        <label htmlFor="r-pass">Password</label>
                        <input id="r-pass" type="password" autoComplete="new-password" />
                    </div>
                    <div className="field invalid">
                        <label htmlFor="r-repeat">Repeat password</label>
                        <input id="r-repeat" type="password" autoComplete="new-password" />
                        <p className="error-text">Passwords do not match.</p>
                    </div>
                    <button className="btn btn-primary" type="submit">
                        Create account
                    </button>
                    <p className="form-note">
                        Already a member? <Link to="/login">Log in</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
