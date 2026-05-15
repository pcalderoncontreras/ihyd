import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, writeBatch } from 'firebase/firestore';
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

    // Bulk Actions State
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Image modal state
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [activeTab, setActiveTab] = useState('productos');

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
        setSelectedProducts([]); // Clear selection on filter change
    }, [searchTerm, typeFilter]);

    // Clear selection on page change
    useEffect(() => {
        setSelectedProducts([]);
    }, [currentPage]);

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
            tipo_producto: productType,
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

    // Bulk Actions Handlers
    const handleSelectProduct = (id) => {
        setSelectedProducts(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === paginatedProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(paginatedProducts.map(p => p.id));
        }
    };

    const bulkActivate = async () => {
        if (!window.confirm(`¿Activar ${selectedProducts.length} productos seleccionados?`)) return;
        const batch = writeBatch(db);
        selectedProducts.forEach(id => {
            const ref = doc(db, 'productos', id);
            batch.update(ref, { active: true });
        });
        await batch.commit();
        setSelectedProducts([]);
        getProducts();
    };

    const bulkDeactivate = async () => {
        if (!window.confirm(`¿Desactivar ${selectedProducts.length} productos seleccionados?`)) return;
        const batch = writeBatch(db);
        selectedProducts.forEach(id => {
            const ref = doc(db, 'productos', id);
            batch.update(ref, { active: false });
        });
        await batch.commit();
        setSelectedProducts([]);
        getProducts();
    };

    const bulkDelete = async () => {
        if (!window.confirm(`¿ELIMINAR PERMANENTEMENTE ${selectedProducts.length} productos seleccionados?`)) return;
        const batch = writeBatch(db);
        selectedProducts.forEach(id => {
            const ref = doc(db, 'productos', id);
            batch.delete(ref);
        });
        await batch.commit();
        setSelectedProducts([]);
        getProducts();
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
        <div className="ihyd-admin">
            <h2 className="ihyd-admin-title">Admin Panel</h2>

            {/* Tabs de navegación */}
            <div className="ihyd-tabs">
                <button
                    className={`ihyd-tab ${activeTab === 'productos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('productos')}
                >
                    Productos
                </button>
                <button
                    className={`ihyd-tab ${activeTab === 'importar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('importar')}
                >
                    Importar
                </button>
                <button
                    className={`ihyd-tab ${activeTab === 'database' ? 'active' : ''}`}
                    onClick={() => setActiveTab('database')}
                >
                    Base de Datos
                </button>
                <button
                    className={`ihyd-tab ${activeTab === 'carrusel' ? 'active' : ''}`}
                    onClick={() => setActiveTab('carrusel')}
                >
                    Carrusel
                </button>
            </div>

            {/* Tab: Importar */}
            {activeTab === 'importar' && (
                <div className="ihyd-admin-card">
                    <div className="ihyd-admin-card-header">Importación Masiva</div>
                    <BulkImport />
                </div>
            )}

            {/* Tab: Base de Datos */}
            {activeTab === 'database' && (
                <div className="ihyd-admin-card">
                    <div className="ihyd-admin-card-header">Limpieza de Base de Datos</div>
                    <DatabaseCleaner />
                </div>
            )}

            {/* Tab: Carrusel */}
            {activeTab === 'carrusel' && (
                <div className="ihyd-admin-card">
                    <div className="ihyd-admin-card-header">Gestión de Carrusel</div>
                    <CarouselManager />
                </div>
            )}

            {/* Tab: Productos */}
            {activeTab === 'productos' && (
                <>
                    {/* Formulario agregar/editar */}
                    <div className="ihyd-admin-card mb-4">
                        <div className="ihyd-admin-card-header">
                            <span>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</span>
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

                        <form onSubmit={isEditing ? updateProduct : createProduct} className="row g-3">
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
                                        <input type="url" className="form-control" placeholder="Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">URL de Música/Video (YouTube, SoundCloud, Bandcamp) — Opcional</label>
                                        <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
                                    </div>
                                </>
                            )}

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
                                        <input type="url" className="form-control" placeholder="Image URL" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label">URL de Música/Video — Opcional</label>
                                        <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
                                    </div>
                                </>
                            )}

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
                                        <label className="form-label">URL de Música/Video — Opcional</label>
                                        <input type="url" className="form-control" placeholder="https://..." value={newProduct.mediaUrl} onChange={(e) => setNewProduct({ ...newProduct, mediaUrl: e.target.value })} />
                                    </div>
                                </>
                            )}

                            <div className="col-12 d-flex gap-2">
                                <button type="submit" className="ihyd-btn-primary flex-grow-1 justify-content-center">
                                    {isEditing ? 'ACTUALIZAR PRODUCTO' : 'AGREGAR PRODUCTO'}
                                </button>
                                {isEditing && (
                                    <button type="button" className="ihyd-btn-ghost" onClick={resetForm}>
                                        CANCELAR
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Filtros */}
                    <div className="ihyd-admin-card mb-3">
                        <div className="row align-items-end g-3">
                            <div className="col-md-4">
                                <label className="form-label">Filtrar por Tipo</label>
                                <select
                                    className="form-select"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
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
                                <label className="form-label">Buscar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Banda, álbum, título, estilo, país, sello..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-2 text-end">
                            <small style={{ color: '#666', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Mostrando {paginatedProducts.length} de {processedProducts.length}
                                {typeFilter !== 'all' && ` · ${typeFilter}`}
                                {searchTerm && ` · "${searchTerm}"`}
                                {' · '} Total DB: {products.length}
                            </small>
                        </div>
                    </div>

                    {/* Bulk toolbar */}
                    {selectedProducts.length > 0 && (
                        <div className="ihyd-bulk-toolbar">
                            <div className="d-flex align-items-center gap-3">
                                <span className="ihyd-bulk-toolbar-count">{selectedProducts.length} seleccionados</span>
                                <button className="ihyd-action-btn" onClick={() => setSelectedProducts([])}>Cancelar</button>
                            </div>
                            <div className="ihyd-bulk-toolbar-actions">
                                <button className="ihyd-btn-ghost" style={{ fontSize: '0.72rem', padding: '6px 14px' }} onClick={bulkActivate}>Activar</button>
                                <button className="ihyd-btn-ghost" style={{ fontSize: '0.72rem', padding: '6px 14px' }} onClick={bulkDeactivate}>Desactivar</button>
                                <button className="ihyd-btn-ghost" style={{ fontSize: '0.72rem', padding: '6px 14px', borderColor: '#ff4444', color: '#ff4444' }} onClick={bulkDelete}>Eliminar</button>
                            </div>
                        </div>
                    )}

                    {/* Tabla */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={paginatedProducts.length > 0 && selectedProducts.length === paginatedProducts.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Img</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('tipo_producto')}>
                                        Tipo {getSortIcon('tipo_producto')}
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('info')}>
                                        Info {getSortIcon('info')}
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('precio')}>
                                        Precio {getSortIcon('precio')}
                                    </th>
                                    <th>Detalles</th>
                                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('active')}>
                                        Estado {getSortIcon('active')}
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleSelectProduct(product.id)}
                                            />
                                        </td>
                                        <td>
                                            {product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt="Product"
                                                    style={{ width: '44px', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => { setSelectedImage(product.imageUrl); setShowImageModal(true); }}
                                                />
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {product.tipo_producto}
                                        </td>
                                        <td>
                                            {isDiscoType(product.tipo_producto) ? (
                                                <>
                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.banda}</span>
                                                    <br />
                                                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{product.album}</span>
                                                </>
                                            ) : (
                                                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.titulo || product.nombre_revista}</span>
                                            )}
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            ${product.precio}
                                        </td>
                                        <td>
                                            <small style={{ color: '#666', fontSize: '0.75rem' }}>
                                                {isDiscoType(product.tipo_producto)
                                                    ? [product.estilo, product.pais, product.sello].filter(Boolean).join(' / ')
                                                    : [product.genero, product.talla, product.tipo].filter(Boolean).join(' / ')
                                                }
                                            </small>
                                        </td>
                                        <td>
                                            <span className={product.active !== false ? 'ihyd-badge-active' : 'ihyd-badge-inactive'}>
                                                {product.active !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="ihyd-action-btn" onClick={() => startEditing(product)}>Edit</button>
                                            <button
                                                className="ihyd-action-btn"
                                                onClick={() => toggleActive(product)}
                                            >
                                                {product.active !== false ? 'Off' : 'On'}
                                            </button>
                                            <button className="ihyd-action-btn danger" onClick={() => deleteProduct(product.id)}>Del</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <small style={{ color: '#666', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Página {currentPage} de {totalPages}
                            </small>
                            <nav>
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                            ←
                                        </button>
                                    </li>
                                    {currentPage > 3 && (
                                        <>
                                            <li className="page-item"><button className="page-link" onClick={() => handlePageChange(1)}>1</button></li>
                                            {currentPage > 4 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                                        </>
                                    )}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                                        .map(page => (
                                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                                            </li>
                                        ))
                                    }
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">…</span></li>}
                                            <li className="page-item"><button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></li>
                                        </>
                                    )}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                            →
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            <small style={{ color: '#666' }}>
                                Ir a:
                                <input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    className="form-control form-control-sm d-inline-block ms-2"
                                    style={{ width: '64px' }}
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
                    )}
                </>
            )}

            {/* Modal imagen */}
            {showImageModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content" style={{ background: '#111', border: '1px solid #222', borderRadius: 0 }}>
                            <div className="modal-header" style={{ borderColor: '#222' }}>
                                <h5 className="modal-title" style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vista Previa</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowImageModal(false)}></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img
                                    src={selectedImage}
                                    alt="Product Preview"
                                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
