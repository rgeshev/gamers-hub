import { Link } from 'react-router';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const registerHandler = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const repeatPassword = formData.get('repeatPassword');

        if (password !== repeatPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!email || !password || !repeatPassword || !username) {
            alert('All fields are required.');
            return;
        }

        setUser({ email });
        //navigate('/');
    };

    return (
        <>
        { user && <p>Welcome, {user.email}!</p>}
        <main className="container">
            <section className="page" id="register-page">
                <h1>Create your account</h1>
                <form className="form-card" onSubmit={registerHandler} noValidate>
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
                    <div className="field invalid">
                        <label htmlFor="r-repeat">Repeat password</label>
                        <input id="r-repeat" type="password" name="repeatPassword" autoComplete="new-password" />
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
        </>
    );
}
