import { commentApi } from '../../api';
import { resolveAuthorId } from '../../utils/request';

export default function CreateComment({
    user,
    topicId,
    onCreated,
}) {
    const addCommentAction = async (formData) => {
        const newComment = {
            text: formData.get('text'),
            author_id: await resolveAuthorId(user),
            topic_id: topicId,
        }

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
