import React, { useState } from 'react';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
    const [showModal, setShowModal] = useState(false);

    const isDiscoType = product.tipo_producto &&
        ['cd', 'tape', 'vinilo'].includes(String(product.tipo_producto).toLowerCase());

    const isZine = product.tipo_producto &&
        String(product.tipo_producto).toLowerCase() === 'zine';

    const getTitle = () => {
        if (isDiscoType) return `${product.banda} - ${product.album}`;
        if (isZine) return `${product.nombre_revista} #${product.numero}`;
        return product.titulo;
    };

    return (
        <>
            <div className="col-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
                <div className="ihyd-card w-100" onClick={() => setShowModal(true)}>
                    <div className="ihyd-card-img-wrapper">
                        <img
                            src={product.imageUrl}
                            alt={getTitle()}
                        />
                        <div className="ihyd-card-overlay">
                            <span className="ihyd-card-overlay-price">{product.precio != null ? `$${product.precio} CLP` : '—'}</span>
                            <button className="ihyd-card-overlay-cta">VER DETALLE</button>
                        </div>
                    </div>
                    <div className="px-3 pt-2 pb-3 d-flex flex-column flex-grow-1">
                        {isDiscoType ? (
                            <>
                                <p className="ihyd-card-band mb-0">{product.banda}</p>
                                <p className="ihyd-card-album mb-1">{product.album}</p>
                                <p className="ihyd-card-meta mb-auto">{product.sello}</p>
                            </>
                        ) : isZine ? (
                            <>
                                <p className="ihyd-card-band mb-0">{product.nombre_revista} #{product.numero}</p>
                                <p className="ihyd-card-meta mb-auto">{product.año || ''}{product.pais ? ` — ${product.pais}` : ''}</p>
                            </>
                        ) : (
                            <>
                                <p className="ihyd-card-band mb-0">{product.titulo}</p>
                                <p className="ihyd-card-meta mb-auto">{product.tipo}</p>
                            </>
                        )}
                        <p className="ihyd-card-price mt-2">{product.precio != null ? `$${product.precio} CLP` : '—'}</p>
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
