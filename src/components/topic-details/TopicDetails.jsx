import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import request from '../../utils/request';
import { formatDate } from '../../utils/formatDate';
import CreateComment from '../create-comment/CreateComment';
import CommentsList from '../comments-list/CommentsList';

export default function TopicDetails({ user }) {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState({});
    const [commentsVersion, setCommentsVersion] = useState(0);

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            return;
        }

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
                    <CommentsList topicId={topicId} refresh={commentsVersion} />

                    {user
                        ? <CreateComment user={user} topicId={topicId} onCreated={() => setCommentsVersion(version => version + 1)} />
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
