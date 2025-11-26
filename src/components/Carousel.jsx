import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs } from 'firebase/firestore';

const Carousel = () => {
    const [carouselImages, setCarouselImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCarouselImages();
    }, []);

    const getCarouselImages = async () => {
        try {
            const carouselCollectionRef = collection(db, 'carousel');
            const data = await getDocs(carouselCollectionRef);
            const images = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            // Filtrar solo imágenes activas y ordenar
            const activeImages = images
                .filter(img => img.active !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            setCarouselImages(activeImages);
        } catch (error) {
            console.error('Error fetching carousel images:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (carouselImages.length === 0) {
        return null; // No mostrar el carrusel si no hay imágenes
    }

    return (
        <div id="carouselExampleCaptions" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {carouselImages.map((image, index) => (
                    <button
                        key={image.id}
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner">
                {carouselImages.map((image, index) => (
                    <div key={image.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <img
                            src={image.imageUrl}
                            className="d-block w-100"
                            alt={image.title || 'Carousel'}
                            style={{
                                maxHeight: '400px',
                                width: '100%',
                                objectFit: 'contain',
                                backgroundColor: '#000'
                            }}
                        />
                        {(image.title || image.description) && (
                            <div className="carousel-caption d-none d-md-block">
                                {image.title && <h5>{image.title}</h5>}
                                {image.description && <p>{image.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Carousel;
