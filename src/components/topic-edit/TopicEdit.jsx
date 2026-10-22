import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { topicApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';

const initialValues = {
    title: '',
    game_title: '',
    platform: '',
    category: '',
    image_url: '',
    content: '',
}

export default function TopicEdit() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [topic, setTopic] = useState(initialValues);

    const changeHandler = (e) => {
        setTopic(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        topicApi.getOne(topicId)
            .then(data => {
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
            .catch(error => alert(error.message));
    }, [topicId, user, navigate]);

    const editAction = async () => {
        if (topic.author_id && topic.author_id !== getAuthorId(user)) {
            navigate(`/topic-details/${topicId}`);
            return;
        }

        await topicApi.edit(topicId, topic);
        navigate(`/topic-details/${topicId}`);
    }

    return (
        <main className="container">
            <section className="page" id="edit-page">
                <h1>Edit topic</h1>
                <form className="form-card" action={editAction} noValidate>
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={topic.title ?? ''}
                            onChange={changeHandler}
                            aria-describedby="title-err"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="game">Game</label>
                        <input id="game" type="text" name="game_title" value={topic.game_title ?? ''} onChange={changeHandler} />
                    </div>

                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="platform">Platform</label>
                            <select id="platform" name="platform" value={topic.platform ?? ''} onChange={changeHandler}>
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
                            <select id="category" name="category" value={topic.category ?? ''} onChange={changeHandler}>
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
                        <input id="image" type="url" name="image_url" value={topic.image_url ?? ''} onChange={changeHandler} />
                    </div>

                    <div className="field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" name="content" value={topic.content ?? ''} onChange={changeHandler} />
                    </div>

                    <button className="btn btn-primary" type="submit">
                        Save changes
                    </button>
                    <Link className="btn" to={topicId ? `/topic-details/${topicId}` : '/catalog'}>
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}
