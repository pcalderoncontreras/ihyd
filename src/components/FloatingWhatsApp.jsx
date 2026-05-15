import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingWhatsApp = () => {
    const location = useLocation();
    
    // Hide on admin and login pages
    if (location.pathname === '/admin' || location.pathname === '/login') {
        return null;
    }

    return (
        <a 
            href="https://wa.me/56998347436" 
            target="_blank" 
            rel="noopener noreferrer"
            className="floating-whatsapp"
            aria-label="Contactar por WhatsApp"
        >
            <i className="bi bi-whatsapp"></i>
        </a>
    );
};

export default FloatingWhatsApp;
