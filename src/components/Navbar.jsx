import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_config';
import SearchBar from './SearchBar';

const Navbar = ({ setCategory, currentCategory, searchTerm, setSearchTerm, theme, toggleTheme, onShowAds }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const isAdminPage = location.pathname === '/admin';
    const isLoginPage = location.pathname === '/login';
    const isAuthPage = isAdminPage || isLoginPage;

    const [isShrunk, setIsShrunk] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            if (scroll > 80) {
                setIsShrunk(true);
            } else if (scroll < 10) {
                setIsShrunk(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const formatCategoryTitle = (cat) => {
        if (!cat || cat === 'all') return '';
        if (cat === 'CD') return "Cd's";
        if (cat === 'Tape') return "Tapes";
        if (cat === 'Vinilo') return "Vinilos";
        if (cat === 'Releases') return "Releases";
        if (cat === 'Zine') return "Zines";
        if (cat === 'Polera') return "Poleras";
        return cat;
    };

    const hasCategory = currentCategory && currentCategory !== 'all';
    const isDark = theme === 'dark';

    return (
        <>
            <header
                className="sticky-top w-100"
                style={{
                    zIndex: 1000,
                    height: 'auto',
                    paddingTop: '0px',
                    paddingBottom: isShrunk ? '0.9rem' : '1.5rem',
                    transition: 'padding 0.2s ease-out, background-color 0.2s ease, box-shadow 0.2s ease',
                    // CORRECCIÓN RADICAL: Si no hay scroll, es 100% transparente. 
                    // Si hay scroll, toma el fondo adaptativo del tema (blanco o negro) sin inventar tonos intermedios.
                    backgroundColor: isShrunk ? (isDark ? '#000000' : '#ffffff') : 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    left: 0,
                    right: 0
                }}
            >
                {/* Contenedor del Switcher */}
                <div
                    className="d-flex justify-content-end align-items-center w-100 pe-4 theme-switch-wrapper"
                    style={{
                        paddingTop: isShrunk ? '0.6rem' : '1.2rem',
                        transition: 'padding 0.2s ease-out'
                    }}
                >
                    <span className="fs-4 me-2" style={{ color: isDark ? '#666' : '#1a1a1a' }}>↯</span>
                    <label className="theme-switch mb-0">
                        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                        <div className="slider round"></div>
                    </label>
                    <span className="fs-4 ms-2" style={{ color: isDark ? '#fff' : '#aaa' }}>⛧</span>
                </div>

                <div className="w-100 d-flex flex-column align-items-center px-0 navbar-inner-container">
                    {/* Logo */}
                    <Link
                        className="navbar-brand w-100 text-center m-0 p-0"
                        to="/"
                        onClick={() => setCategory && setCategory('all')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: isShrunk ? '75px' : '110px',
                            marginBottom: isShrunk ? '0.4rem' : '0.8rem',
                            transition: 'height 0.2s ease-out, margin 0.2s ease-out',
                            border: 'none',
                            background: 'transparent'
                        }}
                    >
                        <img
                            src={isDark
                                ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1778882000/logo_blood_drips_corrected_oklrq8.png"
                                : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778869036/LogoOficialHome2_sxwfae_d0gsxt.png"
                            }
                            alt="Logo"
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain',
                                border: 'none'
                            }}
                        />
                    </Link>

                    {/* Menú de Navegación / Panel Admin Dinámico */}
                    <nav className={`p-0 w-100 ihyd-nav-container ${isShrunk ? 'shrunk-menu' : ''}`} style={{ border: 'none', background: 'transparent' }}>
                        <div className="d-flex justify-content-center ihyd-nav-scroll w-100">
                            {isAdminPage ? (
                                <div
                                    className="d-flex align-items-center gap-3 flex-nowrap admin-panel-header"
                                    style={{
                                        marginBottom: isShrunk ? '0.6rem' : '1.2rem',
                                        transition: 'margin 0.2s ease-out',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                >
                                    {currentUser ? (
                                        <>
                                            <span className="text-nowrap admin-welcome-text">
                                                Bienvenido: <strong>{currentUser.email}</strong>
                                            </span>
                                            <button
                                                className="btn btn-outline-danger btn-sm text-nowrap admin-logout-btn"
                                                onClick={handleLogout}
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-nowrap text-muted admin-welcome-text">No autenticado</span>
                                    )}
                                </div>
                            ) : isLoginPage ? (
                                null
                            ) : (
                                <ul className="navbar-nav d-flex flex-row flex-nowrap gap-2 align-items-center m-0 p-0"
                                    style={{ marginBottom: isShrunk ? '0.6rem' : '1.2rem', transition: 'margin 0.2s ease-out', border: 'none' }}>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'all' ? 'active' : ''}`} onClick={() => { navigate('/'); setCategory('all'); }}>Home</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'CD' ? 'active' : ''}`} onClick={() => setCategory('CD')}>CDs</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Tape' ? 'active' : ''}`} onClick={() => setCategory('Tape')}>Tapes</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Vinilo' ? 'active' : ''}`} onClick={() => setCategory('Vinilo')}>Vinyl</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Releases' ? 'active' : ''}`} onClick={() => setCategory('Releases')}>Releases</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Zine' ? 'active' : ''}`} onClick={() => setCategory('Zine')}>Zines</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Polera' ? 'active' : ''}`} onClick={() => setCategory('Polera')}>Poleras</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item d-flex align-items-center gap-2">
                                        <button className="nav-link btn btn-link text-nowrap" onClick={onShowAds} style={{ color: '#ff4444' }}>Anuncios</button>
                                        <span className="divider">|</span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link btn btn-link text-nowrap" onClick={() => window.open('https://docs.google.com/spreadsheets/d/1FN8jdlpdQsz4ioP0geF9oylUQTyn5-Yk/edit?usp=sharing', '_blank')}>Catálogo</button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </nav>

                    {/* Contenedor de la Barra de Búsqueda y Título Integrado */}
                    {!isAuthPage && (
                        <div
                            className="w-100 px-3 d-flex align-items-center justify-content-center gap-3"
                            style={{ maxWidth: '750px', border: 'none', background: 'transparent' }}
                        >
                            {/* TÍTULO COMPACTO MODERADO */}
                            {isShrunk && hasCategory && (
                                <h2
                                    style={{
                                        fontFamily: "'UnifrakturMaguntia', cursive",
                                        fontSize: '1.9rem',
                                        color: 'var(--ihyd-text)',
                                        margin: 0,
                                        paddingRight: '5px',
                                        whiteSpace: 'nowrap',
                                        animation: 'fadeInTitle 0.2s ease-out'
                                    }}
                                >
                                    ↯ {formatCategoryTitle(currentCategory)}
                                </h2>
                            )}

                            <div className={`flex-grow-1 search-bar-container ${isShrunk ? 'shrunk-search' : ''}`} style={{ border: 'none' }}>
                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
                        </div>
                    )}

                    {/* TÍTULO GRANDE ORIGINAL */}
                    {!isAuthPage && !isShrunk && hasCategory && (
                        <div className="w-100 px-4 mt-3" style={{ animation: 'fadeInTitle 0.2s ease-out' }}>
                            <h1 className="m-0 text-center" style={{
                                fontFamily: "'UnifrakturMaguntia', cursive",
                                fontSize: '2.6rem',
                                color: 'var(--ihyd-text)'
                            }}>
                                <span style={{ fontWeight: '100', marginRight: '10px' }}>↯</span>
                                {formatCategoryTitle(currentCategory)}
                            </h1>
                        </div>
                    )}
                </div>

                <style>{`
                    /* ELIMINACIÓN DE BORDES Y SOMBRAS GLOBALES DEL HEADER */
                    header.sticky-top, 
                    header.sticky-top * {
                        box-shadow: none !important;
                        border: none !important;
                        outline: none !important;
                    }
                    
                    /* Evitamos que clases globales de Bootstrap metan bordes a la lista del nav */
                    .navbar-nav, .nav-item, .navbar-inner-container {
                        border: 0 !important;
                        box-shadow: none !important;
                    }

                    .nav-link { color: ${isDark ? '#bbb' : '#555'} !important; text-decoration: none; transition: all 0.2s ease; }
                    .nav-link:hover, .nav-link.active { color: ${isDark ? '#fff' : '#000'} !important; font-weight: bold; }
                    
                    .divider { color: ${isDark ? '#333' : '#ccc'} !important; }

                    .shrunk-menu .nav-link { font-size: 0.92rem !important; }
                    
                    .admin-welcome-text { font-size: 1rem; transition: font-size 0.2s ease; }
                    .shrunk-menu .admin-welcome-text { font-size: 0.9rem; }
                    
                    .admin-logout-btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; transition: all 0.2s ease; }
                    .shrunk-menu .admin-logout-btn { padding: 0.15rem 0.4rem; font-size: 0.8rem; }
                    
                    .search-bar-container.shrunk-search input { 
                        height: 38px !important; 
                        font-size: 0.92rem !important;
                        transition: all 0.2s ease-out;
                    }
                    .search-bar-container.shrunk-search button { 
                        height: 38px !important;
                        transition: all 0.2s ease-out;
                    }

                    @keyframes fadeInTitle {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}</style>
            </header>

            {/* COLCHÓN INVISIBLE ANTI-PARPADEO RECALCULADO */}
            <div
                style={{
                    height: isShrunk ? (hasCategory && !isAuthPage ? '95px' : '65px') : '0px',
                    transition: 'height 0.2s ease-out',
                    width: '100%',
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};

export default Navbar;