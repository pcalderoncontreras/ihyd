import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_config';
import SearchBar from './SearchBar';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ setCategory, searchTerm, setSearchTerm, theme, toggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const isAdminPage = location.pathname === '/admin';

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <header className="bg-black sticky-top" style={{ zIndex: 1000, paddingBottom: '1rem' }}>
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
                <Link className="navbar-brand mb-4 w-100 text-center" to="/" onClick={() => setCategory && setCategory('all')}>
                    <img
                        src={theme === 'dark'
                            ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1778882000/logo_blood_drips_corrected_oklrq8.png"
                            : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778869036/LogoOficialHome2_sxwfae_d0gsxt.png"
                        }
                        alt="IHYD :: Distro"
                        className="ihyd-logo"
                        style={{ 
                            maxHeight: '140px', 
                            maxWidth: '100%', 
                            height: 'auto', 
                            width: 'auto',
                            transition: 'all 0.3s ease' 
                        }}
                    />
                </Link>

                {/* Navigation Menu (Horizontal Scroll on Mobile) */}
                <nav className="p-0 mb-3 w-100 ihyd-nav-container">
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
                            <ul className="navbar-nav d-flex flex-row flex-nowrap gap-3 align-items-center m-0 p-0">
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => { navigate('/'); setCategory('all'); }}>Home</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => setCategory('CD')}>CDs</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => setCategory('Tape')}>Tapes</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => setCategory('Vinilo')}>Vinyl</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => setCategory('Zine')}>Zines</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link text-nowrap" onClick={() => setCategory('Polera')}>Poleras</button>
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
                    <div className="w-100 px-3" style={{ maxWidth: '600px' }}>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
            `}</style>
        </header>
    );
};

export default Navbar;
