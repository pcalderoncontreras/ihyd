import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Buscar productos..." }) => {
    return (
        <div className="mb-1">
            <input
                type="text"
                className="form-control custom-search-bar rounded-pill"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
