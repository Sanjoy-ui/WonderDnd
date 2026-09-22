import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createListing } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Sparkles, Image, Check, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Trending',
  'Beachfront',
  'Iconic Cities',
  'Mountains',
  'Castles',
  'Camping',
  'Arctic',
  'Luxury',
  'Farms',
  'Lakefront',
  'General',
];

export default function NewListing() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    location: '',
    country: '',
    category: 'Trending',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Please enter a valid positive price';
    if (!formData.location.trim()) newErrors.location = 'Location (city/area) is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please correct the highlighted fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        country: formData.country,
        category: formData.category,
        image: {
          filename: 'listingimage',
          url: formData.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60',
        },
      };

      const res = await createListing(payload);
      if (res.success) {
        addToast('New listing created successfully!', 'success');
        navigate(`/listings/${res.data._id}`);
      }
    } catch (err) {
      console.error('Create listing error:', err);
      addToast(err.response?.data?.message || 'Failed to create listing.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ maxWidth: '680px', margin: '0 auto 1rem auto' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#717171', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </Link>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>Host Your Place</h2>
          <p>Share your space with travelers from around the world</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Listing Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Cozy Beachfront Villa with Infinity Pool"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="form-error-msg">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="form-textarea"
              placeholder="Describe what makes your space special, the views, vibes, and key highlights..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="form-error-msg">{errors.description}</span>}
          </div>

          {/* Image URL with Preview */}
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={handleChange}
            />
            {formData.image && (
              <div className="image-preview-container">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="image-preview-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60';
                  }}
                />
              </div>
            )}
          </div>

          {/* Category & Price Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price per night (&#8377; INR) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                className="form-input"
                placeholder="e.g. 2500"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <span className="form-error-msg">{errors.price}</span>}
            </div>
          </div>

          {/* Location & Country Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="location">City / Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Goa, Malibu, Kyoto"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <span className="form-error-msg">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                id="country"
                name="country"
                type="text"
                className="form-input"
                placeholder="e.g. India, USA, Japan"
                value={formData.country}
                onChange={handleChange}
              />
              {errors.country && <span className="form-error-msg">{errors.country}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary-block"
            style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Creating Listing...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Publish Listing</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
