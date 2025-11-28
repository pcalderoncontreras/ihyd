import React from 'react';
import InstagramFeed from './InstagramFeed';
import SoundCloudPlayer from './SoundCloudPlayer';

const SocialMediaSection = () => {
    return (
        <div className="container mb-5">
            <div className="text-center mb-5">
                <h2 className="text-white text-uppercase fw-bold" style={{ borderBottom: '2px solid #444', paddingBottom: '15px', display: 'inline-block' }}>
                    Síguenos en nuestras redes
                </h2>
            </div>

            <div className="row g-4">
                {/* SoundCloud Player */}
                <div className="col-lg-6">
                    <div className="h-100">
                        <h3 className="text-white text-center mb-4">
                            <i className=""></i>
                            ↯ Soundcloud IHYD
                        </h3>
                        <div className="d-flex justify-content-center">
                            <iframe
                                width="100%"
                                height="609"
                                scrolling="no"
                                frameBorder="no"
                                allow="autoplay"
                                src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/ihopeyoudiezine/sets&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                                style={{ maxWidth: '100%' }}
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Instagram Feed */}
                <div className="col-lg-6">
                    <div className="h-100">
                        <h3 className="text-white text-center mb-4">
                            <i className=""></i>
                            ↯ Instagram IHYD
                        </h3>
                        <div className="d-flex justify-content-center">
                            <blockquote
                                className="instagram-media"
                                data-instgrm-permalink="https://www.instagram.com/ihyddistro/"
                                data-instgrm-version="14"
                                style={{
                                    background: '#FFF',
                                    border: '0',
                                    borderRadius: '3px',
                                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                    margin: '1px',
                                    maxWidth: '100%',
                                    minWidth: '326px',
                                    padding: '0',
                                    width: 'calc(100% - 2px)'
                                }}
                            >
                                <div style={{ padding: '16px' }}>
                                    <a
                                        href="https://www.instagram.com/ihyddistro/"
                                        style={{
                                            background: '#FFFFFF',
                                            lineHeight: '0',
                                            padding: '0 0',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            width: '100%'
                                        }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver este perfil en Instagram
                                    </a>
                                </div>
                            </blockquote>
                        </div>

                    </div>
                </div>
            </div >
        </div >
    );
};

export default SocialMediaSection;
