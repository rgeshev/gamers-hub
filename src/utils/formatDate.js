export function formatDate(dateString) {
    if (!dateString) {
        return '';
    }

    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
