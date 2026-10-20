import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import request from '../../utils/request';
import { formatDate } from '../../utils/formatDate';
import CreateComment from '../create-comment/CreateComment';

export default function TopicDetails({ user }) {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState({});
    const [comments, setComments] = useState([]);

    const loadComments = () => {
        request(`/comments?topic_id=eq.${topicId}&order=created_at.asc`)
            .then(setComments)
            .catch(error => alert(error.message));
    };

    useEffect(() => {
        request(`/topics?id=eq.${topicId}`)
        .then(topics => {
            setGame(topics[0] ?? {})
        })
        .catch(error => alert(error))

        loadComments();
    }, [topicId]);

    const deleteGameHandler = () => {
        request(`/topics?id=eq.${topicId}`, 'DELETE')
            .then(() => navigate('/catalog'))
            .catch(error => alert(error));
    };

    return (
        <main className="container">
            <section className="page" id="topic-details">
                <p>
                    <Link className="muted" to="/catalog">
                        ← Back to topics
                    </Link>
                </p>

                <article className="details topic-card pc" style={{ borderLeftWidth: 6 }}>
                    <div className="tags">
                        <span className="tag platform">PC</span>
                        <span className="tag">Help & Tips</span>
                    </div>
                    <h1>{game.title}</h1>
                    <p className="muted">{game.game_title || game.game} · posted by {game.author} on {formatDate(game.created_at)}</p>
                    <p>
                        {game.content}
                    </p>

                    <div className="details-actions">
                        {/* Like: logged-in only. aria-pressed toggles when liked */}
                        <button className="btn like-btn" aria-pressed="false">
                            ♥ Like <span>{game.likes}</span>
                        </button>
                        {/* Edit / Delete: visible to the AUTHOR only */}
                        <Link className="btn" to={`/edit/${topicId}`}>Edit</Link>
                        <button className="btn btn-danger" type="button" onClick={deleteGameHandler}>Delete</button>
                    </div>
                </article>

                <div className="comments">
                    <h2>Comments ({comments.length})</h2>

                    {comments.map((comment) => (
                        <div className="comment" key={comment.id}>
                            <header>
                                <strong>{comment.author_id}</strong>
                                <span className="muted">{formatDate(comment.created_at)}</span>
                            </header>
                            <p>{comment.text}</p>
                        </div>
                    ))}

                    {user
                        ? <CreateComment user={user} topicId={topicId} onCreated={loadComments} />
                        : (
                            <p className="guest-note" style={{ marginTop: '1rem' }}>
                                <Link to="/login">Log in</Link> to comment or like this topic.
                            </p>
                        )
                    }
                </div>
            </section>
        </main>
    );
}
