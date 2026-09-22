import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, PlusCircle, Cloud } from 'lucide-react';

export default function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => onSearch && onSearch('')}>
          <Compass className="brand-icon" />
          <span>WonderDnd</span>
        </Link>

        {/* Global Search Bar */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by city, country, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-btn" title="Search">
            <Search size={16} />
          </button>
        </form>

        {/* Actions */}
        <div className="nav-actions">
          <div className="aws-badge" title="Decoupled Microservice Architecture Ready for AWS">
            <Cloud size={14} />
            <span>AWS Cloud Ready</span>
          </div>

          <Link to="/listings/new" className="btn-add-listing">
            <PlusCircle size={18} />
            <span>Add Listing</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
