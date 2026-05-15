import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_config';
import SearchBar from './SearchBar';
import { FaUser, FaShoppingCart, FaSun, FaMoon } from 'react-icons/fa';

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
            {/* Top right: Theme Toggle */}
            <div className="container-fluid pe-4 pt-3 position-absolute top-0 end-0 d-flex justify-content-end">
                <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary d-flex align-items-center" style={{ borderRadius: '20px' }}>
                    {theme === 'dark' ? (
                        <><FaSun className="me-2" /> </>
                    ) : (
                        <><FaMoon className="me-2" /> </>
                    )}
                </button>
            </div>

            <div className="container d-flex flex-column align-items-center pt-4">
                {/* Logo */}
                <Link className="navbar-brand mb-4" to="/" onClick={() => setCategory && setCategory('all')}>
                    <img
                        src={theme === 'dark'
                            ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1764116670/LogoOficialHome_sxwfae.png"
                            : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778869036/LogoOficialHome2_sxwfae_d0gsxt.png"
                        }
                        alt="IHYD :: Distro"
                        style={{ height: '140px', width: 'auto', transition: 'all 0.3s ease' }}
                    />
                </Link>

                {/* Navigation Menu */}
                <nav className="navbar navbar-expand-lg navbar-dark p-0 mb-3 w-100">
                    <button className="navbar-toggler mx-auto mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        {isAdminPage ? (
                            <div className="d-flex align-items-center gap-3">
                                {currentUser && (
                                    <>
                                        <span className="text-white">
                                            Bienvenido: <strong>{currentUser.email}</strong>
                                        </span>
                                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <ul className="navbar-nav align-items-center gap-3" style={{ fontSize: '0.95rem' }}>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => { navigate('/'); setCategory('all'); }}>Home</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setCategory('CD')}>CDs</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setCategory('Tape')}>Tapes</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setCategory('Vinilo')}>Vinyl</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setCategory('Zine')}>Zines</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => setCategory('Polera')}>Poleras</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={() => window.open('https://docs.google.com/spreadsheets/d/1FN8jdlpdQsz4ioP0geF9oylUQTyn5-Yk/edit?usp=sharing&ouid=115226895934415359333&rtpof=true&sd=true', '_blank')}>Catálogo</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </nav>

                {/* Search Bar */}
                <div className="w-100 px-3" style={{ maxWidth: '600px' }}>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
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
