import React, { useState } from 'react';
// CSS is imported globally in _app.tsx
import { ExtractedActivityData, ActivityField, SportType } from '../utils/types';

interface DataConfirmationModalProps {
  data: ExtractedActivityData;
  screenshot: string;
  onConfirm: (data: ExtractedActivityData) => void;
  onCancel: () => void;
}

const DataConfirmationModal: React.FC<DataConfirmationModalProps> = ({
  data,
  screenshot,
  onConfirm,
  onCancel
}) => {
  const [editedData, setEditedData] = useState<ExtractedActivityData>(data);
  
  // Function to update a single field
  const updateField = (field: ActivityField, value: any) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };
  
  // Format a date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format duration as HH:MM
  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours > 0 ? hours + 'h ' : ''}${mins > 0 ? mins + 'm' : ''}`;
  };
  
  // Format pace as MM:SS per km
  const formatPace = (pace?: number) => {
    if (!pace) return '';
    const minutes = Math.floor(pace);
    const seconds = Math.floor((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  };
  
  // Available sport types
  const sportTypes: SportType[] = [
    'running',
    'basketball',
    'soccer',
    'tennis',
    'gym',
    'swimming',
    'other'
  ];
  
  return (
    <div className="modal-overlay">
      <div className="modal-content data-confirmation-modal">
        <h2 className="title">Confirm Activity Data</h2>
        <p className="description">
          We've extracted the following data from your screenshot. Please confirm or edit the information below.
        </p>
        
        <div className="modal-grid">
          <div className="modal-preview">
            <img 
              src={screenshot} 
              alt="Activity Screenshot" 
              className="screenshot-preview"
            />
            {data.confidence < 80 && (
              <div className="confidence-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#F59E0B" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                <span>Low confidence in OCR results. Please verify carefully.</span>
              </div>
            )}
          </div>
          
          <div className="modal-fields">
            <div className="form-group">
              <label htmlFor="activity-type">Activity Type</label>
              <select
                id="activity-type"
                value={editedData.type || ''}
                onChange={(e) => updateField('type', e.target.value as SportType)}
                className="form-control"
              >
                {sportTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity-date">Date</label>
              <input
                id="activity-date"
                type="date"
                value={editedData.date ? new Date(editedData.date).toISOString().split('T')[0] : ''}
                onChange={(e) => updateField('date', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                className="form-control"
              />
              <div className="extracted-value">
                {data.date && `Extracted: ${formatDate(data.date)}`}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity-duration">Duration (minutes)</label>
              <input
                id="activity-duration"
                type="number"
                value={editedData.duration || ''}
                onChange={(e) => updateField('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                className="form-control"
              />
              <div className="extracted-value">
                {data.duration && `Extracted: ${formatDuration(data.duration)}`}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity-distance">Distance (km)</label>
              <input
                id="activity-distance"
                type="number"
                step="0.01"
                value={editedData.distance || ''}
                onChange={(e) => updateField('distance', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="form-control"
              />
              <div className="extracted-value">
                {data.distance && `Extracted: ${data.distance.toFixed(2)} km`}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity-calories">Calories</label>
              <input
                id="activity-calories"
                type="number"
                value={editedData.calories || ''}
                onChange={(e) => updateField('calories', e.target.value ? parseInt(e.target.value) : undefined)}
                className="form-control"
              />
              <div className="extracted-value">
                {data.calories && `Extracted: ${data.calories} cal`}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity-pace">Pace (min/km)</label>
              <input
                id="activity-pace"
                type="number"
                step="0.01"
                value={editedData.pace || ''}
                onChange={(e) => updateField('pace', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="form-control"
              />
              <div className="extracted-value">
                {data.pace && `Extracted: ${formatPace(data.pace)}`}
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            className="button button-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="button button-primary" 
            onClick={() => onConfirm(editedData)}
          >
            Confirm & Add to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataConfirmationModal; 