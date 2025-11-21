import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProductCard from './ProductCard';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    if (loading) return <div className="container mt-5 text-center">Loading products...</div>;
    if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12 text-center">No products found for {category === 'all' ? 'any category' : category}.</div>
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList;
