
const products = [
    { id: 1, banda: "Metallica", album: "Black Album", precio: 20000 },
    { id: 2, banda: 12345, album: "Numeric Album", precio: 15000 }, // This should crash
    { id: 3, banda: "Iron Maiden", album: null, precio: 30000 }
];

const searchTerm = "123";

try {
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(product => {
        // Simulating the code in ProductList.jsx
        const banda = product.banda?.toLowerCase() || '';
        const album = product.album?.toLowerCase() || '';

        return banda.includes(term) || album.includes(term);
    });
    console.log("Filtered products:", filtered);
} catch (error) {
    console.error("Crash confirmed:", error.message);
}
