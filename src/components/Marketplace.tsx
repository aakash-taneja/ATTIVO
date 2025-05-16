import React, { useState } from 'react';
import { MarketplaceItem, SportType } from '../utils/types';
import { mockMarketplaceItems, sportTypeFilters } from '../utils/mockData';
import { purchaseItem } from '../utils/blockchain';
// CSS is imported globally in _app.tsx

interface MarketplaceProps {
  initialItems?: MarketplaceItem[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ initialItems = mockMarketplaceItems }) => {
  const [items, setItems] = useState<MarketplaceItem[]>(initialItems);
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  
  // Filter items based on selected filters
  const filteredItems = items.filter(item => {
    if (sportFilter !== 'all' && item.sportType !== sportFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
    return true;
  });
  
  // Handle purchase
  const handlePurchase = async (itemId: string) => {
    try {
      const success = await purchaseItem(itemId);
      
      if (success) {
        alert('Item purchased successfully!');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to purchase item. Please try again.');
    }
  };
  
  // Type filters
  const typeFilters = [
    { label: 'All Types', value: 'all' },
    { label: 'Titles', value: 'title' },
    { label: 'Badges', value: 'badge' },
    { label: 'Challenges', value: 'challenge' },
    { label: 'Gear', value: 'gear' }
  ];
  
  // Rarity filters
  const rarityFilters = [
    { label: 'All Rarities', value: 'all' },
    { label: 'Common', value: 'common' },
    { label: 'Rare', value: 'rare' },
    { label: 'Epic', value: 'epic' },
    { label: 'Legendary', value: 'legendary' }
  ];
  
  return (
    <div className="container">
      <h1 className="title">Marketplace</h1>
      
      {/* Filters */}
      <div className="marketplace-filters">
        <div className="filter-group">
          <div className="filter-group-label">Sport:</div>
          <div className="category-tabs">
            {sportTypeFilters.map(filter => (
              <div 
                key={filter.value} 
                className={`category-tab ${sportFilter === filter.value ? 'active' : ''}`}
                onClick={() => setSportFilter(filter.value)}
              >
                {filter.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <div className="filter-group-label">Type:</div>
          <div className="category-tabs">
            {typeFilters.map(filter => (
              <div 
                key={filter.value} 
                className={`category-tab ${typeFilter === filter.value ? 'active' : ''}`}
                onClick={() => setTypeFilter(filter.value)}
              >
                {filter.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <div className="filter-group-label">Rarity:</div>
          <div className="category-tabs">
            {rarityFilters.map(filter => (
              <div 
                key={filter.value} 
                className={`category-tab ${rarityFilter === filter.value ? 'active' : ''}`}
                onClick={() => setRarityFilter(filter.value)}
              >
                {filter.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Items Grid */}
      <div className="marketplace-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="marketplace-item">
              <div className="item-image-container">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="item-image" 
                />
                <div className="item-type">
                  {item.type}
                </div>
                <div className={`badge badge-${item.rarity} item-rarity`}>
                  {item.rarity}
                </div>
              </div>
              
              <div className="item-details">
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
                
                <div className="item-price">
                  <div className="price-value">{item.price.amount}</div>
                  <div className="price-currency">{item.price.currency}</div>
                </div>
                
                {item.soulbound && (
                  <div className="soulbound-indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z"/>
                    </svg>
                    Soulbound (Non-transferable)
                  </div>
                )}
                
                {item.sponsored && (
                  <div className="sponsored-badge">
                    <img 
                      src={item.sponsored.logo} 
                      alt={item.sponsored.brand} 
                      className="sponsor-logo" 
                    />
                    <span className="sponsor-name">By {item.sponsored.brand}</span>
                  </div>
                )}
                
                <button 
                  className="button button-primary" 
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => handlePurchase(item.id)}
                >
                  {item.price.amount > 0 ? 'Purchase' : 'Claim Free'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <p>No items found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace; 