import { Link } from 'react-router';
import { useNavigate } from 'react-router';

export default function Register({
    onRegister,
}) {
    
    const navigate = useNavigate();

    const registerAction = (formData) => {
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

        onRegister({ username, email });
        navigate('/');
    };

    return (
        <main className="container">
            <section className="page" id="register-page">
                <h1>Create your account</h1>
                <form className="form-card" action={registerAction} noValidate>
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
    );
}
