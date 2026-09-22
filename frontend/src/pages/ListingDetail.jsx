import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, deleteListing } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  MapPin, 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Wifi, 
  Tv, 
  Wind, 
  Car, 
  Coffee, 
  ShieldCheck, 
  Loader2, 
  Star,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Booking simulation state
  const [nights, setNights] = useState(3);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getListingById(id);
      if (res.success) {
        setListing(res.data);
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError(err.response?.data?.message || 'Failed to load listing details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteListing(id);
      if (res.success) {
        addToast('Listing deleted successfully', 'success');
        navigate('/');
      }
    } catch (err) {
      console.error('Delete error:', err);
      addToast(err.response?.data?.message || 'Failed to delete listing.', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={40} color="#fe424d" />
        <p style={{ color: '#717171' }}>Loading property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="empty-state">
        <AlertTriangle className="empty-icon" color="#dc2626" />
        <h3>Listing Not Found</h3>
        <p style={{ color: '#717171' }}>{error || "The property you're looking for does not exist."}</p>
        <Link to="/" className="btn-add-listing">
          <ArrowLeft size={16} />
          <span>Back to All Listings</span>
        </Link>
      </div>
    );
  }

  const rawPrice = Number(listing.price) || 0;
  const stayTotal = rawPrice * nights;
  const serviceFee = Math.round(stayTotal * 0.12);
  const taxes = Math.round(stayTotal * 0.18);
  const grandTotal = stayTotal + serviceFee + taxes;

  const imageUrl = listing.image?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60';

  return (
    <div className="detail-container">
      {/* Back Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#717171', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="detail-header">
        <h1 className="detail-title">{listing.title}</h1>
        <div className="detail-subline">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#222', fontWeight: 600 }}>
            <Star size={16} fill="#fe424d" color="#fe424d" />
            4.95 &bull; 28 reviews
          </span>
          <span>&bull;</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={16} color="#fe424d" />
            {listing.location}, {listing.country}
          </span>
          {listing.category && (
            <>
              <span>&bull;</span>
              <span className="card-badge" style={{ position: 'static' }}>{listing.category}</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Image */}
      <img
        src={imageUrl}
        alt={listing.title}
        className="detail-hero-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60';
        }}
      />

      {/* Main Content & Sticky Booking Card */}
      <div className="detail-content-grid">
        <div className="detail-main">
          <div>
            <h2 className="detail-section-title">About this destination</h2>
            <p className="detail-description">
              {listing.description ||
                'Experience world-class hospitality in this prime destination. Perfectly located with breathtaking surrounding scenery, premium amenities, and seamless comfort for your entire stay.'}
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ebebeb' }} />

          {/* Amenities */}
          <div>
            <h2 className="detail-section-title">What this place offers</h2>
            <div className="amenities-grid">
              <div className="amenity-item"><Wifi size={20} color="#717171" /> <span>High-speed Fiber WiFi</span></div>
              <div className="amenity-item"><Wind size={20} color="#717171" /> <span>Central Air Conditioning</span></div>
              <div className="amenity-item"><Car size={20} color="#717171" /> <span>Free on-premises parking</span></div>
              <div className="amenity-item"><Coffee size={20} color="#717171" /> <span>Espresso machine & Kitchen</span></div>
              <div className="amenity-item"><Tv size={20} color="#717171" /> <span>55" 4K Smart TV</span></div>
              <div className="amenity-item"><ShieldCheck size={20} color="#717171" /> <span>24/7 Security & Keyless Entry</span></div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ebebeb' }} />

          {/* Host Guarantee */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#f8fafc', padding: '1.25rem', borderRadius: '12px' }}>
            <CheckCircle size={28} color="#10b981" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>WonderDnd Verified Stay</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues.</p>
            </div>
          </div>
        </div>

        {/* Pricing / Action Card */}
        <div>
          <div className="pricing-card">
            <div className="pricing-card-header">
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  &#8377; {rawPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ color: '#717171', fontSize: '0.9rem' }}> / night</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#222' }}>
                ★ 4.95
              </div>
            </div>

            {/* Simulated Booking Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#717171', display: 'block' }}>NIGHTS</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={nights}
                  onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ border: 'none', outline: 'none', width: '100%', fontWeight: 600, fontSize: '0.9rem' }}
                />
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#717171', display: 'block' }}>GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  style={{ border: 'none', outline: 'none', width: '100%', fontWeight: 600, fontSize: '0.9rem', background: 'transparent' }}
                >
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={4}>4 guests</option>
                  <option value={6}>6 guests</option>
                </select>
              </div>
            </div>

            <button
              className="btn-primary-block"
              onClick={() => addToast('Reservation simulated! Ready for booking integration.', 'success')}
            >
              Reserve Now
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#717171' }}>
              You won't be charged yet
            </p>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#4b5563' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>&#8377; {rawPrice.toLocaleString('en-IN')} &times; {nights} nights</span>
                <span>&#8377; {stayTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>WonderDnd Service fee (12%)</span>
                <span>&#8377; {serviceFee.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes & GST (18%)</span>
                <span>&#8377; {taxes.toLocaleString('en-IN')}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #ebebeb', margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#222' }}>
                <span>Total Amount</span>
                <span>&#8377; {grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #ebebeb' }} />

            {/* Host Actions (Edit & Delete) */}
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#717171', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Host Management
              </div>
              <div className="action-buttons-group">
                <Link to={`/listings/${listing._id}/edit`} className="btn-edit">
                  <Edit3 size={16} />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
              Delete this listing?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <b>"{listing.title}"</b>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-edit"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: '#dc2626', color: 'white' }}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
