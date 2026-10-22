import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { commentApi } from '../../api';
import CommentItem from './comment-item/CommentItem';

export default function CommentsList({
    topicId: topicIdProp,
    refresh,
}) {
    const { topicId: topicIdParam } = useParams();
    const topicId = topicIdProp || topicIdParam;
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!topicId || topicId === 'undefined') {
            return;
        }

        commentApi.getAll(topicId)
            .then(setComments)
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
