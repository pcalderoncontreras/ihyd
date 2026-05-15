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
            <div className="col-md-3 mb-4">
                <div className="ihyd-card" onClick={() => setShowModal(true)}>
                    <div className="ihyd-card-img-wrapper">
                        <img
                            src={product.imageUrl}
                            alt={getTitle()}
                        />
                        <div className="ihyd-card-overlay">
                            <span className="ihyd-card-overlay-price">${product.precio} CLP</span>
                            <button className="ihyd-card-overlay-cta">VER DETALLE</button>
                        </div>
                    </div>
                    <div className="px-0 pt-2 pb-1">
                        {isDiscoType ? (
                            <>
                                <p className="ihyd-card-band mb-0">{product.banda}</p>
                                <p className="ihyd-card-album mb-1">{product.album}</p>
                                <p className="ihyd-card-meta mb-1">{product.sello}</p>
                            </>
                        ) : isZine ? (
                            <>
                                <p className="ihyd-card-band mb-0">{product.nombre_revista} #{product.numero}</p>
                                <p className="ihyd-card-meta mb-1">{product.año}{product.pais ? ` — ${product.pais}` : ''}</p>
                            </>
                        ) : (
                            <>
                                <p className="ihyd-card-band mb-0">{product.titulo}</p>
                                <p className="ihyd-card-meta mb-1">{product.tipo}</p>
                            </>
                        )}
                        <p className="ihyd-card-price mt-1">${product.precio} CLP</p>
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
