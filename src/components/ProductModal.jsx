import React from 'react';

const ProductModal = ({ product, show, onClose }) => {
    if (!product) return null;

    const isDiscoType = ['cd', 'tape', 'vinilo'].includes(String(product.tipo_producto || '').toLowerCase());
    const isZine = String(product.tipo_producto || '').toLowerCase() === 'zine';

    const getWhatsAppTitle = () => {
        if (isDiscoType) return `${product.banda} - ${product.album}`;
        if (isZine) return `${product.nombre_revista} #${product.numero}`;
        return product.titulo;
    };

    const getTitle = () => {
        if (isDiscoType) return `${product.banda} — ${product.album}`;
        if (isZine) return `${product.nombre_revista} #${product.numero}`;
        return product.titulo;
    };

    const renderMediaPlayer = () => {
        if (!product.mediaUrl) return null;

        const url = product.mediaUrl;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let embedUrl = url;
            if (url.includes('watch?v=')) {
                embedUrl = url.replace('watch?v=', 'embed/');
                if (embedUrl.includes('&')) embedUrl = embedUrl.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
            }
            return (
                <div className="ratio ratio-16x9 mt-3">
                    <iframe
                        src={embedUrl}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }

        if (url.includes('soundcloud.com')) {
            return (
                <div className="mt-3">
                    <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                    ></iframe>
                </div>
            );
        }

        if (url.includes('bandcamp.com')) {
            return (
                <div className="mt-3 text-center">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="ihyd-btn-ghost w-100 d-block">
                        <i className="bi bi-music-note-list me-2"></i> Escuchar en Bandcamp
                    </a>
                </div>
            );
        }

        return (
            <div className="mt-3 text-center">
                <a href={url} target="_blank" rel="noopener noreferrer" className="ihyd-btn-ghost w-100 d-block">
                    <i className="bi bi-link-45deg me-2"></i> Ver enlace multimedia
                </a>
            </div>
        );
    };

    const discoMeta = [
        ['TIPO', product.tipo_producto],
        ['BANDA', product.banda],
        ['ÁLBUM', product.album],
        product.estilo ? ['ESTILO', product.estilo] : null,
        product.pais ? ['PAÍS', product.pais] : null,
        product.sello ? ['SELLO', product.sello] : null,
        product.detalles ? ['DETALLES', product.detalles] : null,
    ].filter(Boolean);

    const zineMeta = [
        ['TIPO', product.tipo_producto],
        ['REVISTA', product.nombre_revista],
        ['NÚMERO', `#${product.numero}`],
        product.año ? ['AÑO', product.año] : null,
        product.pais ? ['PAÍS', product.pais] : null,
        product.detalles ? ['DETALLES', product.detalles] : null,
    ].filter(Boolean);

    const poleraMeta = [
        ['TIPO', product.tipo_producto],
        ['TÍTULO', product.titulo],
        product.genero ? ['GÉNERO', product.genero] : null,
        product.talla ? ['TALLA', product.talla] : null,
        product.tipo ? ['SUBTIPO', product.tipo] : null,
    ].filter(Boolean);

    const metaFields = isDiscoType ? discoMeta : isZine ? zineMeta : poleraMeta;

    const formatPrice = (price) => {
        if (price == null) return '—';
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <>
            <div
                className={`modal fade ${show ? 'show' : ''}`}
                style={{ display: show ? 'block' : 'none' }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div
                        className="modal-content ihyd-modal-content"
                        style={{ '--modal-bg-image': `url(${product.imageUrl})` }}
                    >
                        <button className="ihyd-modal-close" onClick={onClose}></button>

                        <p className="ihyd-modal-title">{getTitle()}</p>

                        <div className="ihyd-modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <img
                                        src={product.imageUrl}
                                        alt={getTitle()}
                                        className="ihyd-modal-img"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <p className="ihyd-modal-price">
                                        {product.precio != null ? `$${formatPrice(product.precio)} CLP` : '—'}
                                    </p>

                                    {metaFields.map(([label, value]) => (
                                        <div key={label} className="ihyd-modal-meta">
                                            <p className="ihyd-modal-meta-label">{label}</p>
                                            <p className="ihyd-modal-meta-value">{value}</p>
                                        </div>
                                    ))}

                                    {renderMediaPlayer()}
                                </div>
                            </div>
                        </div>

                        <div className="ihyd-modal-footer">
                            <button className="ihyd-btn-ghost" onClick={onClose}>CERRAR</button>
                            <a
                                href={`https://wa.me/56998347436?text=Hola, estoy interesado en: ${getWhatsAppTitle()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ihyd-btn-primary"
                            >
                                <i className="bi bi-whatsapp"></i> CONSULTAR
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default ProductModal;
