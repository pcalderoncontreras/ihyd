import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-4 mt-4 border-top border-secondary">
            <div className="container">
                <div className="row">
                    {/* Logo */}
                    <div className="col-md-3 mb-4">
                        <img
                            src="https://res.cloudinary.com/da8xc0cap/image/upload/v1763770772/ihyd_logo_new_azypuq.png"
                            alt="IHYD :: Distro"
                            style={{ height: '90px', width: 'auto' }}
                            className="me-3"
                        />
                    </div>

                    {/* Contact */}
                    <div className="col-md-3 mb-2">
                        <h5 className="fw-bold mb-3">CONTACTO</h5>
                        <p className="mb-1">
                            <a href="https://wa.me/56998347436" target="_blank" className="text-white text-decoration-none">
                                +569 9834 7436
                            </a>
                        </p>
                        <p className="mb-1">
                            <a href="mailto:i.hope.you.die.zine@gmail.com" rel="noopener noreferrer" className="text-white text-decoration-none">
                                i.hope.you.die.zine@gmail.com
                            </a>
                        </p>
                        <p className="mb-1">
                            <a href="http://ihyd.netlify.app" target="_blank" className="text-white text-decoration-none">
                                ihyd.netlify.app
                            </a>
                        </p>
                    </div>

                    {/* Payment & Delivery */}
                    <div className="col-md-4 mb-4">
                        <h5 className="fw-bold mb-3">MEDIOS DE PAGO Y ENTREGAS</h5>
                        <p className="small mb-1">Pagos en efectivo o Transferencia Bancaria Electrónica. <br />
                            Entregas en Metro Plaza de Maipú y Las Rejas en Horario a convenir. <br />
                            Envíos a regiones o dentro de Santiago via starken por pagar previa Transferencia Bancaria.</p>
                    </div>

                    {/* Social Media */}
                    <div className="col-md-2 mb-4">
                        <h5 className="fw-bold mb-3">SÍGUENOS</h5>
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
                        <p className="small text-secondary mb-0">© 2025 IHYD Distro. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
