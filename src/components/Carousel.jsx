import React from 'react';

const Carousel = () => {
    return (
        <div id="carouselExampleCaptions" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="https://res.cloudinary.com/da8xc0cap/image/upload/v1763770420/banner03_zpg493.jpg" className="d-block w-100" alt="New Releases" style={{ height: '400px', objectFit: 'cover' }} />
                    <div className="carousel-caption d-none d-md-block">
                        <h5></h5>
                        <p></p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://res.cloudinary.com/da8xc0cap/image/upload/v1763770419/banner02_agve0n.jpg" className="d-block w-100" alt="Vinyl Collection" style={{ height: '400px', objectFit: 'cover' }} />
                    <div className="carousel-caption d-none d-md-block">
                        <h5></h5>
                        <p></p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://res.cloudinary.com/da8xc0cap/image/upload/v1763770420/banner01_ibzan3.jpg" className="d-block w-100" alt="Exclusive Merch" style={{ height: '400px', objectFit: 'cover' }} />
                    <div className="carousel-caption d-none d-md-block">
                        <h5></h5>
                        <p></p>
                    </div>
                </div>
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
