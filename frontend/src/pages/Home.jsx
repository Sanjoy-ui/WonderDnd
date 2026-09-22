import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/api';
import { Loader2, SearchX, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTaxes, setShowTaxes] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchParamQuery]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchParamQuery) {
        params.search = searchParamQuery;
      }

      const res = await getListings(params);
      if (res.success) {
        setListings(res.data);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError(
        err.response?.data?.message ||
        'Unable to connect to WonderDnd Backend API. Please check if the server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Category Filter & Tax Switch */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showTaxes={showTaxes}
        onToggleTaxes={setShowTaxes}
      />

      {/* Loading State */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
          <Loader2 className="animate-spin" size={40} color="#fe424d" />
          <p style={{ color: '#717171', fontWeight: 500 }}>Loading amazing places to stay...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="empty-state">
          <SearchX className="empty-icon" />
          <h3>Connection Error</h3>
          <p style={{ maxWidth: '500px', color: '#717171' }}>{error}</p>
          <button
            onClick={fetchListings}
            className="btn-add-listing"
            style={{ marginTop: '0.5rem' }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty Listings State */}
      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <SearchX className="empty-icon" />
          <h3>No listings found</h3>
          <p style={{ color: '#717171' }}>
            {searchParamQuery
              ? `No destinations matched "${searchParamQuery}". Try another search or category.`
              : 'There are currently no listings in this category.'}
          </p>
          <Link to="/listings/new" className="btn-add-listing" style={{ marginTop: '0.5rem' }}>
            <Plus size={18} />
            <span>Create First Listing</span>
          </Link>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && !error && listings.length > 0 && (
        <div className="listings-grid">
          {listings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} showTaxes={showTaxes} />
          ))}
        </div>
      )}
    </div>
  );
}
