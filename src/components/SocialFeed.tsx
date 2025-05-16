import React, { useState, useRef } from 'react';
import { FaHeart, FaComment, FaShare, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { Post, SportType, ExtractedActivityData, AnalysisResult } from '../utils/types';
import { mockPosts, mockSportProfile, sportTypeFilters } from '../utils/mockData';
import { verifyActivity } from '../utils/blockchain';
import ScreenshotAnalyzer from './ScreenshotAnalyzer';
import DataConfirmationModal from './DataConfirmationModal';
// CSS is imported globally in _app.tsx

interface SocialFeedProps {
  initialPosts?: Post[];
}

const SocialFeed: React.FC<SocialFeedProps> = ({ initialPosts = mockPosts }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState<SportType | 'all'>('all');
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedSportType, setSelectedSportType] = useState<SportType>('running');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Filter posts by sport type
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.activityData?.type === activeFilter);
  
  // Handle like interaction
  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };
  
  // Handle screenshot analyzer
  const handleAddScreenshot = () => {
    setShowAnalyzer(true);
  };
  
  const handleAnalysisComplete = (result: AnalysisResult) => {
    console.log('Analysis result:', result);
    setAnalysisResult(result);
    setShowAnalyzer(false);
    setShowConfirmation(true);
  };
  
  const handleConfirmData = async (extractedData: ExtractedActivityData) => {
    if (!analysisResult) return;
    
    try {
      // In a real app, this would include a call to verify the data on the blockchain
      const verified = await verifyActivity('new-activity');
      
      // Create a new post with the verified data
      const newPost: Post = {
        id: `post${Date.now()}`,
        user: mockSportProfile.user,
        content: newPostContent || `New ${extractedData.type} activity completed!`,
        images: [analysisResult.screenshot],
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        verified: true,
        activityData: {
          type: extractedData.type || 'running',
          duration: extractedData.duration,
          distance: extractedData.distance,
          calories: extractedData.calories,
          verified: true,
          verificationSource: 'screenshot'
        }
      };
      
      // Add the new post to the posts list
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      // Reset states
      setShowConfirmation(false);
      setAnalysisResult(null);
      setNewPostContent('');
      setSelectedSportType('running');
      setIsCreatingPost(false);
    } catch (error) {
      console.error('Error verifying activity:', error);
    }
  };
  
  const handleCancelAnalysis = () => {
    setShowAnalyzer(false);
  };
  
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setAnalysisResult(null);
  };
  
  const toggleCreatePost = () => {
    setIsCreatingPost(!isCreatingPost);
  };
  
  const viewScreenshot = (imageUrl: string) => {
    setViewingScreenshot(imageUrl);
  };
  
  const closeScreenshotView = () => {
    setViewingScreenshot(null);
  };
  
  return (
    <div className="container">
      <h1 className="title">Activity Feed</h1>
      
      {/* Create post input */}
      {isCreatingPost && (
        <div className="card">
          <textarea 
            className="form-control" 
            placeholder="Share your workout or activity..." 
            style={{ width: '100%', minHeight: '100px', marginBottom: '1rem' }}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>
          
          <div style={{ marginBottom: '1rem' }}>
            <select 
              className="form-control" 
              value={selectedSportType} 
              onChange={(e) => setSelectedSportType(e.target.value as SportType)}
              style={{ width: 'auto', display: 'inline-block', marginRight: '1rem' }}
            >
              {sportTypeFilters.filter(f => f.value !== 'all').map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <button 
              className="add-screenshot-button" 
              onClick={handleAddScreenshot}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
              </svg>
              Add screenshot for verification
            </button>
          </div>
          
          <div className="button-group">
            <button 
              className="button button-secondary" 
              onClick={() => setIsCreatingPost(false)}
            >
              Cancel
            </button>
            <button 
              className="button button-primary"
              disabled={!analysisResult}
            >
              {analysisResult ? 'Post with Verified Data' : 'Add Screenshot to Post'}
            </button>
          </div>
        </div>
      )}
      
      {/* Category Filter */}
      <div className="category-tabs">
        {sportTypeFilters.map(filter => (
          <div 
            key={filter.value} 
            className={`category-tab ${activeFilter === filter.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </div>
        ))}
      </div>
      
      {/* Posts */}
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className="card post-card">
              {/* Post Header */}
              <div className="post-header">
                <img 
                  src={post.user.avatar || '/avatars/default.png'} 
                  alt={post.user.name} 
                  className="post-avatar" 
                />
                <div>
                  <div className="post-user">{post.user.name}</div>
                  <div className="post-timestamp">{formatDate(post.timestamp)}</div>
                </div>
                {post.verified && (
                  <div className="badge badge-verified" style={{ marginLeft: 'auto' }}>
                    Verified
                  </div>
                )}
              </div>
              
              {/* Post Content */}
              <div className="post-content">{post.content}</div>
              
              {/* Post Image */}
              {post.images && post.images.length > 0 && (
                <div>
                  <img 
                    src={post.images[0]} 
                    alt="Post" 
                    className="post-image"
                    onClick={() => viewScreenshot(post.images![0])}
                    style={{ cursor: 'pointer' }}
                  />
                  {post.activityData?.verificationSource === 'screenshot' && (
                    <div className="screenshot-indicator">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#6366F1" viewBox="0 0 16 16" className="verification-icon">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      <span>Data verified from screenshot</span>
                      <button 
                        className="screenshot-preview-button"
                        onClick={() => viewScreenshot(post.images![0])}
                      >
                        View
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Activity Data */}
              {post.activityData && (
                <div className="post-activity-data">
                  <div>
                    <div className="post-activity-stat">
                      {post.activityData.type.charAt(0).toUpperCase() + post.activityData.type.slice(1)}
                    </div>
                    <div className="post-activity-label">Activity</div>
                  </div>
                  
                  {post.activityData.duration && (
                    <div>
                      <div className="post-activity-stat">{post.activityData.duration} min</div>
                      <div className="post-activity-label">Duration</div>
                    </div>
                  )}
                  
                  {post.activityData.distance && (
                    <div>
                      <div className="post-activity-stat">{post.activityData.distance.toFixed(2)} km</div>
                      <div className="post-activity-label">Distance</div>
                    </div>
                  )}
                  
                  {post.activityData.calories && (
                    <div>
                      <div className="post-activity-stat">{post.activityData.calories}</div>
                      <div className="post-activity-label">Calories</div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Post Actions */}
              <div className="post-actions">
                <div className="post-action" onClick={() => handleLike(post.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                  </svg>
                  <span>{post.likes}</span>
                </div>
                <div className="post-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                    <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                  <span>{post.comments}</span>
                </div>
                <div className="post-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M11.724 3.947l-7 3.5-.448-.894 7-3.5.448.894zm-.448 9l-7-3.5.448-.894 7 3.5-.448.894z"/>
                    <path fillRule="evenodd" d="M10.5 1.5a.5.5 0 0 1 0 1h-6a.5.5 0 0 0-.5.5v6.793l.854-.854a.5.5 0 1 1 .707.708l-1.5 1.5a.5.5 0 0 1-.707 0l-1.5-1.5a.5.5 0 1 1 .707-.708L3 9.793V2.5a1.5 1.5 0 0 1 1.5-1.5h6z"/>
                  </svg>
                  <span>Share</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No posts found for this filter.</p>
          </div>
        )}
      </div>
      
      {/* Screenshot Modal if viewing */}
      {viewingScreenshot && (
        <div className="modal-overlay" onClick={closeScreenshotView}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="title">Verified Screenshot</h2>
            <img 
              src={viewingScreenshot} 
              alt="Verified Screenshot" 
              style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
            />
            <button 
              className="button button-secondary"
              onClick={closeScreenshotView}
              style={{ margin: '0 auto', display: 'block' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Screenshot Analyzer */}
      {showAnalyzer && (
        <div className="modal-overlay" onClick={handleCancelAnalysis}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <ScreenshotAnalyzer 
              onAnalysisComplete={handleAnalysisComplete}
              onCancel={handleCancelAnalysis}
              sportType={selectedSportType}
            />
          </div>
        </div>
      )}
      
      {/* Data Confirmation Modal */}
      {showConfirmation && analysisResult && (
        <DataConfirmationModal
          data={analysisResult.extractedData}
          screenshot={analysisResult.screenshot}
          onConfirm={handleConfirmData}
          onCancel={handleCancelConfirmation}
        />
      )}
      
      {/* Post Creation Button */}
      <div style={{ position: 'fixed', bottom: '32px', right: '32px' }}>
        <button 
          className="button button-primary" 
          style={{ borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={toggleCreatePost}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SocialFeed; 