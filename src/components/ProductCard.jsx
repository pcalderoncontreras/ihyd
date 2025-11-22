import React, { useState } from 'react';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
    const [showModal, setShowModal] = useState(false);

    // Detectar si es un tipo de disco (CD, Tape, Vinilo, Zine) - case insensitive
    const isDiscoType = product.tipo_producto &&
        ['cd', 'tape', 'vinilo', 'zine'].includes(product.tipo_producto.toLowerCase());

    return (
        <>
            <div className="col-md-3 mb-4">
                <div
                    className="card h-100 bg-black text-white border-0"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowModal(true)}
                >
                    <img
                        src={product.imageUrl}
                        className="card-img-top"
                        alt={isDiscoType ? product.album : product.titulo}
                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '0' }}
                    />
                    <div className="card-body px-0">
                        {isDiscoType ? (
                            <>
                                <h6 className="card-title fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                                    {product.banda} - {product.album}
                                </h6>
                                <p className="card-text small text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
                                    {product.sello}
                                </p>
                            </>
                        ) : (
                            <>
                                <h6 className="card-title fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                                    {product.titulo}
                                </h6>
                                <p className="card-text small text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
                                    {product.tipo}
                                </p>
                            </>
                        )}
                        <h5 className="fw-bold mt-2">${product.precio} CLP</h5>
                    </div>
                </div>
            </div>

            <ProductModal
                product={product}
                show={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default ProductCard;
