const restUrl = "https://ctzsulvvawsjbygvkapk.supabase.co/rest/v1/";
const authUrl = "https://ctzsulvvawsjbygvkapk.supabase.co/auth/v1/";

function getApiKey() {
    return import.meta.env.VITE_API_KEY;
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

function getStoredAccessToken() {
    return getStoredUser()?.accessToken || null;
}

function parseError(text, fallback) {
    try {
        const body = JSON.parse(text);
        return body.message || body.error_description || body.msg || body.error || fallback;
    } catch {
        return fallback;
    }
}

export default async function request(path = "/", method = 'GET', data = null, opts = {}) {
    const { accessToken, headers: extraHeaders, ...restOpts } = opts;
    const options = {
        ...restOpts,
        headers: {
            apikey: getApiKey(),
            Authorization: `Bearer ${accessToken || getStoredAccessToken() || getApiKey()}`,
            ...(extraHeaders || {}),
        },
    };

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${restUrl}${path}`, options);
    const text = await response.text();

    if (!response.ok) {
        throw new Error(parseError(text, `HTTP error! status: ${response.status}`));
    }

    if ([204, 201].includes(response.status)) {
        return null;
    }

    return JSON.parse(text);
}

export async function authRequest(path = "/", method = 'POST', data = null) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const options = {
        method,
        headers: {
            apikey: getApiKey(),
            Authorization: `Bearer ${getStoredAccessToken() || getApiKey()}`,
        },
    };

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${authUrl}${cleanPath}`, options);
    const text = await response.text();

    if (!response.ok) {
        throw new Error(parseError(text, `HTTP error! status: ${response.status}`));
    }

    return text ? JSON.parse(text) : null;
}
