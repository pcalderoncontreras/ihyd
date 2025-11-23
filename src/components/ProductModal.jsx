import React from 'react';

const ProductModal = ({ product, show, onClose }) => {
    if (!product) return null;

    const isDiscoType = ['CD', 'Tape', 'Vinilo'].includes(product.tipo_producto);
    const isZine = product.tipo_producto === 'Zine';

    // Determinar el título para WhatsApp
    const getWhatsAppTitle = () => {
        if (isDiscoType) return `${product.banda} - ${product.album}`;
        if (isZine) return `${product.nombre_revista} #${product.numero}`;
        return product.titulo;
    };

    return (
        <>
            {/* Bootstrap Modal */}
            <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-white">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title fw-bold">
                                {isDiscoType ? `${product.banda} - ${product.album}` :
                                    isZine ? `${product.nombre_revista} #${product.numero}` :
                                        product.titulo}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Product Image */}
                                <div className="col-md-6 mb-3">
                                    <img
                                        src={product.imageUrl}
                                        alt={isDiscoType ? product.album : isZine ? product.nombre_revista : product.titulo}
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
                                            {product.estilo && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">ESTILO</h6>
                                                    <p className="mb-0">{product.estilo}</p>
                                                </div>
                                            )}
                                            {product.pais && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">PAÍS</h6>
                                                    <p className="mb-0">{product.pais}</p>
                                                </div>
                                            )}
                                            {product.sello && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">SELLO</h6>
                                                    <p className="mb-0">{product.sello}</p>
                                                </div>
                                            )}
                                            {product.detalles && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">DETALLES</h6>
                                                    <p className="mb-0">{product.detalles}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : isZine ? (
                                        <>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">TIPO</h6>
                                                <p className="mb-0">{product.tipo_producto}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">NOMBRE REVISTA</h6>
                                                <p className="mb-0">{product.nombre_revista}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-secondary mb-1">NÚMERO</h6>
                                                <p className="mb-0">#{product.numero}</p>
                                            </div>
                                            {product.año && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">AÑO</h6>
                                                    <p className="mb-0">{product.año}</p>
                                                </div>
                                            )}
                                            {product.pais && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">PAÍS</h6>
                                                    <p className="mb-0">{product.pais}</p>
                                                </div>
                                            )}
                                            {product.detalles && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">DETALLES</h6>
                                                    <p className="mb-0">{product.detalles}</p>
                                                </div>
                                            )}
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
                                            {product.genero && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">GÉNERO</h6>
                                                    <p className="mb-0">{product.genero}</p>
                                                </div>
                                            )}
                                            {product.talla && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">TALLA</h6>
                                                    <p className="mb-0">{product.talla}</p>
                                                </div>
                                            )}
                                            {product.tipo && (
                                                <div className="mb-3">
                                                    <h6 className="text-secondary mb-1">TIPO</h6>
                                                    <p className="mb-0">{product.tipo}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <a
                                href={`https://wa.me/56998347436?text=Hola, estoy interesado en: ${getWhatsAppTitle()}`}
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
