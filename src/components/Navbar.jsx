import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_config';
import SearchBar from './SearchBar';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ setCategory, currentCategory, searchTerm, setSearchTerm, theme, toggleTheme, onShowAds }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isAdminPage = location.pathname === '/admin';

    const [isShrunk, setIsShrunk] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsShrunk(true);
            } else {
                setIsShrunk(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    // >>> HASTA AQUÍ

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="bg-black sticky-top" style={{ zIndex: 1000, paddingBottom: isShrunk ? '0.3rem' : '1rem', transition: 'padding 0.3s ease-in-out' }} >
            <div className="d-flex justify-content-end align-items-center w-100 pt-3 pe-4 theme-switch-wrapper">
                <span className="fs-4 me-2" style={{ color: theme === 'light' ? '#1a1a1a' : '#666', transition: 'color 0.3s' }}>↯</span>
                <label className="theme-switch mb-0" htmlFor="themeCheckbox">
                    <input
                        type="checkbox"
                        id="themeCheckbox"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                    />
                    <div className="slider round"></div>
                </label>
                <span className="fs-4 ms-2" style={{ color: theme === 'dark' ? '#fff' : '#aaa', transition: 'color 0.3s' }}>⛧</span>
            </div>

            <div className="container-fluid d-flex flex-column align-items-center pt-2 px-3">
                {/* Logo */}
                <Link className={`navbar-brand w-100 text-center ${isShrunk ? 'mb-2' : 'mb-4'}`} to="/" onClick={() => setCategory && setCategory('all')} style={{ transition: 'margin 0.3s ease-in-out' }} >
                    <img
                        src={theme === 'dark'
                            ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1778882000/logo_blood_drips_corrected_oklrq8.png"
                            : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778869036/LogoOficialHome2_sxwfae_d0gsxt.png"
                        }
                        alt="IHYD :: Distro"
                        className="ihyd-logo"
                        style={{
                            maxHeight: isShrunk ? '75px' : '140px',
                            maxWidth: '100%',
                            height: 'auto',
                            width: 'auto',
                            transition: 'max-height 0.3s ease-in-out'
                        }}
                    />
                </Link>

                {/* Navigation Menu (Horizontal Scroll on Mobile) */}
                <nav className={`p-0 w-100 ihyd-nav-container ${isShrunk ? 'mb-1' : 'mb-3'}`} style={{ transition: 'margin 0.3s ease-in-out' }}>
                    <div className="d-flex justify-content-center ihyd-nav-scroll">
                        {isAdminPage ? (
                            <div className="d-flex align-items-center gap-3 flex-nowrap">
                                {currentUser && (
                                    <>
                                        <span className="text-white text-nowrap">
                                            Bienvenido: <strong>{currentUser.email}</strong>
                                        </span>
                                        <button className="btn btn-outline-danger btn-sm text-nowrap" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <ul className={`navbar-nav d-flex flex-row flex-nowrap gap-2 align-items-center m-0 p-0 ${isShrunk ? 'shrunk-menu' : ''}`}>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'all' ? 'active' : ''}`}
                                        onClick={() => { navigate('/'); setCategory('all'); }}
                                    >Home</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'CD' ? 'active' : ''}`}
                                        onClick={() => setCategory('CD')}
                                    >CDs</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Tape' ? 'active' : ''}`}
                                        onClick={() => setCategory('Tape')}
                                    >Tapes</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Vinilo' ? 'active' : ''}`}
                                        onClick={() => setCategory('Vinilo')}
                                    >Vinyl</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Releases' ? 'active' : ''}`}
                                        onClick={() => setCategory('Releases')}
                                    >Releases</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Zine' ? 'active' : ''}`}
                                        onClick={() => setCategory('Zine')}
                                    >Zines</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className={`nav-link btn btn-link text-nowrap ${currentCategory === 'Polera' ? 'active' : ''}`}
                                        onClick={() => setCategory('Polera')}
                                    >Poleras</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item d-flex align-items-center gap-2">
                                    <button
                                        className="nav-link btn btn-link text-nowrap"
                                        onClick={onShowAds}
                                        style={{ color: '#ff4444' }} // Color especial para resaltar
                                    >Novedades</button>
                                    <span className="divider">|</span>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => window.open('https://docs.google.com/spreadsheets/d/1FN8jdlpdQsz4ioP0geF9oylUQTyn5-Yk/edit?usp=sharing&ouid=115226895934415359333&rtpof=true&sd=true', '_blank')}>Catálogo</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>

                {/* Search Bar */}
                {!isAdminPage && location.pathname !== '/login' && (
                    <div className="w-100 px-3 mt-2" style={{ maxWidth: '600px' }}>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                )}

                {/* Category Indicator (Extreme Left, Below Search) */}
                {currentCategory && currentCategory !== 'all' && (
                    <div className="w-100 px-4 mt-1">
                        <h1 className="m-0 text-start" style={{
                            fontFamily: "'UnifrakturMaguntia', cursive",
                            fontSize: '2.8rem',
                            color: 'var(--ihyd-text)',
                            letterSpacing: '1px',
                            lineHeight: '1',
                            fontWeight: '400'
                        }}>
                            <span style={{ fontWeight: '100', marginRight: '5px' }}>↯</span>
                            {
                                currentCategory === 'CD' ? "Cd's" :
                                    currentCategory === 'Tape' ? "Tapes" :
                                        currentCategory === 'Vinilo' ? "Vinilos" :
                                            currentCategory === 'Releases' ? "Releases" :
                                                currentCategory === 'Zine' ? "Zines" :
                                                    currentCategory === 'Polera' ? "Poleras" :
                                                        currentCategory
                            }
                        </h1>
                    </div>
                )}
            </div>

            <style>{`
                .hover-white:hover { color: #fff !important; }
                .light-mode .hover-white:hover { color: #000 !important; }
                .light-mode .nav-link { color: #555 !important; }
                .light-mode .nav-link:hover { color: #000 !important; }
                .nav-link { color: #bbb !important; text-decoration: none; transition: color 0.2s ease; }
                .nav-link:hover { color: #fff !important; }

                .shrunk-menu .nav-link {
                    font-size: 0.9rem !important;
                }
                .shrunk-menu .divider {
                    font-size: 0.9rem;
                    transition: font-size 0.3s ease-in-out;
                }
            `}</style>
        </header>
    );
};

export default Navbar;
