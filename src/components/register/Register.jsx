import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import { validateRegister } from '../../utils/validation';
import FormField from '../form-field/FormField';

const initialValues = {
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
};

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuthContext();
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

    const registerAction = async (e) => {
        e.preventDefault();

        const nextErrors = validateRegister(values);
        setErrors(nextErrors);
        setFormError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsPending(true);

        try {
            await register({
                username: values.username.trim(),
                email: values.email.trim(),
                password: values.password,
            });
            navigate('/');
        } catch (err) {
            setFormError(err.message || 'Could not create your account.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="container">
            <section className="page" id="register-page">
                <h1>Create your account</h1>
                <form className="form-card" onSubmit={registerAction} noValidate>
                    {formError && (
                        <div className="alert-error" role="alert">
                            {formError}
                        </div>
                    )}
                    <FormField id="r-name" label="Username" error={errors.username}>
                        <input
                            id="r-name"
                            type="text"
                            name="username"
                            value={values.username}
                            onChange={changeHandler}
                            autoComplete="username"
                        />
                    </FormField>
                    <FormField id="r-email" label="Email" error={errors.email}>
                        <input
                            id="r-email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={changeHandler}
                            autoComplete="email"
                        />
                    </FormField>
                    <FormField id="r-pass" label="Password" error={errors.password}>
                        <input
                            id="r-pass"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={changeHandler}
                            autoComplete="new-password"
                        />
                    </FormField>
                    <FormField id="r-repeat" label="Repeat password" error={errors.repeatPassword}>
                        <input
                            id="r-repeat"
                            type="password"
                            name="repeatPassword"
                            value={values.repeatPassword}
                            onChange={changeHandler}
                            autoComplete="new-password"
                        />
                    </FormField>
                    <button className="btn btn-primary" type="submit" disabled={isPending}>
                        {isPending ? 'Creating account...' : 'Create account'}
                    </button>
                    <p className="form-note">
                        Already a member? <Link to="/login">Log in</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
