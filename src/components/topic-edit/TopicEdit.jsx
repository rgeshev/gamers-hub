import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { topicApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';
import { validateTopic } from '../../utils/validation';
import FormField from '../form-field/FormField';

const initialValues = {
    title: '',
    game_title: '',
    platform: '',
    category: '',
    image_url: '',
    content: '',
};

export default function TopicEdit() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [topic, setTopic] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [loadError, setLoadError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, setIsPending] = useState(false);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setTopic((state) => ({
            ...state,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((state) => ({ ...state, [name]: '' }));
        }
    };

    useEffect(() => {
        let ignore = false;
        setIsLoading(true);
        setLoadError('');

        topicApi.getOne(topicId)
            .then((data) => {
                if (ignore) {
                    return;
                }

                if (!data) {
                    navigate('/catalog');
                    return;
                }

                if (data.author_id && data.author_id !== getAuthorId(user)) {
                    navigate(`/topic-details/${topicId}`);
                    return;
                }

                setTopic(data);
            })
            .catch((error) => {
                if (!ignore) {
                    setLoadError(error.message || 'Could not load this topic.');
                }
            })
            .finally(() => {
                if (!ignore) {
                    setIsLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, [topicId, user, navigate]);

    const editAction = async (e) => {
        e.preventDefault();

        if (topic.author_id && topic.author_id !== getAuthorId(user)) {
            navigate(`/topic-details/${topicId}`);
            return;
        }

        const nextErrors = validateTopic(topic);
        setErrors(nextErrors);
        setFormError('');

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setIsPending(true);

        try {
            await topicApi.edit(topicId, {
                ...topic,
                title: topic.title.trim(),
                game_title: topic.game_title.trim(),
                image_url: topic.image_url?.trim() || '',
                content: topic.content.trim(),
            });
            navigate(`/topic-details/${topicId}`);
        } catch (error) {
            setFormError(error.message || 'Could not save the topic.');
        } finally {
            setIsPending(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container">
                <section className="page" id="edit-page">
                    <div className="state">Loading topic...</div>
                </section>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="container">
                <section className="page" id="edit-page">
                    <div className="alert-error" role="alert">{loadError}</div>
                    <Link className="btn" to="/catalog">Back to catalog</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="container">
            <section className="page" id="edit-page">
                <h1>Edit topic</h1>
                <form className="form-card" onSubmit={editAction} noValidate>
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
                            value={topic.title ?? ''}
                            onChange={changeHandler}
                            aria-describedby="title-err"
                        />
                    </FormField>

                    <FormField id="game" label="Game" error={errors.game_title}>
                        <input
                            id="game"
                            type="text"
                            name="game_title"
                            value={topic.game_title ?? ''}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <div className="form-row">
                        <FormField id="platform" label="Platform" error={errors.platform}>
                            <select id="platform" name="platform" value={topic.platform ?? ''} onChange={changeHandler}>
                                <option value="">Select platform</option>
                                <option>PC</option>
                                <option>PlayStation</option>
                                <option>Xbox</option>
                                <option>Switch</option>
                                <option>Mobile</option>
                            </select>
                        </FormField>
                        <FormField id="category" label="Category" error={errors.category}>
                            <select id="category" name="category" value={topic.category ?? ''} onChange={changeHandler}>
                                <option value="">Select category</option>
                                <option>Help & Tips</option>
                                <option>News</option>
                                <option>Looking for Group</option>
                                <option>Reviews</option>
                                <option>General</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField id="image" label="Image URL (optional)" error={errors.image_url}>
                        <input
                            id="image"
                            type="url"
                            name="image_url"
                            value={topic.image_url ?? ''}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <FormField id="content" label="Content" error={errors.content}>
                        <textarea
                            id="content"
                            name="content"
                            value={topic.content ?? ''}
                            onChange={changeHandler}
                        />
                    </FormField>

                    <button className="btn btn-primary" type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save changes'}
                    </button>
                    <Link className="btn" to={topicId ? `/topic-details/${topicId}` : '/catalog'}>
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}
