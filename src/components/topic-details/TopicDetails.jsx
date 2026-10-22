import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { topicApi } from '../../api';
import { formatDate } from '../../utils/formatDate';
import CreateComment from '../create-comment/CreateComment';
import CommentsList from '../comments-list/CommentsList';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';

export default function TopicDetails() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthContext();
    const [game, setGame] = useState({});
    const [commentsVersion, setCommentsVersion] = useState(0);
    const isOwner = Boolean(game.author_id && game.author_id === getAuthorId(user));

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            return;
        }

        topicApi.getOne(topicId)
        .then(topic => {
            setGame(topic ?? {})
        })
        .catch(error => alert(error))
    }, [topicId]);

    const deleteGameHandler = () => {
        if (!isOwner) {
            return;
        }

        topicApi.remove(topicId)
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
                        {isAuthenticated && (
                            <button className="btn like-btn" aria-pressed="false">
                                ♥ Like <span>{game.likes}</span>
                            </button>
                        )}
                        {isOwner && (
                            <>
                                <Link className="btn" to={`/edit/${topicId}`}>Edit</Link>
                                <button className="btn btn-danger" type="button" onClick={deleteGameHandler}>Delete</button>
                            </>
                        )}
                    </div>
                </article>

                <div className="comments">
                    <CommentsList topicId={topicId} refresh={commentsVersion} />

                    {isAuthenticated
                        ? <CreateComment topicId={topicId} onCreated={() => setCommentsVersion(version => version + 1)} />
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
