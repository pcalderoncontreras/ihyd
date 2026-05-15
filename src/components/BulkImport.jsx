import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase_config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const BulkImport = () => {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [results, setResults] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResults(null);
    };

    const handleImport = async () => {
        if (!file) {
            alert('Por favor selecciona un archivo Excel');
            return;
        }

        setImporting(true);
        setResults(null);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const productsCollectionRef = collection(db, 'productos');
            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (const row of jsonData) {
                try {
                    const productData = {
                        precio: Number(row.precio || row.Precio || 0),
                        imageUrl: row.imageUrl || row.imagen || row.Imagen || '',
                        tipo_producto: row.tipo_producto || row.tipo || row.Tipo || 'CD',
                        active: row.active !== undefined ? Boolean(row.active) : true,
                    };

                    if (['CD', 'Tape', 'Vinilo', 'Zine'].includes(productData.tipo_producto)) {
                        productData.album = row.album || row.Album || '';
                        productData.banda = row.banda || row.Banda || '';
                        productData.estilo = row.estilo || row.Estilo || '';
                        productData.pais = row.pais || row.Pais || row.País || '';
                        productData.sello = row.sello || row.Sello || '';
                    }

                    if (productData.tipo_producto === 'Polera') {
                        productData.titulo = row.titulo || row.Titulo || row.Título || '';
                        productData.genero = row.genero || row.Genero || row.Género || '';
                        productData.talla = row.talla || row.Talla || '';
                        productData.tipo = row.tipo_polera || row.TipoPolera || '';
                    }

                    await addDoc(productsCollectionRef, productData);
                    successCount++;
                } catch (error) {
                    errorCount++;
                    errors.push({ row: row, error: error.message });
                    console.error('Error importing row:', row, error);
                }
            }

            setResults({
                total: jsonData.length,
                success: successCount,
                errors: errorCount,
                errorDetails: errors
            });

        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error al leer el archivo: ' + error.message);
        } finally {
            setImporting(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            { tipo_producto: 'CD', banda: 'Iron Maiden', album: 'The Number of the Beast', estilo: 'Heavy Metal', pais: 'UK', sello: 'EMI', precio: 8000, imageUrl: 'https://ejemplo.com/iron-maiden-cd.jpg', active: true },
            { tipo_producto: 'Tape', banda: 'Metallica', album: 'Master of Puppets', estilo: 'Thrash Metal', pais: 'USA', sello: 'Elektra', precio: 6000, imageUrl: 'https://ejemplo.com/metallica-tape.jpg', active: true },
            { tipo_producto: 'Vinilo', banda: 'Black Sabbath', album: 'Paranoid', estilo: 'Heavy Metal', pais: 'UK', sello: 'Vertigo', precio: 25000, imageUrl: 'https://ejemplo.com/sabbath-vinilo.jpg', active: true },
            { tipo_producto: 'Zine', banda: 'Varios Artistas', album: 'Fanzine Metal Underground #1', estilo: 'Metal', pais: 'Chile', sello: 'Independiente', precio: 3000, imageUrl: 'https://ejemplo.com/zine.jpg', active: true },
            { tipo_producto: 'Polera', titulo: 'Polera Logo Banda', genero: 'Unisex', talla: 'M', tipo_polera: 'Manga Corta', precio: 15000, imageUrl: 'https://ejemplo.com/polera.jpg', active: true }
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Productos');
        XLSX.writeFile(wb, 'plantilla_productos.xlsx');
    };

    const exportProducts = async () => {
        setExporting(true);
        try {
            const productsCollectionRef = collection(db, 'productos');
            const data = await getDocs(productsCollectionRef);
            const products = data.docs.map((doc) => {
                const product = doc.data();
                const exportData = {
                    tipo_producto: product.tipo_producto || '',
                    precio: product.precio || 0,
                    imageUrl: product.imageUrl || '',
                    active: product.active !== undefined ? product.active : true,
                };

                if (['CD', 'Tape', 'Vinilo', 'Zine'].includes(product.tipo_producto)) {
                    exportData.banda = product.banda || '';
                    exportData.album = product.album || '';
                    exportData.estilo = product.estilo || '';
                    exportData.pais = product.pais || '';
                    exportData.sello = product.sello || '';
                } else if (product.tipo_producto === 'Polera') {
                    exportData.titulo = product.titulo || '';
                    exportData.genero = product.genero || '';
                    exportData.talla = product.talla || '';
                    exportData.tipo_polera = product.tipo || '';
                }

                return exportData;
            });

            if (products.length === 0) {
                alert('No hay productos para exportar');
                return;
            }

            const ws = XLSX.utils.json_to_sheet(products);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Productos');

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `productos_${fecha}.xlsx`);

            alert(`Se exportaron ${products.length} productos exitosamente`);
        } catch (error) {
            console.error('Error exporting products:', error);
            alert('Error al exportar productos: ' + error.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="ihyd-admin-card mb-4">
            <div
                className="ihyd-admin-card-header"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>Importación / Exportación Masiva</span>
                <span className="ihyd-expand-hint">{isExpanded ? '▼' : '▶'}</span>
            </div>

            <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                <div style={{ paddingTop: '20px' }}>
                    <div className="mb-3 d-flex gap-2 flex-wrap">
                        <button className="ihyd-btn-ghost" onClick={downloadTemplate}>
                            Descargar Plantilla Excel
                        </button>
                        <button className="ihyd-btn-ghost" onClick={exportProducts} disabled={exporting}>
                            {exporting ? 'Exportando...' : 'Exportar Todos los Productos'}
                        </button>
                    </div>
                    <small className="d-block mb-3">
                        Descarga la plantilla para ver el formato correcto o exporta todos los productos actuales
                    </small>

                    <div className="mb-3">
                        <label className="form-label">Seleccionar archivo Excel</label>
                        <input
                            type="file"
                            className="form-control"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            disabled={importing}
                        />
                    </div>

                    <button
                        className="ihyd-btn-primary"
                        onClick={handleImport}
                        disabled={!file || importing}
                    >
                        {importing ? 'Importando...' : 'Importar Productos'}
                    </button>

                    {results && (
                        <div className="mt-4">
                            <div className={`ihyd-alert ${results.errors === 0 ? 'ihyd-alert-success' : 'ihyd-alert-warning'}`}>
                                <strong>Resultado de la Importación</strong>
                                <p className="mb-1 mt-2">Total de filas: {results.total}</p>
                                <p className="mb-1">Importados exitosamente: {results.success}</p>
                                <p className="mb-0">Errores: {results.errors}</p>
                            </div>

                            {results.errorDetails.length > 0 && (
                                <div className="mt-3">
                                    <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>Detalles de errores:</p>
                                    <ul className="small">
                                        {results.errorDetails.slice(0, 10).map((err, idx) => (
                                            <li key={idx}>Fila {idx + 1}: {err.error}</li>
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
                        <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: '8px' }}>Instrucciones:</p>
                        <ol className="small">
                            <li>Descarga la plantilla Excel usando el botón de arriba</li>
                            <li>Llena el archivo con tus productos siguiendo el formato de ejemplo</li>
                            <li>Guarda el archivo Excel</li>
                            <li>Selecciona el archivo usando el botón "Seleccionar archivo"</li>
                            <li>Haz clic en "Importar Productos"</li>
                        </ol>
                        <div className="ihyd-alert ihyd-alert-info mt-2">
                            <strong>Columnas requeridas para Discos (CD/Tape/Vinilo/Zine):</strong>
                            <br />tipo_producto, banda, album, estilo, pais, sello, precio, imageUrl
                            <br /><br />
                            <strong>Columnas requeridas para Poleras:</strong>
                            <br />tipo_producto, titulo, genero, talla, tipo_polera, precio, imageUrl
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkImport;
