import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { doc, getDoc } from 'firebase/firestore';

const AdModal = ({ forceShow, onManualClose }) => {
    const [ads, setAds] = useState([]);
    const [show, setShow] = useState(false);

    // Efecto para apertura forzada (Novedades)
    useEffect(() => {
        if (forceShow) {
            setShow(true);
        }
    }, [forceShow]);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                // Si es forzado, no revisamos cooldown
                if (!forceShow) {
                    const STORAGE_KEY = 'ihyd_last_ad_view';
                    const COOLDOWN = 60 * 60 * 1000; // 1 hora en ms
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
            return `https://${cleanUrl}`;
        }
        return cleanUrl;
    };

    if (!show || ads.length === 0) return null;

    return (
        <div
            style={{ 
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.98)', 
                zIndex: 9999, // Z-index muy alto para estar encima de todo
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
                padding: '20px'
            }}
            onClick={handleClose}
        >
            <div
                style={{ 
                    width: '100%',
                    maxWidth: ads.length === 1 ? '450px' : ads.length === 2 ? '900px' : '1200px',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: window.innerWidth < 768 ? '15px' : '30px' // Reducido para que quede más ajustado
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
                            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))'
                        }} 
                    />
                </div>

                {/* Ads Container */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '30px',
                    width: '100%',
                    order: window.innerWidth < 768 ? 3 : 2
                }}>
                    {ads.map((ad, i) => {
                        const url = formatUrl(ad.linkUrl);
                        return (
                            <div key={i} style={{ flex: '1', minWidth: '280px', maxWidth: '400px' }}>
                                {url ? (
                                    <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ 
                                            display: 'block', 
                                            textDecoration: 'none',
                                            transition: 'transform 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={(e) => e.stopPropagation()} // Asegurar que el clic no se detenga
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img
                                            src={ad.imageUrl}
                                            alt="Ad"
                                            style={{ 
                                                width: '100%', 
                                                aspectRatio: '3/4',
                                                objectFit: 'contain',
                                                display: 'block',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
                                            }}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={ad.imageUrl}
                                        alt="Ad"
                                        style={{ 
                                            width: '100%', 
                                            aspectRatio: '3/4',
                                            objectFit: 'contain',
                                            display: 'block',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
                                        }}
                                    />
                                )}



                            </div>
                        );
                    })}
                </div>

                {/* Close Button */}
                <div style={{ textAlign: 'center', order: window.innerWidth < 768 ? 2 : 3 }}>
                    <button
                        onClick={handleClose}
                        className="ihyd-btn-primary"
                        style={{ 
                            padding: '14px 60px', 
                            letterSpacing: '0.15em', 
                            fontSize: '1rem',
                            backgroundColor: '#222', // Gris oscuro a tono con el sitio
                            color: '#fff',           // Texto blanco para contraste
                            border: '1px solid #444' // Borde sutil
                        }}
                    >
                        Entrar a la Distro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdModal;
