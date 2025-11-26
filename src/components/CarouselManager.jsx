import React, { useState, useEffect } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const CarouselManager = () => {
    const [carouselImages, setCarouselImages] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newImage, setNewImage] = useState({
        imageUrl: '',
        title: '',
        description: '',
        order: 0,
        active: true
    });
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const carouselCollectionRef = collection(db, 'carousel');

    useEffect(() => {
        getCarouselImages();
    }, []);

    const getCarouselImages = async () => {
        try {
            const data = await getDocs(carouselCollectionRef);
            const images = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            // Ordenar por el campo 'order'
            images.sort((a, b) => (a.order || 0) - (b.order || 0));
            setCarouselImages(images);
        } catch (error) {
            console.error('Error fetching carousel images:', error);
        }
    };

    const createImage = async (e) => {
        e.preventDefault();
        try {
            await addDoc(carouselCollectionRef, {
                imageUrl: newImage.imageUrl,
                title: newImage.title || '',
                description: newImage.description || '',
                order: Number(newImage.order) || 0,
                active: true
            });
            resetForm();
            getCarouselImages();
        } catch (error) {
            console.error('Error creating carousel image:', error);
            alert('Error al crear imagen: ' + error.message);
        }
    };

    const updateImage = async (e) => {
        e.preventDefault();
        try {
            const imageDoc = doc(db, 'carousel', editingId);
            await updateDoc(imageDoc, {
                imageUrl: newImage.imageUrl,
                title: newImage.title || '',
                description: newImage.description || '',
                order: Number(newImage.order) || 0,
                active: newImage.active
            });
            resetForm();
            getCarouselImages();
        } catch (error) {
            console.error('Error updating carousel image:', error);
            alert('Error al actualizar imagen: ' + error.message);
        }
    };

    const deleteImage = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen del carrusel?')) {
            return;
        }
        try {
            const imageDoc = doc(db, 'carousel', id);
            await deleteDoc(imageDoc);
            getCarouselImages();
        } catch (error) {
            console.error('Error deleting carousel image:', error);
            alert('Error al eliminar imagen: ' + error.message);
        }
    };

    const toggleActive = async (image) => {
        try {
            const imageDoc = doc(db, 'carousel', image.id);
            await updateDoc(imageDoc, { active: !image.active });
            getCarouselImages();
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };

    const startEditing = (image) => {
        setIsEditing(true);
        setEditingId(image.id);
        setNewImage({
            imageUrl: image.imageUrl,
            title: image.title || '',
            description: image.description || '',
            order: image.order || 0,
            active: image.active !== undefined ? image.active : true
        });
        window.scrollTo(0, 0);
    };

    const resetForm = () => {
        setNewImage({
            imageUrl: '',
            title: '',
            description: '',
            order: 0,
            active: true
        });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="card mb-4">
            <div
                className="card-header bg-warning text-dark d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h5 className="mb-0">
                    🎠 Administrador de Carrusel {isExpanded ? '▼' : '▶'}
                </h5>
                <small className="text-dark-50">Haz clic para {isExpanded ? 'ocultar' : 'mostrar'}</small>
            </div>

            <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                <div className="card-body">
                    {/* Formulario para agregar/editar imagen */}
                    <div className="card mb-4">
                        <div className="card-header bg-secondary text-white">
                            <h6 className="mb-0">{isEditing ? 'Editar Imagen' : 'Agregar Nueva Imagen'}</h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={isEditing ? updateImage : createImage} className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">URL de la Imagen *</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        value={newImage.imageUrl}
                                        onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Título (opcional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Título"
                                        value={newImage.title}
                                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Orden</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="0"
                                        value={newImage.order}
                                        onChange={(e) => setNewImage({ ...newImage, order: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <label className="form-label">Activo</label>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={newImage.active}
                                            onChange={(e) => setNewImage({ ...newImage, active: e.target.checked })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Descripción (opcional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Descripción"
                                        value={newImage.description}
                                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                                    />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary me-2">
                                        {isEditing ? 'Actualizar Imagen' : 'Agregar Imagen'}
                                    </button>
                                    {isEditing && (
                                        <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Listado de imágenes */}
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h6 className="mb-0">Imágenes del Carrusel ({carouselImages.length})</h6>
                        </div>
                        <div className="card-body">
                            {carouselImages.length === 0 ? (
                                <p className="text-muted">No hay imágenes en el carrusel. Agrega la primera imagen arriba.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Miniatura</th>
                                                <th>Título</th>
                                                <th>Orden</th>
                                                <th>Estado</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carouselImages.map((image) => (
                                                <tr key={image.id} className={image.active === false ? 'table-secondary' : ''}>
                                                    <td>
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.title || 'Carousel'}
                                                            style={{
                                                                width: '80px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedImage(image.imageUrl);
                                                                setShowImageModal(true);
                                                            }}
                                                            title="Click para ver imagen grande"
                                                        />
                                                    </td>
                                                    <td>
                                                        <strong>{image.title || 'Sin título'}</strong>
                                                        {image.description && (
                                                            <><br /><small className="text-muted">{image.description}</small></>
                                                        )}
                                                    </td>
                                                    <td>{image.order || 0}</td>
                                                    <td>
                                                        <span className={`badge ${image.active !== false ? 'bg-success' : 'bg-secondary'}`}>
                                                            {image.active !== false ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => startEditing(image)}
                                                        >
                                                            <i className="bi bi-pencil"></i> Editar
                                                        </button>
                                                        <button
                                                            className={`btn btn-sm ${image.active !== false ? 'btn-outline-warning' : 'btn-outline-success'} me-2`}
                                                            onClick={() => toggleActive(image)}
                                                        >
                                                            <i className={`bi ${image.active !== false ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                            {image.active !== false ? ' Desactivar' : ' Activar'}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteImage(image.id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de previsualización de imagen */}
            {showImageModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content bg-dark">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-white">Vista Previa de Imagen del Carrusel</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowImageModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                <img
                                    src={selectedImage}
                                    alt="Carousel Preview"
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

export default CarouselManager;
