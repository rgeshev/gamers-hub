import request from "../utils/request";

export const getOne = async (userId) => {
    const result = await request(`/profiles?id=eq.${userId}&select=id,username`);
    return result[0] ?? null;
};

export const create = async (profile, opts = {}) => {
    return request("/profiles", "POST", profile, opts);
};

export const ensure = async (account) => {
    if (!account?.id) {
        throw new Error("Please log in.");
    }

    const existing = await getOne(account.id);
    if (existing) {
        return existing;
    }

    try {
        await create(
            { id: account.id, username: account.username },
            { accessToken: account.accessToken }
        );
        return { id: account.id, username: account.username };
    } catch (error) {
        const message = error.message || "";
        if (/duplicate|unique|already exists/i.test(message)) {
            return getOne(account.id);
        }
        throw error;
    }
};
