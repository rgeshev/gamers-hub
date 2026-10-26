import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { topicApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';
import { validateTopic } from '../../utils/validation';
import FormField from '../form-field/FormField';

const initialValues = {
    title: '',
    game: '',
    platform: '',
    category: '',
    image: '',
    content: '',
};

export default function TopicCreate() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setValues((state) => ({
            ...state,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((state) => ({ ...state, [name]: '' }));
        }
    };

    const submitAction = async (e) => {
        e.preventDefault();

        const authorId = getAuthorId(user);
        if (!authorId) {
            navigate('/login');
            return;
        }

        const nextErrors = validateTopic(values);
        setErrors(nextErrors);
        setFormError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsPending(true);

        try {
            const payload = {
                title: values.title.trim(),
                game_title: values.game.trim(),
                platform: values.platform,
                category: values.category,
                content: values.content.trim(),
                author_id: authorId,
            };

            if (values.image.trim()) {
                payload.image_url = values.image.trim();
            }

            await topicApi.create(payload);
            navigate('/catalog');
        } catch (error) {
            setFormError(error.message || 'Could not publish the topic.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <main className="container">
            <section className="page" id="add-page">
                <h1>Start a topic</h1>
                <form className="form-card" onSubmit={submitAction} noValidate>
                    {formError && (
                        <div className="alert-error" role="alert">
                            {formError}
                        </div>
                    )}
                    <FormField id="title" label="Title" error={errors.title}>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={values.title}
                            onChange={changeHandler}
                            aria-describedby="title-err"
                        />
                    </FormField>

                    <FormField id="game" label="Game" error={errors.game}>
                        <input
                            id="game"
                            name="game"
                            type="text"
                            placeholder="e.g. Elden Ring"
                            value={values.game}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <div className="form-row">
                        <FormField id="platform" label="Platform" error={errors.platform}>
                            <select id="platform" name="platform" value={values.platform} onChange={changeHandler}>
                                <option value="">Select platform</option>
                                <option>PC</option>
                                <option>PlayStation</option>
                                <option>Xbox</option>
                                <option>Switch</option>
                                <option>Mobile</option>
                            </select>
                        </FormField>
                        <FormField id="category" label="Category" error={errors.category}>
                            <select id="category" name="category" value={values.category} onChange={changeHandler}>
                                <option value="">Select category</option>
                                <option>Help & Tips</option>
                                <option>News</option>
                                <option>Looking for Group</option>
                                <option>Reviews</option>
                                <option>General</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField id="image" label="Image URL (optional)" error={errors.image}>
                        <input
                            id="image"
                            name="image"
                            type="url"
                            placeholder="https://..."
                            value={values.image}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <FormField id="content" label="Content" error={errors.content}>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="At least 20 characters"
                            value={values.content}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <button className="btn btn-primary" type="submit" disabled={isPending}>
                        {isPending ? 'Publishing...' : 'Publish topic'}
                    </button>
                    <Link className="btn" to="/catalog">
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}
