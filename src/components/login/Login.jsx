import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [error, setError] = useState('');

    const submitAction = async (formData) => {
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.message || 'Wrong email or password. Please try again.');
        }
    };

    return (
        <main className="container">
            <section className="page" id="login-page">
                <h1>Log in</h1>
                <form className="form-card" action={submitAction} noValidate>
                    {error && (
                        <div className="alert-error" role="alert">
                            {error}
                        </div>
                    )}
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
