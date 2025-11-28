import React from 'react';

const SoundCloudPlayer = () => {
    const soundcloudUrl = 'https://soundcloud.com/ihopeyoudiezine/sets';

    return (
        <div className="container mb-5">
            <div className="text-center mb-4">
                <h2 className="text-white text-uppercase fw-bold" style={{ borderBottom: '2px solid #444', paddingBottom: '15px', display: 'inline-block' }}>
                    Escucha nuestra música
                </h2>
            </div>

            <div className="d-flex justify-content-center">
                <iframe
                    width="100%"
                    height="450"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(soundcloudUrl)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                    style={{ maxWidth: '540px' }}
                ></iframe>
            </div>

            {/* Link to SoundCloud Profile */}
            <div className="text-center mt-4">
                <a
                    href={soundcloudUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light"
                    style={{ borderRadius: '20px' }}
                >
                    <i className="bi bi-music-note-beamed me-2"></i>
                    Visitar nuestro SoundCloud
                </a>
            </div>
        </div>
    );
};

export default SoundCloudPlayer;
