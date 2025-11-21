import React from 'react';
import Carousel from '../components/Carousel';
import CategorySection from '../components/CategorySection';

const Home = ({ setCategory }) => {
    return (
        <>
            <Carousel />
            <div className="py-4">
                <CategorySection category="CD" title="CD's" setCategory={setCategory} />
                <CategorySection category="Tape" title="TAPES" setCategory={setCategory} />
                <CategorySection category="Vinilo" title="VINILOS" setCategory={setCategory} />
            </div>
        </>
    );
};

export default Home;
