const url = "https://ctzsulvvawsjbygvkapk.supabase.co/rest/v1/";
const apiKey = "sb_publishable_hkpf60MzQP3eB3cVSgexmA_zCKQ16sw"

export default async function request(path = "/", method = 'GET', data = null) {
    const options = {
        headers: {
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
        }
    };

    if (method !== 'GET') {
        options.method = method;
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${url}${path}`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}