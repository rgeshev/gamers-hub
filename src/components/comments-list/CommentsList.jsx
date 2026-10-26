import { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { commentApi } from '../../api';
import CommentItem from './comment-item/CommentItem';
import { commentReducer } from './comment-item/comment-reducer';

export default function CommentsList({
    topicId: topicIdProp,
    refresh,
}) {
    const { topicId: topicIdParam } = useParams();
    const topicId = topicIdProp || topicIdParam;
    const [comments, dispatch] = useReducer(commentReducer, []);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError('');

        commentApi.getAll(topicId)
            .then((result) => dispatch({ type: 'SET_COMMENTS', payload: result }))
            .catch((err) => setError(err.message || 'Could not load comments.'))
            .finally(() => setIsLoading(false));
    }, [topicId, refresh]);

    return (
        <div className="details-comments">
            <h2>Comments:</h2>
            {isLoading && <p className="state">Loading comments...</p>}
            {error && (
                <div className="alert-error" role="alert">
                    {error}
                </div>
            )}
            {!isLoading && !error && (
                <>
                    <ul>
                        {comments.map(comment => <CommentItem key={comment.id} {...comment} />)}
                    </ul>
                    {comments.length === 0 && (
                        <p className="no-comment">No comments.</p>
                    )}
                </>
            )}
        </div>
    );
}
