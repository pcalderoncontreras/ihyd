import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../firebase_config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const BulkImport = () => {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [results, setResults] = useState(null);

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
                    // Mapear las columnas del Excel a los campos de Firebase
                    const productData = {
                        precio: Number(row.precio || row.Precio || 0),
                        imageUrl: row.imageUrl || row.imagen || row.Imagen || '',
                        tipo_producto: row.tipo_producto || row.tipo || row.Tipo || 'CD',
                        active: row.active !== undefined ? Boolean(row.active) : true,
                    };

                    // Campos para discos (CD, Tape, Vinilo, Zine)
                    if (['CD', 'Tape', 'Vinilo', 'Zine'].includes(productData.tipo_producto)) {
                        productData.album = row.album || row.Album || '';
                        productData.banda = row.banda || row.Banda || '';
                        productData.estilo = row.estilo || row.Estilo || '';
                        productData.pais = row.pais || row.Pais || row.País || '';
                        productData.sello = row.sello || row.Sello || '';
                    }

                    // Campos para poleras
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
        // Crear una plantilla de Excel con las columnas necesarias
        const template = [
            {
                tipo_producto: 'CD',
                banda: 'Nombre de la Banda',
                album: 'Nombre del Álbum',
                estilo: 'Género Musical',
                pais: 'País',
                sello: 'Sello Discográfico',
                precio: 5000,
                imageUrl: 'https://ejemplo.com/imagen.jpg',
                active: true
            },
            {
                tipo_producto: 'Polera',
                titulo: 'Nombre de la Polera',
                genero: 'Unisex',
                talla: 'M',
                tipo_polera: 'Manga Corta',
                precio: 15000,
                imageUrl: 'https://ejemplo.com/polera.jpg',
                active: true
            }
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

                // Crear objeto base
                const exportData = {
                    tipo_producto: product.tipo_producto || '',
                    precio: product.precio || 0,
                    imageUrl: product.imageUrl || '',
                    active: product.active !== undefined ? product.active : true,
                };

                // Agregar campos específicos según el tipo
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

            // Crear archivo Excel
            const ws = XLSX.utils.json_to_sheet(products);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Productos');

            // Descargar archivo con fecha actual
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
        <div className="card mb-4">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0">Importación Masiva desde Excel</h5>
            </div>
            <div className="card-body">
                <div className="mb-3 d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={downloadTemplate}
                    >
                        📥 Descargar Plantilla Excel
                    </button>
                    <button
                        className="btn btn-outline-success"
                        onClick={exportProducts}
                        disabled={exporting}
                    >
                        {exporting ? 'Exportando...' : '📊 Exportar Todos los Productos'}
                    </button>
                </div>
                <small className="d-block mb-3 text-muted">
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
                    className="btn btn-success"
                    onClick={handleImport}
                    disabled={!file || importing}
                >
                    {importing ? 'Importando...' : '📤 Importar Productos'}
                </button>

                {results && (
                    <div className="mt-4">
                        <div className={`alert ${results.errors === 0 ? 'alert-success' : 'alert-warning'}`}>
                            <h6 className="alert-heading">Resultado de la Importación</h6>
                            <p className="mb-1">Total de filas: {results.total}</p>
                            <p className="mb-1">✅ Importados exitosamente: {results.success}</p>
                            <p className="mb-0">❌ Errores: {results.errors}</p>
                        </div>

                        {results.errorDetails.length > 0 && (
                            <div className="mt-3">
                                <h6>Detalles de errores:</h6>
                                <ul className="small">
                                    {results.errorDetails.slice(0, 10).map((err, idx) => (
                                        <li key={idx}>
                                            Fila {idx + 1}: {err.error}
                                        </li>
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
                    <h6>Instrucciones:</h6>
                    <ol className="small">
                        <li>Descarga la plantilla Excel usando el botón de arriba</li>
                        <li>Llena el archivo con tus productos siguiendo el formato de ejemplo</li>
                        <li>Guarda el archivo Excel</li>
                        <li>Selecciona el archivo usando el botón "Seleccionar archivo"</li>
                        <li>Haz clic en "Importar Productos"</li>
                    </ol>
                    <div className="alert alert-info small mt-2">
                        <strong>Columnas requeridas para Discos (CD/Tape/Vinilo/Zine):</strong>
                        <br />tipo_producto, banda, album, estilo, pais, sello, precio, imageUrl
                        <br /><br />
                        <strong>Columnas requeridas para Poleras:</strong>
                        <br />tipo_producto, titulo, genero, talla, tipo_polera, precio, imageUrl
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkImport;
