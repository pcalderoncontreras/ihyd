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
    const [sortOrder, setSortOrder] = useState('default'); // default, alpha-asc, alpha-desc, price-asc, price-desc, date-desc, date-asc
    const itemsPerPage = 20;
    const productsCollectionRef = collection(db, 'productos');

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                // Obtener todos los productos
                const data = await getDocs(productsCollectionRef);
                const allProducts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

                // Filtrar por categoría (case-insensitive) y activos
                let filtered = allProducts.filter(p => p.active !== false);

                if (category && category !== 'all') {
                    filtered = filtered.filter(p =>
                        p.tipo_producto &&
                        String(p.tipo_producto).toLowerCase() === category.toLowerCase()
                    );
                }

                setProducts(filtered);
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
        setCurrentPage(1); // Reset to first page when search or sort changes
    }, [searchTerm, sortOrder]);

    const filterProducts = (products) => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(product => {
            const banda = String(product.banda || '').toLowerCase();
            const album = String(product.album || '').toLowerCase();
            const titulo = String(product.titulo || '').toLowerCase();
            const estilo = String(product.estilo || '').toLowerCase();
            const pais = String(product.pais || '').toLowerCase();
            const sello = String(product.sello || '').toLowerCase();

            return banda.includes(term) ||
                album.includes(term) ||
                titulo.includes(term) ||
                estilo.includes(term) ||
                pais.includes(term) ||
                sello.includes(term);
        });
    };

    const sortProducts = (products) => {
        const sorted = [...products];

        switch (sortOrder) {
            case 'alpha-asc':
                return sorted.sort((a, b) => {
                    const nameA = String(a.banda || a.titulo || '').toLowerCase();
                    const nameB = String(b.banda || b.titulo || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            case 'alpha-desc':
                return sorted.sort((a, b) => {
                    const nameA = String(a.banda || a.titulo || '').toLowerCase();
                    const nameB = String(b.banda || b.titulo || '').toLowerCase();
                    return nameB.localeCompare(nameA);
                });
            case 'price-asc':
                return sorted.sort((a, b) => (a.precio || 0) - (b.precio || 0));
            case 'price-desc':
                return sorted.sort((a, b) => (b.precio || 0) - (a.precio || 0));
            case 'date-desc': // Más nuevo primero
                return sorted.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeB - timeA;
                });
            case 'date-asc': // Más antiguo primero
                return sorted.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeA - timeB;
                });
            default:
                return sorted;
        }
    };

    const filteredProducts = filterProducts(products);
    const sortedProducts = sortProducts(filteredProducts);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

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

            {/* Sort and Product Count */}
            {filteredProducts.length > 0 && (
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <label className="text-white me-2">Ordenar por:</label>
                        <select
                            className="form-select form-select-sm d-inline-block"
                            style={{ width: 'auto' }}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="default">Por defecto</option>
                            <option value="alpha-asc">Alfabético (A-Z)</option>
                            <option value="alpha-desc">Alfabético (Z-A)</option>
                            <option value="price-asc">Precio (menor a mayor)</option>
                            <option value="price-desc">Precio (mayor a menor)</option>
                            <option value="date-desc">Más nuevos primero</option>
                            <option value="date-asc">Más antiguos primero</option>
                        </select>
                    </div>
                    <div className="text-white">
                        <small>Mostrando {paginatedProducts.length} de {sortedProducts.length} productos</small>
                    </div>
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
