import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import request from '../../utils/request';
import { formatDate } from '../../utils/formatDate';

export default function TopicDetails() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState({});

    useEffect(() => {
        request(`/topics?id=eq.${topicId}`)
        .then(topics => {
            setGame(topics[0] ?? {})
        })
        .catch(error => alert(error))
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
                    <p className="muted">{game.game} · posted by {game.author} on {formatDate(game.created_at)}</p>
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
                    <h2>Comments ({game.comments?.length || 0})</h2>

                    {/* component: CommentItem */}
                    {game.comments?.map((comment) => (
                        <div className="comment" key={comment.id}>
                            <header>
                                <strong>{comment.author}</strong>
                                <span className="muted">{formatDate(comment.created_at)}</span>
                            </header>
                            <p>{comment.content}</p>
                        </div>
                    ))}

                    {/* component: CommentForm (logged-in only) */}
                    <form style={{ marginTop: '1rem' }} onSubmit={(e) => e.preventDefault()}>
                        <div className="field">
                            <label htmlFor="comment">Add a comment</label>
                            <textarea
                                id="comment"
                                maxLength={500}
                                placeholder="Share your tip or answer"
                            />
                        </div>
                        <button className="btn btn-primary" type="submit">
                            Post comment
                        </button>
                    </form>

                    {/* Guest version of the form area */}
                    <p className="guest-note" style={{ marginTop: '1rem' }}>
                        <Link to="/login">Log in</Link> to comment or like this topic.
                    </p>
                </div>
            </section>
        </main>
    );
}
