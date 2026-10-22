import { authRequest } from "../utils/request";

export const register = async ({ email, password, username }) => {
    return authRequest("/signup", "POST", {
        email,
        password,
        data: { username },
    });
};

export const login = async ({ email, password }) => {
    return authRequest("/token?grant_type=password", "POST", { email, password });
};

export const logout = async () => {
    return authRequest("/logout", "POST");
};

export const refresh = async (refreshToken) => {
    return authRequest("/token?grant_type=refresh_token", "POST", {
        refresh_token: refreshToken,
    });
};
