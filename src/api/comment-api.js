import request from "../utils/request";

export const getAll = async (topicId) => {
    const result = await request(`/comments?topic_id=eq.${topicId}&select=*,profiles(username)`);

    return result.map(comment => ({
        ...comment,
        author: comment.profiles?.username,
    }));
};

export const create = async (commentData) => {
    return request("/comments", "POST", commentData);
};
