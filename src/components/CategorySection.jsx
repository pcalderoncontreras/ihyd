import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProductCard from './ProductCard';

const CategorySection = ({ category, title, setCategory }) => {
    const [products, setProducts] = useState([]);
    const productsCollectionRef = collection(db, 'productos');

    useEffect(() => {
        const getProducts = async () => {
            try {
                // Obtener todos los productos
                const data = await getDocs(productsCollectionRef);
                const allProducts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

                // Filtrar por categoría (case-insensitive) y activos
                const filtered = allProducts.filter(p =>
                    p.active !== false &&
                    p.tipo_producto &&
                    String(p.tipo_producto).toLowerCase() === category.toLowerCase()
                );

                // Take first 4 products
                setProducts(filtered.slice(0, 4));
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        getProducts();
    }, [category]);

    if (products.length === 0) return null;

    return (
        <div className="container mb-5">
            <div className="mb-4">
                <h2 className="text-uppercase fw-bold text-white mb-4" style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>{title}</h2>
                <div className="row">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button
                        className="btn btn-dark px-4 py-2"
                        onClick={() => setCategory(category)}
                        style={{ border: '1px solid #444' }}
                    >
                        Ver todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategorySection;
