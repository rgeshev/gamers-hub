import { Link } from 'react-router';
import { useNavigate } from 'react-router';

export default function Login({
    onLogin,
}) {

    const navigate = useNavigate();

    const submitAction = (formData) => {
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            alert('Email and password are required');
            return;
        }

        onLogin({email});

        navigate('/');
    };

    return (
        <main className="container">
            <section className="page" id="login-page">
                <h1>Log in</h1>
                <form className="form-card" action={submitAction} noValidate>
                    {/* API error example */}
                    <div className="alert-error" role="alert">
                        Wrong email or password. Please try again.
                    </div>
                    <div className="field">
                        <label htmlFor="l-email">Email</label>
                        <input id="l-email" type="email" name="email" autoComplete="email" />
                    </div>
                    <div className="field">
                        <label htmlFor="l-pass">Password</label>
                        <input id="l-pass" type="password" name="password" autoComplete="current-password" />
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
