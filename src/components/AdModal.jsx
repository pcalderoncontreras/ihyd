import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { doc, getDoc } from 'firebase/firestore';

const AdModal = ({ forceShow, onManualClose }) => {
    const [ads, setAds] = useState([]);
    const [show, setShow] = useState(false);

    // ESTADOS
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [activeAdIndex, setActiveAdIndex] = useState(null);
    const [isHoveredInMax, setIsHoveredInMax] = useState(false);

    // Efecto para apertura forzada (Novedades)
    useEffect(() => {
        if (forceShow) {
            setShow(true);
        }
    }, [forceShow]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                if (!forceShow) {
                    const STORAGE_KEY = 'ihyd_last_ad_view';
                    const COOLDOWN = 60 * 60 * 1000;
                    const lastView = localStorage.getItem(STORAGE_KEY);
                    const nowMs = new Date().getTime();

                    if (lastView && (nowMs - parseInt(lastView)) < COOLDOWN) {
                        return;
                    }
                }

                const docRef = doc(db, 'productos', '--ad-posters--');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const now = new Date();
                    const activeAds = (data.list || []).filter(ad => {
                        return new Date(ad.expiresAt) > now;
                    });

                    if (activeAds.length > 0) {
                        setAds(activeAds);
                        setShow(true);
                    }
                }
            } catch (err) {
                console.error('Error fetching ads:', err);
            }
        };

        fetchAds();
    }, [forceShow]);

    const handleClose = () => {
        localStorage.setItem('ihyd_last_ad_view', new Date().getTime().toString());
        setShow(false);
        if (onManualClose) onManualClose();
    };

    const formatUrl = (url) => {
        if (!url) return '';
        let cleanUrl = url.trim();
        if (cleanUrl === '') return '';
        if (!/^https?:\/\//i.test(cleanUrl)) {
            return 'https://' + cleanUrl;
        }
        return cleanUrl;
    };

    if (window.location.pathname.startsWith('/admin')) return null;
    if (!show || ads.length === 0) return null;

    const isDesktop = window.innerWidth >= 768;
    const hasActiveAd = activeAdIndex !== null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.98)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
                padding: '20px'
            }}
            onClick={() => {
                if (hasActiveAd && isDesktop) {
                    setActiveAdIndex(null);
                    setIsHoveredInMax(false);
                }
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: ads.length === 1 ? '450px' : ads.length === 2 ? '900px' : '1200px',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: window.innerWidth < 768 ? '15px' : '30px'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', order: 1 }}>
                    <img
                        src="https://res.cloudinary.com/da8xc0cap/image/upload/v1764116670/LogoOficialHome_sxwfae.png"
                        alt="Logo"
                        style={{
                            maxHeight: '140px',
                            maxWidth: '100%',
                            height: 'auto',
                            width: 'auto',
                            transition: 'filter 0.4s ease',
                            filter: hasActiveAd && isDesktop ? 'blur(4px) opacity(0.3)' : 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'
                        }}
                    />
                </div>

                {/* Ads Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: '30px',
                    width: '100%',
                    order: window.innerWidth < 768 ? 3 : 2
                }}>
                    {ads.map((ad, i) => {
                        const isCurrentActive = activeAdIndex === i;
                        const isHovered = hoveredIndex === i && isDesktop && !hasActiveAd;
                        const anyoneHovered = hoveredIndex !== null && isDesktop && !hasActiveAd;

                        const itemStyle = {
                            flex: '1',
                            minWidth: '280px',
                            maxWidth: '400px',
                            cursor: 'pointer',
                            transition: isDesktop ? 'transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease' : 'none',

                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                            filter: anyoneHovered && !isHovered ? 'blur(6px)' : 'blur(0px)',
                            opacity: anyoneHovered && !isHovered ? 0.4 : 1,

                            ...(hasActiveAd && isDesktop ? {
                                filter: !isCurrentActive ? 'blur(10px)' : 'blur(0px)',
                                opacity: !isCurrentActive ? 0.15 : 1,
                                pointerEvents: 'none'
                            } : {})
                        };

                        return (
                            <div
                                key={i}
                                style={itemStyle}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => {
                                    if (isDesktop) {
                                        // Comportamiento PC: Abre la vista ampliada en grande
                                        if (!hasActiveAd) {
                                            setActiveAdIndex(i);
                                        }
                                    } else {
                                        // CORRECCIÓN COMPORTAMIENTO MÓVIL: Redirige directamente al link
                                        const destinationUrl = formatUrl(ad.linkUrl);
                                        if (destinationUrl) {
                                            window.open(destinationUrl, '_blank', 'noopener,noreferrer');
                                        }
                                    }
                                }}
                            >
                                <img
                                    src={ad.imageUrl}
                                    alt="Ad"
                                    style={{
                                        width: '100%',
                                        height: isDesktop ? '480px' : 'auto',
                                        aspectRatio: isDesktop ? 'unset' : '3/4',
                                        objectFit: 'contain',
                                        display: 'block',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.02)'
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Close Button General */}
                <div style={{
                    textAlign: 'center',
                    order: window.innerWidth < 768 ? 2 : 3,
                    transition: 'opacity 0.4s ease',
                    opacity: hasActiveAd && isDesktop ? 0.1 : 1
                }}>
                    <button
                        onClick={handleClose}
                        className="ihyd-btn-primary"
                        style={{
                            padding: '14px 60px',
                            letterSpacing: '0.15em',
                            fontSize: '1rem',
                            backgroundColor: '#222',
                            color: '#fff',
                            border: '1px solid #444'
                        }}
                    >
                        Entrar a la Distro
                    </button>
                </div>
            </div>

            {/* MODAL GIGANTE CAPA SUPERIOR (Solo para Escritorio/PC) */}
            {hasActiveAd && isDesktop && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => {
                        setActiveAdIndex(null);
                        setIsHoveredInMax(false);
                    }}
                >
                    {/* Contenedor del Afiche Ampliado */}
                    <div
                        style={{
                            position: 'relative',
                            width: '85vh',
                            maxWidth: '650px',
                            aspectRatio: '3/4',
                            boxShadow: '0 30px 70px rgba(0,0,0,1), 0 0 30px rgba(255,255,255,0.1)',
                            animation: 'fadeInAd 0.3s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setIsHoveredInMax(true)}
                        onMouseLeave={() => setIsHoveredInMax(false)}
                    >
                        {/* Botón de cerrar "X" */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveAdIndex(null);
                                setIsHoveredInMax(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                background: '#222',
                                color: '#fff',
                                border: '2px solid #fff',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10001,
                                padding: 0,
                                transition: 'background-color 0.2s, transform 0.2s, border-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#ff4444';
                                e.currentTarget.style.borderColor = '#ff4444';
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#222';
                                e.currentTarget.style.borderColor = '#fff';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            ✕
                        </button>

                        {/* Imagen del afiche gigante */}
                        <img
                            src={ads[activeAdIndex].imageUrl}
                            alt="Ad Maximized"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />

                        {/* Botón Flotante "Más Información" */}
                        {formatUrl(ads[activeAdIndex].linkUrl) && (
                            <a
                                href={formatUrl(ads[activeAdIndex].linkUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: isHoveredInMax ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
                                    opacity: isHoveredInMax ? 1 : 0,
                                    pointerEvents: isHoveredInMax ? 'auto' : 'none',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    padding: '16px 36px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
                                    transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s',
                                    borderRadius: '2px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                            >
                                Más Info
                            </a>
                        )}
                    </div>

                    <style>{`
                        @keyframes fadeInAd {
                            from { opacity: 0; transform: scale(0.95); }
                            to { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default AdModal;