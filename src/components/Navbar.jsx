import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setCategory }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-black mb-4 sticky-top" style={{ zIndex: 1000 }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => setCategory('all')}>
                    <span className="fs-4 fw-bold me-2">🎵 IHYD Music</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setCategory('CD')}>Cds</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setCategory('Tape')}>Tapes</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setCategory('Vinilo')}>Vinilos</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setCategory('Zine')}>Zines</button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={() => setCategory('Polera')}>Poleras</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
