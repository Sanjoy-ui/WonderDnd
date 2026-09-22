import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

export default function ListingCard({ listing, showTaxes }) {
  const [isLiked, setIsLiked] = useState(false);

  const rawPrice = Number(listing.price) || 0;
  const finalPrice = showTaxes ? Math.round(rawPrice * 1.18) : rawPrice;

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const imageUrl = listing.image?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60';

  return (
    <Link to={`/listings/${listing._id}`} className="listing-card">
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={listing.title}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60';
          }}
        />

        {listing.category && listing.category !== 'General' && (
          <div className="card-badge">{listing.category}</div>
        )}

        <button
          className="card-like-btn"
          onClick={handleLike}
          title="Save listing"
          aria-label="Save listing"
        >
          <Heart size={22} fill={isLiked ? '#fe424d' : 'rgba(0,0,0,0.3)'} color={isLiked ? '#fe424d' : 'white'} />
        </button>
      </div>

      <div className="card-info">
        <div className="card-header-row">
          <h3 className="card-title">{listing.title}</h3>
        </div>

        <div className="card-location">
          <MapPin size={14} style={{ display: 'inline', marginRight: '3px' }} />
          {listing.location}, {listing.country}
        </div>

        <div className="card-price-row">
          <span className="price-bold">&#8377; {finalPrice.toLocaleString('en-IN')}</span>
          <span className="text-muted"> / night</span>
          {showTaxes && <span className="tax-info">(incl. 18% GST)</span>}
        </div>
      </div>
    </Link>
  );
}
