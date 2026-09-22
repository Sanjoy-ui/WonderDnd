import React from 'react';
import { 
  Flame, 
  Umbrella, 
  Building2, 
  Mountain, 
  Castle, 
  Tent, 
  Snowflake, 
  Crown, 
  Tractor, 
  Waves,
  Sparkles 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Sparkles },
  { name: 'Trending', icon: Flame },
  { name: 'Beachfront', icon: Umbrella },
  { name: 'Iconic Cities', icon: Building2 },
  { name: 'Mountains', icon: Mountain },
  { name: 'Castles', icon: Castle },
  { name: 'Camping', icon: Tent },
  { name: 'Arctic', icon: Snowflake },
  { name: 'Luxury', icon: Crown },
  { name: 'Farms', icon: Tractor },
  { name: 'Lakefront', icon: Waves },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory, showTaxes, onToggleTaxes }) {
  return (
    <div className="filter-bar-wrapper">
      <div className="categories-container">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.name;
          return (
            <div
              key={cat.name}
              className={`category-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <Icon className="category-icon" size={22} />
              <span>{cat.name}</span>
            </div>
          );
        })}
      </div>

      <div className="tax-toggle-box">
        <span>Display total before taxes</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showTaxes}
            onChange={(e) => onToggleTaxes(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
}
