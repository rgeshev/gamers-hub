import { useState } from 'react';
import { commentApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';
import { validateComment } from '../../utils/validation';

export default function CreateComment({
    topicId,
    onCreated,
}) {
    const { user } = useAuthContext();
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const addCommentAction = async (e) => {
        e.preventDefault();

        const authorId = getAuthorId(user);
        if (!authorId) {
            setError('Please log in to comment.');
            return;
        }

        const nextError = validateComment(text);
        setError(nextError);
        if (nextError) {
            return;
        }

        setIsPending(true);

        try {
            await commentApi.create({
                text: text.trim(),
                author_id: authorId,
                topic_id: topicId,
            });
            setText('');
            setError('');
            onCreated?.();
        } catch (err) {
            setError(err.message || 'Could not add the comment.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <article className="create-comment">
            <label htmlFor="comment-text">Add new comment:</label>
            <form className="form" onSubmit={addCommentAction} noValidate>
                {error && (
                    <div className="alert-error" role="alert">
                        {error}
                    </div>
                )}
                <textarea
                    id="comment-text"
                    name="text"
                    placeholder="Comment......"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        if (error) {
                            setError('');
                        }
                    }}
                />
                <input
                    className="btn submit"
                    type="submit"
                    value={isPending ? 'Adding...' : 'Add Comment'}
                    disabled={isPending}
                />
            </form>
        </article>
    );
}
