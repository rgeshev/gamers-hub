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

function authFetch(path, data) {
    return authRequest(path, 'POST', data);
}

function persistAuthor(account, authorId, accessToken) {
    const current = getStoredUser();
    if (!current) {
        return;
    }

    const nextUser = {
        ...current,
        authorId,
        accessToken: accessToken || current.accessToken,
    };
    localStorage.setItem('user', JSON.stringify(nextUser));

    try {
        const users = JSON.parse(localStorage.getItem('users')) ?? [];
        localStorage.setItem(
            'users',
            JSON.stringify(
                users.map((item) =>
                    item.email === nextUser.email
                        ? { ...item, authorId: nextUser.authorId, accessToken: nextUser.accessToken }
                        : item
                )
            )
        );
    } catch {
        // ignore invalid stored users
    }
}

export async function resolveAuthorId(account) {
    if (account?.authorId) {
        return account.authorId;
    }

    const profiles = await request('/profiles?select=id,username');
    const match = profiles?.find((profile) => profile.username === account?.username) || profiles?.[0];

    if (match?.id) {
        persistAuthor(account, match.id, account?.accessToken);
        return match.id;
    }

    let session = null;
    try {
        session = await authFetch('signup', {
            data: { username: account?.username },
        });
    } catch (error) {
        const message = error.message || '';
        if (!/anonymous/i.test(message) && account?.email && account?.password) {
            session = await authFetch('signup', {
                email: account.email,
                password: account.password,
                data: { username: account.username },
            });
        } else if (!/anonymous/i.test(message)) {
            throw error;
        }
    }

    if (!session && account?.email && account?.password) {
        session = await authFetch('signup', {
            email: account.email,
            password: account.password,
            data: { username: account.username },
        });
    }

    const authUser = session?.user || (session?.id ? session : {});
    const authorId = authUser.id;

    if (!authorId) {
        throw new Error('Could not create an author profile. Please try publishing again in a few minutes.');
    }

    try {
        await request(
            '/profiles',
            'POST',
            { id: authorId, username: account?.username },
            { accessToken: session.access_token }
        );
    } catch (error) {
        const message = error.message || '';
        if (!/duplicate|unique|already exists/i.test(message)) {
            throw error;
        }
    }

    persistAuthor(account, authorId, session.access_token);
    return authorId;
}
