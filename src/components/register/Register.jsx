import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuthContext();
    const [error, setError] = useState('');
    const [mismatch, setMismatch] = useState(false);

    const registerAction = async (formData) => {
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');

        setError('');
        setMismatch(false);

        if (password !== repeatPassword) {
            setMismatch(true);
            return;
        }

        if (!email || !password || !repeatPassword || !username) {
            setError('All fields are required.');
            return;
        }

        try {
            await register({ username, email, password });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="container">
            <section className="page" id="register-page">
                <h1>Create your account</h1>
                <form className="form-card" action={registerAction} noValidate>
                    {error && (
                        <div className="alert-error" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="field">
                        <label htmlFor="r-name">Username</label>
                        <input id="r-name" type="text" name="username" autoComplete="username" />
                    </div>
                    <div className="field">
                        <label htmlFor="r-email">Email</label>
                        <input id="r-email" type="email" name="email" autoComplete="email" />
                    </div>
                    <div className="field">
                        <label htmlFor="r-pass">Password</label>
                        <input id="r-pass" type="password" name="password" autoComplete="new-password" />
                    </div>
                    <div className={`field${mismatch ? ' invalid' : ''}`}>
                        <label htmlFor="r-repeat">Repeat password</label>
                        <input id="r-repeat" type="password" name="repeatPassword" autoComplete="new-password" />
                        {mismatch && <p className="error-text">Passwords do not match.</p>}
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
