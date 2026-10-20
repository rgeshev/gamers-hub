import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import request from '../../utils/request';

const initialValues = {
    title: '',
    game: '',
    platform: '',
    category: '',
    image: '',
    content: '',
}

function mapTopic(row) {
    return {
        title: row.title ?? '',
        game: row.game_title ?? row.game ?? '',
        platform: row.platform ?? '',
        category: row.category ?? '',
        image: row.image_url ?? row.image ?? '',
        content: row.content ?? '',
    };
}

export default function TopicEdit() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(initialValues);

    const changeHandler = (e) => {
        setTopic(state => ({
            ...state,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        request(`/topics?id=eq.${topicId}`)
            .then(data => {
                if (data[0]) {
                    setTopic(mapTopic(data[0]));
                }
            })
            .catch(error => alert(error.message));
    }, [topicId]);

    const submitAction = async () => {
        try {
            const payload = {
                title: topic.title,
                game_title: topic.game,
                platform: topic.platform,
                category: topic.category,
                content: topic.content,
            };

            if (topic.image) {
                payload.image_url = topic.image;
            }

            await request(`/topics?id=eq.${topicId}`, 'PATCH', payload);
            navigate(`/topic-details/${topicId}`);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <main className="container">
            <section className="page" id="edit-page">
                <h1>Edit topic</h1>
                <form className="form-card" action={submitAction} noValidate>
                    <div className="field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={topic.title}
                            onChange={changeHandler}
                            aria-describedby="title-err"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="game">Game</label>
                        <input id="game" type="text" name="game" value={topic.game} onChange={changeHandler} />
                    </div>

                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="platform">Platform</label>
                            <select id="platform" name="platform" value={topic.platform} onChange={changeHandler}>
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
                            <select id="category" name="category" value={topic.category} onChange={changeHandler}>
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
                        <input id="image" type="url" name="image" value={topic.image} onChange={changeHandler} />
                    </div>

                    <div className="field">
                        <label htmlFor="content">Content</label>
                        <textarea id="content" name="content" value={topic.content} onChange={changeHandler} />
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
