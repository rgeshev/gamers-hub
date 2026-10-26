const platformClasses = {
    pc: 'pc',
    playstation: 'ps',
    xbox: 'xbox',
    switch: 'switch',
    mobile: 'mobile',
};

export function platformClass(platform) {
    return platformClasses[(platform || '').toLowerCase()] || '';
}
