import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const productsCollectionRef = collection(db, 'productos');

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                let q = productsCollectionRef;

                if (category && category !== 'all') {
                    // Filter by tipo_producto for all categories (CD, Tape, Vinilo, Zine, Polera)
                    q = query(productsCollectionRef, where('tipo_producto', '==', category));
                }

                const data = await getDocs(q);
                // Filter client-side to handle missing 'active' field (treat as true)
                const allProducts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                const activeProducts = allProducts.filter(p => p.active !== false);
                setProducts(activeProducts);
                setError(null);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        getProducts();
        setCurrentPage(1); // Reset to first page when category changes
    }, [category]);

    useEffect(() => {
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

    const filteredProducts = filterProducts(products);
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

    if (loading) return <div className="container mt-5 text-center text-white">Cargando productos...</div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

    // Get category title
    const getCategoryTitle = () => {
        const titles = {
            'CD': 'CDs',
            'Tape': 'Tapes',
            'Vinilo': 'Vinilos',
            'Zine': 'Zines',
            'Polera': 'Poleras'
        };
        return titles[category] || 'Productos';
    };

    return (
        <div className="container">
            {/* Category Title */}
            <h1 className="text-white text-uppercase fw-bold mb-4" style={{ borderBottom: '2px solid #444', paddingBottom: '15px' }}>
                {getCategoryTitle()}
            </h1>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {filteredProducts.length > 0 && (
                <div className="mb-3 text-white text-end">
                    <small>Mostrando {paginatedProducts.length} de {filteredProducts.length} productos</small>
                </div>
            )}

            <div className="row">
                {paginatedProducts.length === 0 ? (
                    <div className="col-12 text-center text-white">
                        {searchTerm
                            ? `No se encontraron productos que coincidan con "${searchTerm}".`
                            : `No se encontraron productos para ${category === 'all' ? 'ninguna categoría' : category}.`
                        }
                    </div>
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
        </div>
    );
};

export default ProductList;
