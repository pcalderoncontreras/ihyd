import React from 'react';

const Footer = ({ theme }) => {
    return (
        <footer className="bg-black text-white py-4 mt-4 border-top border-secondary">
            <div className="container">
                <div className="row">
                    {/* Logo */}
                    <div className="col-md-3 mb-4">
                        <img
                            src={theme === 'dark'
                                ? "https://res.cloudinary.com/da8xc0cap/image/upload/v1763770772/ihyd_logo_new_azypuq.png"
                                : "https://res.cloudinary.com/da8xc0cap/image/upload/v1778870101/ihyd_logo_short2_osw5w4.png"}
                            alt="IHYD :: Distro"
                            style={{ maxHeight: '90px', maxWidth: '100%', height: 'auto', width: 'auto' }}
                            className="me-3 ihyd-logo-footer"
                        />
                    </div>

                    {/* Contact */}
                    <div className="col-md-3 mb-2">
                        <h2 className="fw-bold mb-3">Contacto</h2>
                        <p className="mb-1">
                            <a href="https://wa.me/56998347436" target="_blank" className="text-white text-decoration-none">
                                +569 9834 7436
                            </a>
                        </p>
                        <p className=" small mb-1">
                            <a href="mailto:i.hope.you.die.zine@gmail.com" rel="noopener noreferrer" className="text-white text-decoration-none">
                                i.hope.you.die.zine@gmail.com
                            </a>
                        </p>
                        <p className="small mb-1">
                            <a href="http://ihyd.netlify.app" target="_blank" className="text-white text-decoration-none">
                                ihyd.netlify.app
                            </a>
                        </p>
                    </div>

                    {/* Payment & Delivery */}
                    <div className="col-md-4 mb-4">
                        <h2 className="fw-bold mb-3">Medios de pago y entregas</h2>
                        <p className="small mb-2">Pagos en efectivo o Transferencia Bancaria Electrónica. <br />
                            Entregas en Metro Plaza de Maipú y Las Rejas en Horario a convenir. <br />
                            Envíos a regiones o dentro de Santiago via starken por pagar previa Transferencia Bancaria.</p>
                    </div>

                    {/* Social Media */}
                    <div className="col-md-2 mb-4">
                        <h2 className="fw-bold mb-3">Síguenos</h2>
                        <div className="d-flex gap-5">
                            <a href="https://www.instagram.com/ihyddistro/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://soundcloud.com/ihopeyoudiezine" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-youtube"></i>
                            </a>
                            <a href="https://www.facebook.com/people/I-Hope-You-Die-Distro/100050554343737/" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                                <i className="bi bi-facebook"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <p className="small text-secondary mb-0">© 2026 IHYD Distro. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
