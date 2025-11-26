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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

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
        setCurrentPage(1); // Reset to first page when search changes
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
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className="container mt-4">
                <Carousel />
            </div>
            <div className="container mt-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {searchTerm ? (
                <div className="container">
                    {loading ? (
                        <div className="text-center text-white">Buscando productos...</div>
                    ) : (
                        <>
                            {filteredProducts.length > 0 && (
                                <div className="mb-3 text-white text-end">
                                    <small>Mostrando {paginatedProducts.length} de {filteredProducts.length} productos</small>
                                </div>
                            )}
                            <div className="row">
                                {paginatedProducts.length === 0 ? (
                                    <div className="col-12 text-center text-white">No se encontraron productos.</div>
                                ) : (
                                    paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center mt-5 mb-4">
                                    <nav>
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link bg-dark text-white border-secondary"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Anterior
                                                </button>
                                            </li>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button
                                                        className={`page-link ${currentPage === page ? 'bg-primary' : 'bg-dark text-white'} border-secondary`}
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link bg-dark text-white border-secondary"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Siguiente
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
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
