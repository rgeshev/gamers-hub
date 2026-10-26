import { useEffect, useReducer } from 'react';
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

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            return;
        }

        commentApi.getAll(topicId)
            .then(result => dispatch({ type: 'SET_COMMENTS', payload: result }))
            .catch(error => alert(error.message));
    }, [topicId, refresh]);

    return (
        <div className="details-comments">
            <h2>Comments:</h2>
            <ul>
                {comments.map(comment => <CommentItem key={comment.id} {...comment} />)}
            </ul>
            {comments.length === 0 && (
                <p className="no-comment">No comments.</p>
            )}
        </div>
    );
}
