import React from 'react'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <img src="./search.png" alt="search icon" className="search-icon" />
        <input 
          type="text"
          placeholder="Search through thousands of movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  ) 
}

export default Search