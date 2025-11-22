import React from 'react';

const ProductModal = ({ product, show, onClose }) => {
    if (!product) return null;

    const isDiscoType = ['CD', 'Tape', 'Vinilo', 'Zine'].includes(product.tipo_producto);

    return (
        <>
            {/* Bootstrap Modal */}
            <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title fw-bold">
                                {isDiscoType ? `${product.banda} - ${product.album}` : product.titulo}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Product Image */}
                                <div className="col-md-6 mb-3">
                                    <img
                                        src={product.imageUrl}
                                        alt={isDiscoType ? product.album : product.titulo}
                                        className="img-fluid rounded"
                                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="col-md-6">
                                    <h3 className="text-warning mb-4">${product.precio} CLP</h3>

                                    {isDiscoType ? (
                                        <>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TIPO</h6>
                                                <p className="mb-0">{product.tipo_producto}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">BANDA</h6>
                                                <p className="mb-0">{product.banda}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">ÁLBUM</h6>
                                                <p className="mb-0">{product.album}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">ESTILO</h6>
                                                <p className="mb-0">{product.estilo}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">PAÍS</h6>
                                                <p className="mb-0">{product.pais}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">SELLO</h6>
                                                <p className="mb-0">{product.sello}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TIPO</h6>
                                                <p className="mb-0">{product.tipo_producto}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TÍTULO</h6>
                                                <p className="mb-0">{product.titulo}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">GÉNERO</h6>
                                                <p className="mb-0">{product.genero}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TALLA</h6>
                                                <p className="mb-0">{product.talla}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TIPO</h6>
                                                <p className="mb-0">{product.tipo}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <a
                                href={`https://wa.me/56998347436?text=Hola, estoy interesado en: ${isDiscoType ? `${product.banda} - ${product.album}` : product.titulo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success"
                            >
                                <i className="bi bi-whatsapp me-2"></i>Consultar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default ProductModal;
