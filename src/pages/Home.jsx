import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import CategorySection from '../components/CategorySection';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const Home = ({ setCategory }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchTerm) {
            const fetchAllProducts = async () => {
                setLoading(true);
                try {
                    const productsCollectionRef = collection(db, 'productos');
                    const data = await getDocs(productsCollectionRef);
                    const products = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    const activeProducts = products.filter(p => p.active !== false);
                    setAllProducts(activeProducts);
                } catch (err) {
                    console.error("Error fetching products:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllProducts();
        }
    }, [searchTerm]);

    const filterProducts = (products) => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(product => {
            const banda = product.banda?.toLowerCase() || '';
            const album = product.album?.toLowerCase() || '';
            const titulo = product.titulo?.toLowerCase() || '';
            const estilo = product.estilo?.toLowerCase() || '';
            const pais = product.pais?.toLowerCase() || '';
            const sello = product.sello?.toLowerCase() || '';

            return banda.includes(term) ||
                album.includes(term) ||
                titulo.includes(term) ||
                estilo.includes(term) ||
                pais.includes(term) ||
                sello.includes(term);
        });
    };

    const filteredProducts = filterProducts(allProducts);

    return (
        <>
            <Carousel />
            <div className="container mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {searchTerm ? (
                <div className="container">
                    {loading ? (
                        <div className="text-center">Buscando productos...</div>
                    ) : (
                        <div className="row">
                            {filteredProducts.length === 0 ? (
                                <div className="col-12 text-center">No se encontraron productos.</div>
                            ) : (
                                filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-4">
                    <CategorySection category="CD" title="CD's" setCategory={setCategory} />
                    <CategorySection category="Tape" title="TAPES" setCategory={setCategory} />
                    <CategorySection category="Vinilo" title="VINILOS" setCategory={setCategory} />
                </div>
            )}
        </>
    );
};

export default Home;
