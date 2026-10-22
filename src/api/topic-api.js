import request from "../utils/request";

export const getAll = async () => {
    return request("/topics?order=created_at.desc");
};

export const getLatest = async (limit = 3, opts = {}) => {
    return request(`/topics?order=created_at.desc&limit=${limit}`, "GET", null, opts);
};

export const getOne = async (topicId) => {
    const result = await request(`/topics?id=eq.${topicId}&select=*,profiles!author_id(username)`);
    const topic = result[0];

    if (!topic) {
        return null;
    }

    return {
        ...topic,
        author: topic.profiles?.username,
    };
};

export const create = async (topicData) => {
    return request("/topics", "POST", topicData);
};

export const edit = async (topicId, topicData) => {
    return request(`/topics?id=eq.${topicId}`, "PUT", {
        title: topicData.title,
        game_title: topicData.game_title,
        platform: topicData.platform,
        category: topicData.category,
        image_url: topicData.image_url || null,
        content: topicData.content,
        author_id: topicData.author_id,
    });
};

export const remove = async (topicId) => {
    return request(`/topics?id=eq.${topicId}`, "DELETE");
};
