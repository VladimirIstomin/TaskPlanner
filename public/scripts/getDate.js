exports.getDate = function() {
    const date = new Date();
    const options = {
        day: 'numeric',
        weekday: 'long',
        month: 'long',

    }
    
    return date.toLocaleDateString('en-RU', options);
}
