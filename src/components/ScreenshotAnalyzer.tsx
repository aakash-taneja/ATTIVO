import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { ExtractedActivityData, SportType, ActivityField, AnalysisResult } from '../utils/types';
// CSS is imported globally in _app.tsx

interface ScreenshotAnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
  sportType?: SportType;
}

const ScreenshotAnalyzer: React.FC<ScreenshotAnalyzerProps> = ({
  onAnalysisComplete,
  onCancel,
  sportType = 'running'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common patterns to look for in workout screenshots
  const patterns = {
    distance: /(?:distance|covered|ran|run)(?:[^\d]*)([\d.]+)(?:\s*)(km|mi|miles|kilometers)/i,
    duration: /(?:duration|time|elapsed)(?:[^\d]*)([\d.:]+)(?:\s*)(hours|hour|hr|hrs|minutes|minute|min|mins|seconds|second|sec|secs)/i,
    calories: /(?:calories|energy|kcal|cal|cals)(?:[^\d]*)([\d.,]+)/i,
    pace: /(?:pace|avg pace|average pace)(?:[^\d]*)([\d.:]+)(?:\s*)(min\/km|min\/mi|\/km|\/mile)/i,
    date: /(?:date|on)(?:[^\d]*)([\d]{1,2}[-\/][\d]{1,2}[-\/][\d]{2,4}|[\d]{4}[-\/][\d]{1,2}[-\/][\d]{1,2})/i,
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!previewUrl) return;
    
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Initialize Tesseract worker in a simplified way
      const worker = await createWorker();
      
      // Configure logger for progress tracking
      worker.logger = (m: any) => {
        if (m && typeof m.progress === 'number') {
          setProgress(Math.round(m.progress * 100));
        }
      };
      
      // Load language and initialize
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // Recognize text in the image
      const result = await worker.recognize(previewUrl);
      const text = result.data.text;
      
      console.log('Extracted text:', text);
      
      // Parse the extracted text for workout data
      const extractedData: ExtractedActivityData = {
        type: sportType,
        confidence: result.data.confidence,
      };
      
      // Extract data using regex patterns
      if (patterns.distance.test(text)) {
        const match = text.match(patterns.distance);
        if (match) {
          const value = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          // Convert to kilometers if necessary
          extractedData.distance = unit.includes('mi') ? value * 1.60934 : value;
        }
      }
      
      if (patterns.duration.test(text)) {
        const match = text.match(patterns.duration);
        if (match) {
          const timeStr = match[1];
          const unit = match[2].toLowerCase();
          
          // Parse time formats like "1:30:45" or "30:45" or "45"
          const timeParts = timeStr.split(':').map(Number);
          let minutes = 0;
          
          if (timeParts.length === 3) {
            // Hours:Minutes:Seconds
            minutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
          } else if (timeParts.length === 2) {
            // Minutes:Seconds
            minutes = timeParts[0] + timeParts[1] / 60;
          } else {
            // Just one number - determine unit
            if (unit.includes('hour')) {
              minutes = timeParts[0] * 60;
            } else if (unit.includes('min')) {
              minutes = timeParts[0];
            } else if (unit.includes('sec')) {
              minutes = timeParts[0] / 60;
            }
          }
          
          extractedData.duration = Math.round(minutes);
        }
      }
      
      if (patterns.calories.test(text)) {
        const match = text.match(patterns.calories);
        if (match) {
          extractedData.calories = parseInt(match[1].replace(/[,.]/g, ''));
        }
      }
      
      if (patterns.pace.test(text)) {
        const match = text.match(patterns.pace);
        if (match) {
          const paceStr = match[1];
          const unit = match[2].toLowerCase();
          
          // Parse pace formats like "5:30" (min:sec per km/mi)
          const paceParts = paceStr.split(':').map(Number);
          let paceMinutes = 0;
          
          if (paceParts.length === 2) {
            paceMinutes = paceParts[0] + paceParts[1] / 60;
          } else {
            paceMinutes = paceParts[0];
          }
          
          // Convert to min/km if necessary
          extractedData.pace = unit.includes('/mi') ? paceMinutes / 1.60934 : paceMinutes;
        }
      }
      
      if (patterns.date.test(text)) {
        const match = text.match(patterns.date);
        if (match) {
          try {
            // Try to parse the date
            const dateStr = match[1];
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              extractedData.date = date.toISOString();
            }
          } catch (e) {
            console.error('Error parsing date:', e);
          }
        } else {
          // If no date found in text, use current date
          extractedData.date = new Date().toISOString();
        }
      } else {
        // Default to current date if none found
        extractedData.date = new Date().toISOString();
      }
      
      // Pass results to parent component
      onAnalysisComplete({
        extractedData,
        screenshot: previewUrl
      });
      
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="screenshot-analyzer">
      <h2 className="title">Screenshot Analyzer</h2>
      <p className="description">Upload a screenshot of your workout to automatically extract data</p>
      
      <div 
        className="drop-area" 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          <div className="preview-container">
            <img 
              src={previewUrl} 
              alt="Screenshot preview" 
              className="screenshot-preview"
            />
          </div>
        ) : (
          <div className="upload-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#6B7280" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            <p>Drag and drop a screenshot here or click to browse</p>
          </div>
        )}
        <input 
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
      
      {isLoading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>Processing: {progress}%</p>
        </div>
      )}
      
      <div className="button-group">
        <button 
          className="button button-secondary" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button 
          className="button button-primary" 
          onClick={analyzeImage}
          disabled={!previewUrl || isLoading}
        >
          {isLoading ? 'Processing...' : 'Analyze Screenshot'}
        </button>
      </div>
    </div>
  );
};

export default ScreenshotAnalyzer; 