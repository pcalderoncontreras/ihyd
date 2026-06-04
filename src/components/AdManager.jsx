import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase_config';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const MAX_ADS = 3;
const CONFIG_DOC_ID = '--ad-posters--';

import AdPreviewModal from './AdPreviewModal';

const AdManager = () => {
  const [previewAd, setPreviewAd] = React.useState(null);
    const [ads, setAds] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        imageUrl: '',
        linkUrl: '',
        expiresAt: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const docRef = doc(db, 'productos', CONFIG_DOC_ID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setAds(data.list || []);
            }
        } catch (err) {
            console.error('Error fetching ads:', err);
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const resetForm = () => {
        setFormData({ imageUrl: '', linkUrl: '', expiresAt: '' });
        setIsEditing(false);
        setEditingIndex(null);
    };

    const saveToFirestore = async (newList) => {
        const docRef = doc(db, 'productos', CONFIG_DOC_ID);
        await setDoc(docRef, {
            list: newList,
            updatedAt: Timestamp.now(),
            active: false, // Importante: para que no aparezca en el catálogo de productos
            tipo_producto: 'CONFIG'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.expiresAt) throw new Error('La fecha es obligatoria');

            const expiresDate = new Date(formData.expiresAt + 'T23:59:59');
            const newAd = {
                imageUrl: formData.imageUrl.trim(),
                linkUrl: formData.linkUrl.trim(),
                expiresAt: expiresDate.toISOString(), // Guardamos como string ISO para simplicidad en el array
                createdAt: new Date().toISOString()
            };

            let newList = [...ads];
            if (isEditing) {
                newList[editingIndex] = newAd;
                showMessage('Afiche actualizado.');
            } else {
                if (ads.length >= MAX_ADS) {
                    throw new Error('Máximo 3 afiches.');
                }
                newList.push(newAd);
                showMessage('Afiche creado.');
            }

            await saveToFirestore(newList);
            setAds(newList);
            resetForm();
        } catch (err) {
            console.error('Error:', err);
            showMessage(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (index) => {
        const ad = ads[index];
        setIsEditing(true);
        setEditingIndex(index);
        setFormData({
            imageUrl: ad.imageUrl,
            linkUrl: ad.linkUrl,
            expiresAt: ad.expiresAt.split('T')[0]
        });
        window.scrollTo(0, 0);
    };

    const deleteAd = async (index) => {
        if (!window.confirm('¿Eliminar afiche?')) return;
        try {
            const newList = ads.filter((_, i) => i !== index);
            await saveToFirestore(newList);
            setAds(newList);
            showMessage('Afiche eliminado.');
        } catch (err) {
            showMessage('Error al eliminar.', 'error');
        }
    };

    const moveAd = async (index, direction) => {
        const newList = [...ads];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

        try {
            await saveToFirestore(newList);
            setAds(newList);
        } catch (err) {
            showMessage('Error al reordenar.', 'error');
        }
    };

    const isExpired = (ad) => {
        return new Date(ad.expiresAt) < new Date();
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('es-CL');
    };

    return (
        <div className="ihyd-admin-ad-manager">
            {message.text && (
                <div className={`ihyd-alert ${message.type === 'error' ? 'ihyd-alert-warning' : 'ihyd-alert-success'}`}>
                    {message.text}
                </div>
            )}

            <div className="ihyd-sub-card">
                <div className="ihyd-sub-card-header">
                    {isEditing ? 'Editar Afiche' : 'Agregar Afiche'}
                    {!isEditing && <span style={{ float: 'right' }}>{ads.length} afiches de {MAX_ADS} disponibles</span>}
                </div>
                <div className="ihyd-sub-card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label">URL Imagen</label>
                            <input type="url" className="form-control" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">URL de Link (Opcional)</label>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://..."
                                value={formData.linkUrl}
                                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Caducidad</label>
                            <input type="date" className="form-control" value={formData.expiresAt} onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} required />
                        </div>
                        <div className="col-12 d-flex gap-2">
                            <button type="submit" className="ihyd-btn-primary flex-grow-1" disabled={loading || (!isEditing && ads.length >= MAX_ADS)}>
                                {loading ? 'Procesando...' : isEditing ? 'GUARDAR CAMBIOS' : 'AGREGAR AFICHE'}
                            </button>
                            {isEditing && <button type="button" className="ihyd-btn-ghost" onClick={resetForm}>CANCELAR</button>}
                        </div>
                    </form>
                </div>
            </div>

            <div className="ihyd-sub-card">
                <div className="ihyd-sub-card-header">Lista de Afiches</div>
                <div className="ihyd-sub-card-body">
                    {ads.length === 0 ? <p className="text-center text-muted py-3">No hay afiches.</p> : (
                        <div className="d-flex flex-column gap-2">
                            {ads.map((ad, i) => (
                                <div key={i} className="p-2 border d-flex align-items-center gap-3" style={{ opacity: isExpired(ad) ? 0.5 : 1, background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ width: '40px', height: '50px', background: '#222' }}>
                                                            <img src={ad.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => setPreviewAd(ad)} />
                                    </div>
                                    <div className="flex-grow-1" style={{ fontSize: '0.8rem', overflow: 'hidden' }}>
                                        <div className="text-truncate text-muted">{ad.linkUrl}</div>
                                        <div className={isExpired(ad) ? 'text-danger' : ''}>
                                            {isExpired(ad) ? 'EXPIRADO: ' : 'Vence: '} {formatDate(ad.expiresAt)}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-1">
                                        <button className="ihyd-action-btn" onClick={() => moveAd(i, -1)} disabled={i === 0}>↑</button>
                                        <button className="ihyd-action-btn" onClick={() => moveAd(i, 1)} disabled={i === ads.length - 1}>↓</button>
                                        <button className="ihyd-action-btn" onClick={() => startEditing(i)}>Editar</button>
                                        <button className="ihyd-action-btn danger" onClick={() => deleteAd(i)}>Borrar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {previewAd && (
                <AdPreviewModal ad={previewAd} onClose={() => setPreviewAd(null)} />
            )}
        </div>
    );
};

export default AdManager;
