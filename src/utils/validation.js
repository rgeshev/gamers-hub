export function isAbortError(error) {
    return error?.name === 'AbortError' || /aborted/i.test(error?.message || '');
}

export function validateTopic(values) {
    const errors = {};
    const title = (values.title || '').trim();
    const game = (values.game ?? values.game_title ?? '').trim();
    const gameKey = 'game_title' in values ? 'game_title' : 'game';
    const image = (values.image ?? values.image_url ?? '').trim();
    const imageKey = 'image_url' in values ? 'image_url' : 'image';
    const content = (values.content || '').trim();

    if (title.length < 5 || title.length > 100) {
        errors.title = 'Title must be between 5 and 100 characters.';
    }

    if (!game) {
        errors[gameKey] = 'Game is required.';
    }

    if (!values.platform) {
        errors.platform = 'Platform is required.';
    }

    if (!values.category) {
        errors.category = 'Category is required.';
    }

    if (image && !/^https?:\/\/\S+$/i.test(image)) {
        errors[imageKey] = 'Image must be a valid URL starting with http:// or https://.';
    }

    if (content.length < 20) {
        errors.content = 'Content must be at least 20 characters.';
    }

    return errors;
}

export function validateLogin({ email, password }) {
    const errors = {};

    if (!email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    }

    return errors;
}

export function validateRegister({ username, email, password, repeatPassword }) {
    const errors = {};

    if (username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters.';
    }

    if (!email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.email = 'Enter a valid email address.';
    }

    if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== repeatPassword) {
        errors.repeatPassword = 'Passwords do not match.';
    }

    return errors;
}

export function validateComment(text) {
    const value = (text || '').trim();

    if (!value) {
        return 'Comment cannot be empty.';
    }

    if (value.length < 2) {
        return 'Comment must be at least 2 characters.';
    }

    return '';
}
