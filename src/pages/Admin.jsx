import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [productType, setProductType] = useState('CD'); // CD, Tape, Vinilo, Zine, Polera
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newProduct, setNewProduct] = useState({
        // Common
        precio: '',
        imageUrl: '',
        active: true,
        // Disco-like (CD, Tape, Vinilo, Zine)
        album: '',
        banda: '',
        estilo: '',
        pais: '',
        sello: '',
        tipo_producto: 'CD',
        // Polera specific
        titulo: '',
        genero: '',
        talla: '',
        tipo: ''
    });

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const productsCollectionRef = collection(db, 'productos');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        getProducts();
    }, [currentUser, navigate]);

    const getProducts = async () => {
        const data = await getDocs(productsCollectionRef);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const createProduct = async (e) => {
        e.preventDefault();
        const productData = {
            precio: Number(newProduct.precio),
            imageUrl: newProduct.imageUrl,
            tipo_producto: productType,
            active: true
        };

        if (productType === 'Polera') {
            Object.assign(productData, {
                titulo: newProduct.titulo,
                genero: newProduct.genero,
                talla: newProduct.talla,
                tipo: newProduct.tipo,
            });
        } else {
            Object.assign(productData, {
                album: newProduct.album,
                banda: newProduct.banda,
                estilo: newProduct.estilo,
                pais: newProduct.pais,
                sello: newProduct.sello,
            });
        }

        await addDoc(productsCollectionRef, productData);
        resetForm();
        getProducts();
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        const productDoc = doc(db, 'productos', editingId);

        const productData = {
            precio: Number(newProduct.precio),
            imageUrl: newProduct.imageUrl,
            tipo_producto: productType,
            active: newProduct.active
        };

        if (productType === 'Polera') {
            Object.assign(productData, {
                titulo: newProduct.titulo,
                genero: newProduct.genero,
                talla: newProduct.talla,
                tipo: newProduct.tipo,
            });
        } else {
            Object.assign(productData, {
                album: newProduct.album,
                banda: newProduct.banda,
                estilo: newProduct.estilo,
                pais: newProduct.pais,
                sello: newProduct.sello,
            });
        }

        await updateDoc(productDoc, productData);
        resetForm();
        getProducts();
    };

    const resetForm = () => {
        setNewProduct({
            precio: '',
            imageUrl: '',
            active: true,
            album: '',
            banda: '',
            estilo: '',
            pais: '',
            sello: '',
            tipo_producto: 'CD',
            titulo: '',
            genero: '',
            talla: '',
            tipo: ''
        });
        setProductType('CD');
        setIsEditing(false);
        setEditingId(null);
    };

    const startEditing = (product) => {
        setIsEditing(true);
        setEditingId(product.id);
        setProductType(product.tipo_producto);
        setNewProduct({
            precio: product.precio,
            imageUrl: product.imageUrl || '',
            active: product.active !== undefined ? product.active : true,
            album: product.album || '',
            banda: product.banda || '',
            estilo: product.estilo || '',
            pais: product.pais || '',
            sello: product.sello || '',
            tipo_producto: product.tipo_producto,
            titulo: product.titulo || '',
            genero: product.genero || '',
            talla: product.talla || '',
            tipo: product.tipo || ''
        });
        window.scrollTo(0, 0);
    };

    const toggleActive = async (product) => {
        const productDoc = doc(db, 'productos', product.id);
        const newActiveStatus = !product.active;
        await updateDoc(productDoc, { active: newActiveStatus });
        getProducts();
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const productDoc = doc(db, 'productos', id);
            await deleteDoc(productDoc);
            getProducts();
        }
    };

    const isDiscoType = (type) => ['CD', 'Tape', 'Vinilo', 'Zine'].includes(type);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Admin Panel</h2>

            <div className="card mb-5">
                <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
                    <span className="fw-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</span>
                    <select
                        className="form-select w-auto"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                    >
                        <option value="CD">CD</option>
                        <option value="Tape">Tape</option>
                        <option value="Vinilo">Vinilo</option>
                        <option value="Zine">Zine</option>
                        <option value="Polera">Polera</option>
                    </select>
                </div>
                <div className="card-body">
                    <form onSubmit={isEditing ? updateProduct : createProduct} className="row g-3">
                        {/* Common Fields */}
                        <div className="col-md-2">
                            <label className="form-label">Price</label>
                            <input type="number" className="form-control" placeholder="Precio" value={newProduct.precio} onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Image URL</label>
                            <input type="url" className="form-control" placeholder="Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} required />
                        </div>

                        {/* Disco-like Specific Fields */}
                        {isDiscoType(productType) && (
                            <>
                                <div className="col-md-3">
                                    <label className="form-label">Album</label>
                                    <input type="text" className="form-control" placeholder="Album" value={newProduct.album} onChange={(e) => setNewProduct({ ...newProduct, album: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Banda</label>
                                    <input type="text" className="form-control" placeholder="Banda" value={newProduct.banda} onChange={(e) => setNewProduct({ ...newProduct, banda: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Estilo</label>
                                    <input type="text" className="form-control" placeholder="Estilo" value={newProduct.estilo} onChange={(e) => setNewProduct({ ...newProduct, estilo: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Pais</label>
                                    <input type="text" className="form-control" placeholder="Pais" value={newProduct.pais} onChange={(e) => setNewProduct({ ...newProduct, pais: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Sello</label>
                                    <input type="text" className="form-control" placeholder="Sello" value={newProduct.sello} onChange={(e) => setNewProduct({ ...newProduct, sello: e.target.value })} required />
                                </div>
                            </>
                        )}

                        {/* Polera Specific Fields */}
                        {productType === 'Polera' && (
                            <>
                                <div className="col-md-4">
                                    <label className="form-label">Titulo</label>
                                    <input type="text" className="form-control" placeholder="Titulo" value={newProduct.titulo} onChange={(e) => setNewProduct({ ...newProduct, titulo: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Genero</label>
                                    <select className="form-select" value={newProduct.genero} onChange={(e) => setNewProduct({ ...newProduct, genero: e.target.value })} required>
                                        <option value="">Select</option>
                                        <option value="Hombre">Hombre</option>
                                        <option value="Mujer">Mujer</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Talla</label>
                                    <input type="text" className="form-control" placeholder="Talla" value={newProduct.talla} onChange={(e) => setNewProduct({ ...newProduct, talla: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Tipo</label>
                                    <input type="text" className="form-control" placeholder="Tipo" value={newProduct.tipo} onChange={(e) => setNewProduct({ ...newProduct, tipo: e.target.value })} required />
                                </div>
                            </>
                        )}

                        <div className="col-12 d-flex gap-2">
                            <button type="submit" className={`btn ${isEditing ? 'btn-warning' : 'btn-success'} flex-grow-1`}>
                                {isEditing ? 'Update Product' : 'Add Product'}
                            </button>
                            {isEditing && (
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Type</th>
                            <th>Info</th>
                            <th>Price</th>
                            <th>Details</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className={product.active === false ? 'table-secondary' : ''}>
                                <td>
                                    {product.imageUrl && (
                                        <img src={product.imageUrl} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{product.tipo_producto}</td>
                                <td>
                                    {isDiscoType(product.tipo_producto) ? (
                                        <>
                                            <strong>{product.banda}</strong><br />
                                            {product.album}
                                        </>
                                    ) : (
                                        <strong>{product.titulo}</strong>
                                    )}
                                </td>
                                <td>${product.precio}</td>
                                <td>
                                    {isDiscoType(product.tipo_producto) ? (
                                        <small className="text-muted">
                                            {product.estilo} / {product.pais} / {product.sello}
                                        </small>
                                    ) : (
                                        <small className="text-muted">
                                            {product.genero} / {product.talla} / {product.tipo}
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <span className={`badge ${product.active !== false ? 'bg-success' : 'bg-secondary'}`}>
                                        {product.active !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => startEditing(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`btn btn-sm ${product.active !== false ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                            onClick={() => toggleActive(product)}
                                        >
                                            {product.active !== false ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
