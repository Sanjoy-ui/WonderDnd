import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById, updateListing } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

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

export default function EditListing() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await getListingById(id);
      if (res.success) {
        const item = res.data;
        setFormData({
          title: item.title || '',
          description: item.description || '',
          image: item.image?.url || '',
          price: item.price || '',
          location: item.location || '',
          country: item.country || '',
          category: item.category || 'General',
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      addToast('Failed to load listing for editing.', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

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
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Please enter a valid price';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
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

      const res = await updateListing(id, payload);
      if (res.success) {
        addToast('Listing updated successfully!', 'success');
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      console.error('Update error:', err);
      addToast(err.response?.data?.message || 'Failed to update listing.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={40} color="#fe424d" />
        <p style={{ color: '#717171' }}>Loading listing details...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ maxWidth: '680px', margin: '0 auto 1rem auto' }}>
        <Link to={`/listings/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#717171', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Cancel & Back</span>
        </Link>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h2>Edit Your Listing</h2>
          <p>Update photos, pricing, description, or property details</p>
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
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="form-error-msg">{errors.description}</span>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              className="form-input"
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
