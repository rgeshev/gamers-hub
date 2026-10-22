import { commentApi } from '../../api';
import { getAuthorId, useAuthContext } from '../../contexts/authContext';

export default function CreateComment({
    topicId,
    onCreated,
}) {
    const { user } = useAuthContext();

    const addCommentAction = async (formData) => {
        const authorId = getAuthorId(user);
        if (!authorId) {
            alert('Please log in to comment.');
            return;
        }

        const newComment = {
            text: formData.get('text'),
            author_id: authorId,
            topic_id: topicId,
        };

        try {
            await commentApi.create(newComment);
            onCreated?.();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <article className="create-comment">
            <label>Add new comment:</label>
            <form className="form" action={addCommentAction}>
                <textarea name="text" placeholder="Comment......"></textarea>
                <input className="btn submit" type="submit" value="Add Comment" />
            </form>
        </article>
    );
}
