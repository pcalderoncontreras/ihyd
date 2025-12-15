
// Mock function to test logic from ProductModal.jsx
const renderMediaPlayer = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let embedUrl = url;
        if (url.includes('watch?v=')) {
            embedUrl = url.replace('watch?v=', 'embed/');
            if (embedUrl.includes('&')) embedUrl = embedUrl.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
        }
        return `YouTube Embed: ${embedUrl}`;
    }

    // SoundCloud
    if (url.includes('soundcloud.com')) {
        return `SoundCloud Embed: https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}...`;
    }

    // Bandcamp
    if (url.includes('bandcamp.com')) {
        return `Bandcamp Link: ${url}`;
    }

    // Generic Link
    return `Generic Link: ${url}`;
};

// Test cases
const cases = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s",
    "https://soundcloud.com/artist/song",
    "https://bandcamp.com/album/cool-album",
    "https://spotify.com/track/123"
];

cases.forEach(url => {
    console.log(`URL: ${url}`);
    console.log(`Result: ${renderMediaPlayer(url)}`);
    console.log('---');
});
