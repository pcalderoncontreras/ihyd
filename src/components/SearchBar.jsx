import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Buscar productos..." }) => {
    return (
        <div className="mb-4">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
