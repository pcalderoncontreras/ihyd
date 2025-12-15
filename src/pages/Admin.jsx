import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BulkImport from '../components/BulkImport';
import DatabaseCleaner from '../components/DatabaseCleaner';
import CarouselManager from '../components/CarouselManager';

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
        // Disco-like (CD, Tape, Vinilo)
        album: '',
        banda: '',
        estilo: '',
        pais: '',
        sello: '',
        tipo_producto: 'CD',
        mediaUrl: '',
        // Zine specific
        nombre_revista: '',
        numero: '',
        año: '',
        detalles: '',
        // Polera specific
        titulo: '',
        genero: '',
        talla: '',
        tipo: ''
    });

    // Filter, Pagination, and Sorting states
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('tipo_producto');
    const [sortDirection, setSortDirection] = useState('asc');
    const itemsPerPage = 30;

    // Image modal state
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

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

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter]);

    const getProducts = async () => {
        const data = await getDocs(productsCollectionRef);
        setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const createProduct = async (e) => {
        e.preventDefault();

        // Imagen por defecto si no se proporciona
        const DEFAULT_IMAGE = 'https://res.cloudinary.com/da8xc0cap/image/upload/v1763854150/Captura_de_pantalla_2025-11-22_a_la_s_8.28.38_p.m._foyv6e.png';

        const productData = {
            precio: Number(newProduct.precio),
            imageUrl: newProduct.imageUrl.trim() || DEFAULT_IMAGE,
            tipo_producto: productType,
            tipo_producto: productType,
            mediaUrl: newProduct.mediaUrl || '',
            active: true,
            createdAt: Timestamp.now()
        };

        if (productType === 'Polera') {
            Object.assign(productData, {
                titulo: newProduct.titulo || '',
                genero: newProduct.genero || '',
                talla: newProduct.talla || '',
                tipo: newProduct.tipo || '',
            });
        } else if (productType === 'Zine') {
            Object.assign(productData, {
                nombre_revista: newProduct.nombre_revista,
                numero: newProduct.numero,
                año: newProduct.año || '',
                pais: newProduct.pais || '',
                detalles: newProduct.detalles || '',
            });
        } else {
            // CD, Tape, Vinilo
            Object.assign(productData, {
                album: newProduct.album,
                banda: newProduct.banda,
                estilo: newProduct.estilo || '',
                pais: newProduct.pais || '',
                sello: newProduct.sello || '',
                detalles: newProduct.detalles || '',
            });
        }

        await addDoc(productsCollectionRef, productData);
        resetForm();
        getProducts();
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        const productDoc = doc(db, 'productos', editingId);

        // Imagen por defecto si no se proporciona
        const DEFAULT_IMAGE = 'https://res.cloudinary.com/da8xc0cap/image/upload/v1763854150/Captura_de_pantalla_2025-11-22_a_la_s_8.28.38_p.m._foyv6e.png';

        const productData = {
            precio: Number(newProduct.precio),
            imageUrl: newProduct.imageUrl.trim() || DEFAULT_IMAGE,
            mediaUrl: newProduct.mediaUrl || '',
            active: newProduct.active
        };

        if (productType === 'Polera') {
            Object.assign(productData, {
                titulo: newProduct.titulo || '',
                genero: newProduct.genero || '',
                talla: newProduct.talla || '',
                tipo: newProduct.tipo || '',
            });
        } else if (productType === 'Zine') {
            Object.assign(productData, {
                nombre_revista: newProduct.nombre_revista,
                numero: newProduct.numero,
                año: newProduct.año || '',
                pais: newProduct.pais || '',
                detalles: newProduct.detalles || '',
            });
        } else {
            // CD, Tape, Vinilo
            Object.assign(productData, {
                album: newProduct.album,
                banda: newProduct.banda,
                estilo: newProduct.estilo || '',
                pais: newProduct.pais || '',
                sello: newProduct.sello || '',
                detalles: newProduct.detalles || '',
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
            mediaUrl: '',
            nombre_revista: '',
            numero: '',
            año: '',
            detalles: '',
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
            mediaUrl: product.mediaUrl || '',
            nombre_revista: product.nombre_revista || '',
            numero: product.numero || '',
            año: product.año || '',
            detalles: product.detalles || '',
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

    const isDiscoType = (type) => ['CD', 'Tape', 'Vinilo'].includes(type);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return '⇅';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const filterAndSortProducts = (products) => {
        let filtered = products;

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(product => {
                // Helper function to safely convert to lowercase string
                const toLowerString = (value) => {
                    if (value === null || value === undefined) return '';
                    return String(value).toLowerCase();
                };

                // Disco fields (CD, Tape, Vinilo)
                const banda = toLowerString(product.banda);
                const album = toLowerString(product.album);
                const sello = toLowerString(product.sello);

                // Zine fields
                const nombre_revista = toLowerString(product.nombre_revista);
                const numero = toLowerString(product.numero);

                // Polera fields
                const titulo = toLowerString(product.titulo);

                // Common fields
                const estilo = toLowerString(product.estilo);
                const pais = toLowerString(product.pais);
                const detalles = toLowerString(product.detalles);
                const precio = toLowerString(product.precio);

                return banda.includes(term) ||
                    album.includes(term) ||
                    sello.includes(term) ||
                    nombre_revista.includes(term) ||
                    numero.includes(term) ||
                    titulo.includes(term) ||
                    estilo.includes(term) ||
                    pais.includes(term) ||
                    detalles.includes(term) ||
                    precio.includes(term);
            });
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(product => product.tipo_producto === typeFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortField) {
                case 'tipo_producto':
                    aValue = a.tipo_producto || '';
                    bValue = b.tipo_producto || '';
                    break;
                case 'info':
                    aValue = isDiscoType(a.tipo_producto) ? a.banda : a.titulo;
                    bValue = isDiscoType(b.tipo_producto) ? b.banda : b.titulo;
                    break;
                case 'precio':
                    aValue = a.precio || 0;
                    bValue = b.precio || 0;
                    break;
                case 'active':
                    aValue = a.active !== false ? 1 : 0;
                    bValue = b.active !== false ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    const processedProducts = filterAndSortProducts(products);
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = processedProducts.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="container mt-5">

            <h2 className="text-center mb-4" style={{ color: 'white' }}>Admin Panel</h2>

            <BulkImport />

            <DatabaseCleaner />

            <CarouselManager />

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
                        {/* Disco-like Specific Fields */}
                        {isDiscoType(productType) && (
                            <>
                                <div className="col-md-3">
                                    <label className="form-label">Banda</label>
                                    <input type="text" className="form-control" placeholder="Banda" value={newProduct.banda} onChange={(e) => setNewProduct({ ...newProduct, banda: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Album</label>
                                    <input type="text" className="form-control" placeholder="Album" value={newProduct.album} onChange={(e) => setNewProduct({ ...newProduct, album: e.target.value })} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Sello</label>
                                    <input type="text" className="form-control" placeholder="Sello" value={newProduct.sello} onChange={(e) => setNewProduct({ ...newProduct, sello: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Pais</label>
                                    <input type="text" className="form-control" placeholder="Pais" value={newProduct.pais} onChange={(e) => setNewProduct({ ...newProduct, pais: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Estilo</label>
                                    <input type="text" className="form-control" placeholder="Estilo" value={newProduct.estilo} onChange={(e) => setNewProduct({ ...newProduct, estilo: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Detalles</label>
                                    <input type="text" className="form-control" placeholder="Detalles" value={newProduct.detalles} onChange={(e) => setNewProduct({ ...newProduct, detalles: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Precio</label>
                                    <input type="number" className="form-control" placeholder="Precio" value={newProduct.precio} onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Image URL (opcional)</label>
                                    <input type="url" className="form-control" placeholder="Image URL (opcional - se usará imagen por defecto)" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">URL de Música/Video (YouTube, SoundCloud, Bandcamp) - Opcional</label>
                                    <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
                                </div>
                            </>
                        )}

                        {/* Zine Specific Fields */}
                        {productType === 'Zine' && (
                            <>
                                <div className="col-md-3">
                                    <label className="form-label">Nombre Revista</label>
                                    <input type="text" className="form-control" placeholder="Nombre Revista" value={newProduct.nombre_revista} onChange={(e) => setNewProduct({ ...newProduct, nombre_revista: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Numero (#)</label>
                                    <input type="text" className="form-control" placeholder="#" value={newProduct.numero} onChange={(e) => setNewProduct({ ...newProduct, numero: e.target.value })} required />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Año</label>
                                    <input type="text" className="form-control" placeholder="Año" value={newProduct.año} onChange={(e) => setNewProduct({ ...newProduct, año: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Pais</label>
                                    <input type="text" className="form-control" placeholder="Pais" value={newProduct.pais} onChange={(e) => setNewProduct({ ...newProduct, pais: e.target.value })} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Detalles</label>
                                    <input type="text" className="form-control" placeholder="Detalles" value={newProduct.detalles} onChange={(e) => setNewProduct({ ...newProduct, detalles: e.target.value })} />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Precio</label>
                                    <input type="number" className="form-control" placeholder="Precio" value={newProduct.precio} onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Image URL (opcional)</label>
                                    <input type="url" className="form-control" placeholder="Image URL (opcional - se usará imagen por defecto)" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">URL de Música/Video (YouTube, SoundCloud, Bandcamp) - Opcional</label>
                                    <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
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
                                        <option value="">Seleccionar...</option>
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
                                <div className="col-md-2">
                                    <label className="form-label">Precio</label>
                                    <input type="number" className="form-control" placeholder="Precio" value={newProduct.precio} onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Image URL</label>
                                    <input type="url" className="form-control" placeholder="Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} required />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">URL de Música/Video (YouTube, SoundCloud, Bandcamp) - Opcional</label>
                                    <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
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

            {/* Filter and Product Count */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row align-items-center mb-3">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Filtrar por Tipo de Producto:</label>
                            <select
                                className="form-select"
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value);
                                }}
                            >
                                <option value="all">Todos los Productos</option>
                                <option value="CD">CD</option>
                                <option value="Tape">Tape</option>
                                <option value="Vinilo">Vinilo</option>
                                <option value="Zine">Zine</option>
                                <option value="Polera">Polera</option>
                            </select>
                        </div>
                        <div className="col-md-8">
                            <label className="form-label fw-bold">Buscar Producto:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por banda, álbum, título, estilo, país o sello..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-end">
                            <p className="mb-0">
                                <strong>Mostrando:</strong> {paginatedProducts.length} de {processedProducts.length} productos
                                {typeFilter !== 'all' && ` (${typeFilter})`}
                                {searchTerm && ` - Búsqueda: "${searchTerm}"`}
                            </p>
                            <small className="text-muted">Total en base de datos: {products.length}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('tipo_producto')}
                            >
                                Type {getSortIcon('tipo_producto')}
                            </th>
                            <th
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('info')}
                            >
                                Info {getSortIcon('info')}
                            </th>
                            <th
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('precio')}
                            >
                                Price {getSortIcon('precio')}
                            </th>
                            <th>Details</th>
                            <th
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('active')}
                            >
                                Status {getSortIcon('active')}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((product) => (
                            <tr key={product.id} className={product.active === false ? 'table-secondary' : ''}>
                                <td>
                                    {product.imageUrl && (
                                        <img
                                            src={product.imageUrl}
                                            alt="Product"
                                            style={{
                                                width: '50px',
                                                aspectRatio: '1/1',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                setSelectedImage(product.imageUrl);
                                                setShowImageModal(true);
                                            }}
                                            title="Click para ver imagen grande"
                                        />
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <small className="text-muted">
                            Página {currentPage} de {totalPages}
                        </small>
                    </div>
                    <nav>
                        <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                            </li>

                            {/* First page */}
                            {currentPage > 3 && (
                                <>
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                                    </li>
                                    {currentPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                </>
                            )}

                            {/* Pages around current */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                                .map(page => (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page)}>
                                            {page}
                                        </button>
                                    </li>
                                ))
                            }

                            {/* Last page */}
                            {currentPage < totalPages - 2 && (
                                <>
                                    {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                                    <li className="page-item">
                                        <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                                    </li>
                                </>
                            )}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        <small className="text-muted">
                            <span style={{ color: 'white' }}>Ir a página:</span>
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                className="form-control form-control-sm d-inline-block ms-2"
                                style={{ width: '70px' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= totalPages) {
                                            handlePageChange(page);
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                        </small>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content bg-dark">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-white">Vista Previa de Imagen</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowImageModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img
                                    src={selectedImage}
                                    alt="Product Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain',
                                        borderRadius: '8px'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="modal-footer border-secondary">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowImageModal(false)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
