import React from 'react';
import { 
  Music, 
  Library, 
  ListMusic, 
  Search, 
  Settings,
  Heart,
  User,
  Volume2
} from 'lucide-react';
import { ViewMode, PlayerState } from '../types/music';
import './Sidebar.css';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  playerState: PlayerState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  playerState,
}) => {
  const navigationItems = [
    { id: 'library' as ViewMode, label: 'Library', icon: Library },
    { id: 'playlists' as ViewMode, label: 'Playlists', icon: ListMusic },
    { id: 'queue' as ViewMode, label: 'Queue', icon: Music },
    { id: 'search' as ViewMode, label: 'Search', icon: Search },
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Volume2 className="logo-icon" />
          <h1 className="logo-text">MusicWave</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Discover</h3>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'nav-item-active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.id === 'queue' && playerState.queue.length > 0 && (
                  <span className="nav-item-badge">{playerState.queue.length}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Library</h3>
          <button className="nav-item">
            <Heart size={20} />
            <span>Liked Songs</span>
          </button>
          <button className="nav-item">
            <User size={20} />
            <span>Recently Played</span>
          </button>
        </div>

        <div className="nav-section">
          <button
            className={`nav-item ${currentView === 'settings' ? 'nav-item-active' : ''}`}
            onClick={() => onViewChange('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {playerState.currentTrack && (
        <div className="sidebar-current-track">
          <div className="current-track-info">
            <div className="current-track-artwork">
              {playerState.currentTrack.artwork ? (
                <img 
                  src={playerState.currentTrack.artwork} 
                  alt={playerState.currentTrack.title}
                  className="artwork-image"
                />
              ) : (
                <div className="artwork-placeholder">
                  <Music size={20} />
                </div>
              )}
            </div>
            <div className="current-track-details">
              <div className="current-track-title">
                {playerState.currentTrack.title}
              </div>
              <div className="current-track-artist">
                {playerState.currentTrack.artist}
              </div>
              <div className="current-track-time">
                {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
              </div>
            </div>
          </div>
          
          <div className="current-track-progress">
            <div 
              className="progress-bar"
              style={{
                width: `${(playerState.currentTime / playerState.duration) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};