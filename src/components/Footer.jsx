import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-5 mt-5 border-top border-secondary">
            <div className="container">
                <div className="row">
                    {/* Logo */}
                    <div className="col-md-3 mb-4">
                        <h3 className="fw-bold">🎵 IHYD Music</h3>
                    </div>

                    {/* Contact */}
                    <div className="col-md-3 mb-4">
                        <h5 className="fw-bold mb-3">CONTACTO</h5>
                        <p className="mb-1">
                            <a href="tel:+56998347436" className="text-white text-decoration-none">
                                + 56 9 9834 74 36
                            </a>
                        </p>
                        <p className="mb-1">
                            <a href="mailto:i.hope.you.die.zine@gmail.com" className="text-white text-decoration-none">
                                i.hope.you.die.zine@gmail.com
                            </a>
                        </p>
                        <p className="mb-1">
                            <a href="https://ihyd.myshopify.com/" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-none">
                                ihyd.myshopify.com
                            </a>
                        </p>
                    </div>

                    {/* Payment & Delivery */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold mb-3">MEDIOS DE PAGO Y ENTREGAS</h5>
                        <p className="small mb-2">Pagos en efectivo o Transferencia Bancaria Electrónica</p>
                        <p className="small mb-2">Entregas en Metro Plaza de Maipú y Las Rejas en Horario a convenir.</p>
                        <p className="small mb-0">Envíos a regiones o dentro de Santiago via starken por pagar previa Transferencia Bancaria.</p>
                    </div>

                    {/* Social Media */}
                    <div className="col-md-2 mb-4">
                        <h5 className="fw-bold mb-3">SÍGUENOS</h5>
                        <div className="d-flex gap-3">
                            <a href="https://www.instagram.com/ihyd_zine/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://www.youtube.com/@ihyd_zine" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-youtube"></i>
                            </a>
                            <a href="https://www.facebook.com/ihyd.zine" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-facebook"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <p className="small text-secondary mb-0">© 2025 IHYD Music. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
