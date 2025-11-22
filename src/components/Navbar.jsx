import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase_config';

const Navbar = ({ setCategory, searchTerm, setSearchTerm }) => {
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-black mb-4 sticky-top" style={{ zIndex: 1000 }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => setCategory && setCategory('all')}>
                    <img
                        src="https://res.cloudinary.com/da8xc0cap/image/upload/v1763770772/ihyd_logo_negro2_hxray8.png"
                        alt="IHYD :: Distro"
                        style={{ height: '80px', width: 'auto' }}
                        className="me-2"
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {isAdminPage ? (
                        <div className="ms-auto d-flex align-items-center gap-3 w-100 justify-content-end">
                            <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar productos..."
                                    value={searchTerm || ''}
                                    onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                                />
                            </div>
                            {currentUser && (
                                <button className="btn btn-outline-light" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            )}
                        </div>
                    ) : (
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" style={{ color: 'white' }} onClick={() => setCategory('CD')}>Cds</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" style={{ color: 'white' }} onClick={() => setCategory('Tape')}>Tapes</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" style={{ color: 'white' }} onClick={() => setCategory('Vinilo')}>Vinilos</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" style={{ color: 'white' }} onClick={() => setCategory('Zine')}>Zines</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" style={{ color: 'white' }} onClick={() => setCategory('Polera')}>Poleras</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
