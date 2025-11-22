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
    }, [category]);

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

    if (loading) return <div className="container mt-5 text-center">Loading products...</div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="row">
                {filteredProducts.length === 0 ? (
                    <div className="col-12 text-center">
                        {searchTerm
                            ? `No se encontraron productos que coincidan con "${searchTerm}".`
                            : `No products found for ${category === 'all' ? 'any category' : category}.`
                        }
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;
