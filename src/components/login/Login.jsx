import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import { validateLogin } from '../../utils/validation';
import FormField from '../form-field/FormField';

const initialValues = {
    email: '',
    password: '',
};

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setValues((state) => ({ ...state, [name]: value }));
        if (errors[name]) {
            setErrors((state) => ({ ...state, [name]: '' }));
        }
    };

    const submitAction = async (e) => {
        e.preventDefault();

        const nextErrors = validateLogin(values);
        setErrors(nextErrors);
        setFormError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsPending(true);

        try {
            await login({ email: values.email.trim(), password: values.password });
            navigate('/');
        } catch (err) {
            setFormError(err.message || 'Wrong email or password. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="container">
            <section className="page" id="login-page">
                <h1>Log in</h1>
                <form className="form-card" onSubmit={submitAction} noValidate>
                    {formError && (
                        <div className="alert-error" role="alert">
                            {formError}
                        </div>
                    )}
                    <FormField id="l-email" label="Email" error={errors.email}>
                        <input
                            id="l-email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={changeHandler}
                            autoComplete="email"
                        />
                    </FormField>
                    <FormField id="l-pass" label="Password" error={errors.password}>
                        <input
                            id="l-pass"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={changeHandler}
                            autoComplete="current-password"
                        />
                    </FormField>
                    <button className="btn btn-primary" type="submit" disabled={isPending}>
                        {isPending ? 'Logging in...' : 'Log in'}
                    </button>
                    <p className="form-note">
                        New here? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
