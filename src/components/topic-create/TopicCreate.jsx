import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { topicApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';

const initialValues = {
    title: '',
    game: '',
    platform: '',
    category: '',
    image: '',
    content: '',
}

export default function TopicCreate() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [values, setValues] = useState(initialValues);

    const changeHandler = (e) => {
        setValues(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }))
    }

    const submitAction = async () => {
        if (!user?.id) {
            alert('Please log in to create a topic.');
            navigate('/login');
            return;
        }

        try {
            const authorId = getAuthorId(user);
            if (!authorId) {
                alert('Please log in to create a topic.');
                navigate('/login');
                return;
            }

            const payload = {
                title: values.title,
                game_title: values.game,
                platform: values.platform,
                category: values.category,
                content: values.content,
                author_id: authorId,
            };

            if (values.image) {
                payload.image_url = values.image;
            }

            await topicApi.create(payload);
            navigate("/catalog");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <main className="container">
            <section className="page" id="add-page">
                <h1>Start a topic</h1>
                <form className="form-card" action={submitAction} noValidate>
                    <div className="field invalid">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={values.title}
                            onChange={changeHandler}
                            aria-describedby="title-err"
                        />
                        <p className="error-text" id="title-err">
                            Title must be between 5 and 100 characters.
                        </p>
                    </div>

                    <div className="field">
                        <label htmlFor="game">Game</label>
                        <input id="game" name="game" type="text" placeholder="e.g. Elden Ring" value={values.game} onChange={changeHandler} />
                    </div>

                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="platform">Platform</label>
                            <select id="platform" name="platform" value={values.platform} onChange={changeHandler}>
                                <option value="">Select platform</option>
                                <option>PC</option>
                                <option>PlayStation</option>
                                <option>Xbox</option>
                                <option>Switch</option>
                                <option>Mobile</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="category">Category</label>
                            <select id="category" name="category" value={values.category} onChange={changeHandler}>
                                <option value="">Select category</option>
                                <option>Help & Tips</option>
                                <option>News</option>
                                <option>Looking for Group</option>
                                <option>Reviews</option>
                                <option>General</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="image">Image URL (optional)</label>
                        <input id="image" name="image" type="url" placeholder="https://..." value={values.image} onChange={changeHandler} />
                    </div>

                    <div className="field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" name="content" placeholder="At least 20 characters" value={values.content} onChange={changeHandler} />
                    </div>

                    <button className="btn btn-primary" type="submit">
                        Publish topic
                    </button>
                    <Link className="btn" to="/catalog">
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}
