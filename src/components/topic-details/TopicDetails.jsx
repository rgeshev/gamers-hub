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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const isOwner = Boolean(isAuthenticated && game.author_id && game.author_id === getAuthorId(user));

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            setIsLoading(false);
            setError('Topic not found.');
            return;
        }

        setIsLoading(true);
        setError('');

        topicApi.getOne(topicId)
            .then((topic) => {
                if (!topic) {
                    setError('Topic not found.');
                    setGame({});
                    return;
                }
                setGame(topic);
            })
            .catch((err) => setError(err.message || 'Could not load this topic.'))
            .finally(() => setIsLoading(false));
    }, [topicId]);

    const deleteGameHandler = async () => {
        if (!isOwner || isDeleting) {
            return;
        }

        setIsDeleting(true);
        setDeleteError('');

        try {
            await topicApi.remove(topicId);
            navigate('/catalog');
        } catch (err) {
            setDeleteError(err.message || 'Could not delete this topic.');
            setIsDeleting(false);
        }
    };

    return (
        <main className="container">
            <section className="page" id="topic-details">
                <p>
                    <Link className="muted" to="/catalog">
                        ← Back to topics
                    </Link>
                </p>

                {isLoading && <div className="state">Loading topic...</div>}

                {error && (
                    <div className="alert-error" role="alert">
                        {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        <article className="details topic-card pc" style={{ borderLeftWidth: 6 }}>
                            <div className="tags">
                                <span className="tag platform">{game.platform || 'PC'}</span>
                                <span className="tag">{game.category || 'General'}</span>
                            </div>
                            <h1>{game.title}</h1>
                            <p className="muted">{game.game_title || game.game} · posted by {game.author} on {formatDate(game.created_at)}</p>
                            <p>
                                {game.content}
                            </p>

                            {deleteError && (
                                <div className="alert-error" role="alert">
                                    {deleteError}
                                </div>
                            )}

                            <div className="details-actions">
                                {isAuthenticated && (
                                    <button className="btn like-btn" aria-pressed="false">
                                        ♥ Like <span>{game.likes}</span>
                                    </button>
                                )}
                                {isOwner && (
                                    <>
                                        <Link className="btn" to={`/edit/${topicId}`}>Edit</Link>
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={deleteGameHandler}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
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
                    </>
                )}
            </section>
        </main>
    );
}
