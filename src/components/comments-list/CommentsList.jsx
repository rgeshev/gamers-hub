import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import request from '../../utils/request';
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

        request(`/comments?topic_id=eq.${topicId}&select=*,profiles(username)`)
            .then(result => setComments(result.map(comment => ({
                ...comment,
                author: comment.profiles?.username,
            }))))
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
