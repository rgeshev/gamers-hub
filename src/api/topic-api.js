import request from "../utils/request";

export const getAll = async () => {
    return request("/topics?order=created_at.desc");
};

export const getLatest = async (limit = 3, opts = {}) => {
    return request(`/topics?order=created_at.desc&limit=${limit}`, "GET", null, opts);
};

export const getOne = async (topicId) => {
    const result = await request(`/topics?id=eq.${topicId}`);
    return result[0];
};

export const create = async (topicData) => {
    return request("/topics", "POST", topicData);
};

export const edit = async (topicId, topicData) => {
    return request(`/topics?id=eq.${topicId}`, "PUT", topicData);
};

export const remove = async (topicId) => {
    return request(`/topics?id=eq.${topicId}`, "DELETE");
};
