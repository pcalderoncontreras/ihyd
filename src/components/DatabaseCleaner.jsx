import React, { useState } from 'react';
import { db } from '../firebase_config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const DatabaseCleaner = () => {
    const [deleting, setDeleting] = useState(false);
    const [results, setResults] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        if (!isExpanded) {
            const confirmed = window.confirm(
                'ADVERTENCIA: Estás a punto de acceder a la zona de eliminación de datos.\n\n' +
                'Esta sección contiene herramientas que pueden BORRAR DATOS IMPORTANTES de forma IRREVERSIBLE.\n\n' +
                '¿Estás seguro de que deseas continuar?'
            );
            if (!confirmed) {
                return;
            }
        }
        setIsExpanded(!isExpanded);
    };

    const deleteVinilos = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar TODOS los vinilos? Esta acción no se puede deshacer.')) {
            return;
        }

        setDeleting(true);
        setResults(null);

        try {
            const productsCollectionRef = collection(db, 'productos');
            const allDocs = await getDocs(productsCollectionRef);
            const vinilosDocs = allDocs.docs.filter(doc => {
                const tipo = doc.data().tipo_producto;
                return tipo && tipo.toLowerCase() === 'vinilo';
            });

            let deletedCount = 0;
            const errors = [];

            for (const docSnapshot of vinilosDocs) {
                try {
                    await deleteDoc(doc(db, 'productos', docSnapshot.id));
                    deletedCount++;
                } catch (error) {
                    errors.push({ id: docSnapshot.id, error: error.message });
                    console.error('Error deleting document:', docSnapshot.id, error);
                }
            }

            setResults({ total: vinilosDocs.length, deleted: deletedCount, errors: errors.length, errorDetails: errors });

        } catch (error) {
            console.error('Error fetching vinilos:', error);
            alert('Error al obtener vinilos: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const deleteAllProducts = async () => {
        if (!window.confirm('PELIGRO: ¿Estás seguro de que quieres eliminar TODOS los productos de la base de datos? Esta acción no se puede deshacer.')) {
            return;
        }
        if (!window.confirm('ÚLTIMA ADVERTENCIA: Esto eliminará TODOS los productos (CDs, Tapes, Vinilos, Zines, Poleras). ¿Continuar?')) {
            return;
        }

        setDeleting(true);
        setResults(null);

        try {
            const productsCollectionRef = collection(db, 'productos');
            const querySnapshot = await getDocs(productsCollectionRef);

            let deletedCount = 0;
            const errors = [];

            for (const docSnapshot of querySnapshot.docs) {
                try {
                    await deleteDoc(doc(db, 'productos', docSnapshot.id));
                    deletedCount++;
                } catch (error) {
                    errors.push({ id: docSnapshot.id, error: error.message });
                    console.error('Error deleting document:', docSnapshot.id, error);
                }
            }

            setResults({ total: querySnapshot.size, deleted: deletedCount, errors: errors.length, errorDetails: errors });

        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error al obtener productos: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const deleteByType = async (tipo) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar TODOS los productos de tipo "${tipo}"? Esta acción no se puede deshacer.`)) {
            return;
        }

        setDeleting(true);
        setResults(null);

        try {
            const productsCollectionRef = collection(db, 'productos');
            const allDocs = await getDocs(productsCollectionRef);
            const filteredDocs = allDocs.docs.filter(doc => {
                const tipo_prod = doc.data().tipo_producto;
                return tipo_prod && tipo_prod.toLowerCase() === tipo.toLowerCase();
            });

            let deletedCount = 0;
            const errors = [];

            for (const docSnapshot of filteredDocs) {
                try {
                    await deleteDoc(doc(db, 'productos', docSnapshot.id));
                    deletedCount++;
                } catch (error) {
                    errors.push({ id: docSnapshot.id, error: error.message });
                    console.error('Error deleting document:', docSnapshot.id, error);
                }
            }

            setResults({ total: filteredDocs.length, deleted: deletedCount, errors: errors.length, errorDetails: errors });

        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Error al obtener productos: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="ihyd-admin-card mb-4">
            <div
                className="ihyd-admin-card-header"
                style={{ cursor: 'pointer' }}
                onClick={handleToggle}
            >
                <span>Limpieza de Base de Datos</span>
                <span className="ihyd-expand-hint">{isExpanded ? '▼' : '▶'}</span>
            </div>

            <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                <div style={{ paddingTop: '20px' }}>
                    <div className="ihyd-alert ihyd-alert-warning mb-4">
                        <strong>ADVERTENCIA:</strong> Estas acciones son irreversibles. Asegúrate de exportar los productos antes de eliminar.
                    </div>

                    <div className="mb-4">
                        <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '12px' }}>
                            Eliminar por tipo de producto:
                        </p>
                        <div className="d-flex gap-2 flex-wrap">
                            {['CD', 'Tape', 'Zine', 'Polera'].map(tipo => (
                                <button key={tipo} className="ihyd-btn-danger" onClick={() => deleteByType(tipo)} disabled={deleting}>
                                    Eliminar {tipo}s
                                </button>
                            ))}
                            <button className="ihyd-btn-danger" onClick={deleteVinilos} disabled={deleting}>
                                {deleting ? 'Eliminando...' : 'Eliminar Vinilos'}
                            </button>
                        </div>
                    </div>

                    <hr />

                    <div className="mb-4">
                        <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#cc3333', marginBottom: '12px' }}>
                            Zona de peligro:
                        </p>
                        <button className="ihyd-btn-danger" onClick={deleteAllProducts} disabled={deleting}>
                            {deleting ? 'Eliminando...' : 'Eliminar TODOS los Productos'}
                        </button>
                        <small className="d-block mt-2">Esto eliminará TODOS los productos de la base de datos</small>
                    </div>

                    {results && (
                        <div className="mt-4">
                            <div className={`ihyd-alert ${results.errors === 0 ? 'ihyd-alert-success' : 'ihyd-alert-warning'}`}>
                                <strong>Resultado de la Eliminación</strong>
                                <p className="mb-1 mt-2">Total encontrados: {results.total}</p>
                                <p className="mb-1">Eliminados exitosamente: {results.deleted}</p>
                                <p className="mb-0">Errores: {results.errors}</p>
                            </div>

                            {results.errorDetails.length > 0 && (
                                <div className="mt-3">
                                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>Detalles de errores:</p>
                                    <ul className="small">
                                        {results.errorDetails.slice(0, 10).map((err, idx) => (
                                            <li key={idx}>ID: {err.id} — {err.error}</li>
                                        ))}
                                        {results.errorDetails.length > 10 && (
                                            <li>... y {results.errorDetails.length - 10} errores más</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-4">
                        <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '8px' }}>Recomendaciones:</p>
                        <ol className="small">
                            <li>Exporta todos los productos antes de eliminar (usa la sección de Importar)</li>
                            <li>Verifica que realmente quieres eliminar los productos</li>
                            <li>Después de eliminar, puedes volver a importar el Excel corregido</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseCleaner;
