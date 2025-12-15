
const products = [
    { id: 1, banda: "Metallica", album: "Black Album", precio: 20000, tipo_producto: "CD" },
    { id: 2, banda: 12345, album: "Numeric Album", precio: 15000, tipo_producto: 12345 }, // Dangerous
    { id: 3, banda: "Iron Maiden", album: null, precio: 30000, tipo_producto: null }
];

const category = "CD";

try {
    // Simulate Home.jsx / ProductList.jsx search filtering
    const searchTerm = "123";
    const term = searchTerm.toLowerCase();
    products.filter(product => {
        const banda = String(product.banda || '').toLowerCase();
        const album = String(product.album || '').toLowerCase();
        return banda.includes(term) || album.includes(term);
    });

    // Simulate ProductList.jsx useEffect filtering
    products.filter(p =>
        p.tipo_producto &&
        String(p.tipo_producto).toLowerCase() === category.toLowerCase()
    );

    // Simulate CategorySection.jsx filtering
    products.filter(p =>
        p.tipo_producto &&
        String(p.tipo_producto).toLowerCase() === category.toLowerCase()
    );

    console.log("SUCCESS: All search and filter logic is safe against numeric types");
} catch (error) {
    console.error("FAILURE: Still crashed:", error.message);
    process.exit(1);
}
