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

    const [isShrunk, setIsShrunk] = useState(false);

    // Mantenemos la histéresis anti-parpadeo intacta
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

    return (
        <>
            <header
                className="bg-black sticky-top w-100"
                style={{
                    zIndex: 1000,
                    height: 'auto',
                    paddingTop: '0px',
                    paddingBottom: isShrunk ? '0.9rem' : '1.5rem',
                    transition: 'padding 0.2s ease-out',
                    boxShadow: isShrunk ? '0 10px 30px rgba(0,0,0,0.8)' : 'none'
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
                    <span className="fs-4 me-2" style={{ color: theme === 'light' ? '#1a1a1a' : '#666' }}>↯</span>
                    <label className="theme-switch mb-0">
                        <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                        <div className="slider round"></div>
                    </label>
                    <span className="fs-4 ms-2" style={{ color: theme === 'dark' ? '#fff' : '#aaa' }}>⛧</span>
                </div>

                <div className="container-fluid d-flex flex-column align-items-center px-3">
                    {/* Logo Ajustado a la mitad */}
                    <Link
                        className="navbar-brand w-100 text-center"
                        to="/"
                        onClick={() => setCategory && setCategory('all')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: isShrunk ? '75px' : '110px',
                            marginBottom: isShrunk ? '0.4rem' : '0.8rem',
                            transition: 'height 0.2s ease-out, margin 0.2s ease-out'
                        }}
                    >
                        <img
                            src={theme === 'dark'
                                ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1778882000/logo_blood_drips_corrected_oklrq8.png"
                                : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778869036/LogoOficialHome2_sxwfae_d0gsxt.png"
                            }
                            alt="Logo"
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </Link>

                    {/* Menú de Navegación / Panel Admin Dinámico */}
                    <nav className={`p-0 w-100 ihyd-nav-container ${isShrunk ? 'shrunk-menu' : ''}`}>
                        <div className="d-flex justify-content-center ihyd-nav-scroll">
                            {isAdminPage ? (
                                /* CORRECCIÓN: Vista del Administrador autenticado */
                                <div
                                    className="d-flex align-items-center gap-3 flex-nowrap admin-panel-header"
                                    style={{
                                        marginBottom: isShrunk ? '0.6rem' : '1.2rem',
                                        transition: 'margin 0.2s ease-out',
                                        color: '#fff'
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
                            ) : (
                                /* Vista Normal de la Tienda */
                                <ul className="navbar-nav d-flex flex-row flex-nowrap gap-2 align-items-center m-0 p-0"
                                    style={{ marginBottom: isShrunk ? '0.6rem' : '1.2rem', transition: 'margin 0.2s ease-out' }}>
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
                    {!isAdminPage && location.pathname !== '/login' && (
                        <div
                            className="w-100 px-3 d-flex align-items-center justify-content-center gap-3"
                            style={{ maxWidth: '750px' }}
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

                            <div className={`flex-grow-1 search-bar-container ${isShrunk ? 'shrunk-search' : ''}`}>
                                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
                        </div>
                    )}

                    {/* TÍTULO GRANDE ORIGINAL */}
                    {!isAdminPage && !isShrunk && hasCategory && (
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
                    .nav-link { color: #bbb !important; text-decoration: none; transition: all 0.2s ease; }
                    .nav-link:hover, .nav-link.active { color: #fff !important; font-weight: bold; }
                    
                    /* Menú comprimido intermedio */
                    .shrunk-menu .nav-link { font-size: 0.92rem !important; }
                    
                    /* Adaptación del panel de administración al achicarse a la mitad */
                    .admin-welcome-text { font-size: 1rem; transition: font-size 0.2s ease; }
                    .shrunk-menu .admin-welcome-text { font-size: 0.9rem; }
                    
                    .admin-logout-btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; transition: all 0.2s ease; }
                    .shrunk-menu .admin-logout-btn { padding: 0.15rem 0.4rem; font-size: 0.8rem; }
                    
                    /* Barra de búsqueda reducida a la mitad */
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
                    height: isShrunk ? (hasCategory && !isAdminPage ? '95px' : '65px') : '0px',
                    transition: 'height 0.2s ease-out',
                    width: '100%',
                    pointerEvents: 'none'
                }}
            />
        </>
    );
};

export default Navbar;