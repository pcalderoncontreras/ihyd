import React, { useEffect } from 'react';

const InstagramFeed = () => {
    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        // Process embeds after script loads
        script.onload = () => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // TODO: Reemplaza 'instagram' con tu usuario real de Instagram
    const instagramUsername = 'ihyddistro';

    return (
        <div className="container mb-5">
            <div className="text-center mb-4">
                <h2 className="text-white text-uppercase fw-bold" style={{ borderBottom: '2px solid #444', paddingBottom: '15px', display: 'inline-block' }}>
                    Síguenos en Instagram
                </h2>
            </div>

            <div className="row g-3">
                {/* Instagram Embed - Muestra el feed completo */}
                <div className="col-12">
                    <div className="d-flex justify-content-center">
                        <blockquote
                            className="instagram-media"
                            data-instgrm-permalink={`https://www.instagram.com/${instagramUsername}/`}
                            data-instgrm-version="14"
                            style={{
                                background: '#FFF',
                                border: '0',
                                borderRadius: '3px',
                                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                                margin: '1px',
                                maxWidth: '540px',
                                minWidth: '326px',
                                padding: '0',
                                width: 'calc(100% - 2px)'
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <a
                                    href={`https://www.instagram.com/${instagramUsername}/`}
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

            {/* Link to Instagram Profile */}
            <div className="text-center mt-4">
                <a
                    href={`https://www.instagram.com/${instagramUsername}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light"
                    style={{ borderRadius: '20px' }}
                >
                    <i className="bi bi-instagram me-2"></i>
                    Visitar nuestro perfil
                </a>
            </div>
        </div>
    );
};

export default InstagramFeed;
