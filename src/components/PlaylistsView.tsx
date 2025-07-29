import React, { useState } from 'react';
import { Plus, Play, Music, Clock, MoreHorizontal } from 'lucide-react';
import { Track } from '../types/music';
import './PlaylistsView.css';

interface PlaylistsViewProps {
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onTrackAdd: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({
  onTrackPlay,
  onTrackAdd,
  currentTrack,
  isPlaying,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Mock playlists data - in a real app this would come from props or state management
  const playlists = [
    {
      id: '1',
      name: 'Liked Songs',
      description: 'Your favorite tracks',
      trackCount: 5,
      duration: 1245,
      artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      isLiked: true,
    },
    {
      id: '2',
      name: 'Chill Vibes',
      description: 'Perfect for relaxing',
      trackCount: 12,
      duration: 2847,
      artwork: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
      isLiked: false,
    },
    {
      id: '3',
      name: 'Workout Mix',
      description: 'High energy tracks',
      trackCount: 8,
      duration: 1923,
      artwork: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop',
      isLiked: false,
    },
    {
      id: '4',
      name: 'Jazz Evening',
      description: 'Smooth jazz for the evening',
      trackCount: 15,
      duration: 3456,
      artwork: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      isLiked: false,
    },
  ];

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      // In a real app, this would create a new playlist
      console.log('Creating playlist:', newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="playlists-view">
      <div className="view-header">
        <div>
          <h1 className="view-title">Your Playlists</h1>
          <p className="view-subtitle">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          className="btn btn-primary create-playlist-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus size={16} />
          Create Playlist
        </button>
      </div>

      {showCreateForm && (
        <div className="create-playlist-form-overlay">
          <div className="create-playlist-form">
            <h3 className="form-title">Create New Playlist</h3>
            <form onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                className="input"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
              />
              <div className="form-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPlaylistName('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newPlaylistName.trim()}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <div className="playlist-artwork">
              {playlist.artwork ? (
                <img
                  src={playlist.artwork}
                  alt={playlist.name}
                  className="artwork-image"
                  loading="lazy"
                />
              ) : (
                <div className="artwork-placeholder">
                  <Music size={32} />
                </div>
              )}
              
              <div className="artwork-overlay">
                <button
                  className="btn btn-icon-lg play-btn"
                  title="Play playlist"
                >
                  <Play size={20} />
                </button>
              </div>
            </div>

            <div className="playlist-info">
              <h3 className="playlist-name" title={playlist.name}>
                {playlist.name}
              </h3>
              
              {playlist.description && (
                <p className="playlist-description" title={playlist.description}>
                  {playlist.description}
                </p>
              )}

              <div className="playlist-meta">
                <span className="track-count">
                  {playlist.trackCount} {playlist.trackCount === 1 ? 'song' : 'songs'}
                </span>
                <span className="playlist-duration">
                  <Clock size={14} />
                  {formatDuration(playlist.duration)}
                </span>
              </div>
            </div>

            <div className="playlist-actions">
              <button
                className="btn btn-icon playlist-action"
                title="More options"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state for when no playlists exist */}
        {playlists.length === 0 && (
          <div className="empty-playlists">
            <div className="empty-state">
              <Music className="empty-state-icon" />
              <h3 className="empty-state-title">No playlists yet</h3>
              <p className="empty-state-description">
                Create your first playlist to organize your favorite music.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={16} />
                Create Your First Playlist
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Quick Access</h2>
        </div>
        
        <div className="quick-access-grid">
          <div className="quick-access-item">
            <div className="quick-access-icon liked-songs">
              <Music size={20} />
            </div>
            <div className="quick-access-info">
              <h4 className="quick-access-title">Liked Songs</h4>
              <p className="quick-access-subtitle">5 songs</p>
            </div>
          </div>
          
          <div className="quick-access-item">
            <div className="quick-access-icon recent">
              <Clock size={20} />
            </div>
            <div className="quick-access-info">
              <h4 className="quick-access-title">Recently Played</h4>
              <p className="quick-access-subtitle">Last 20 songs</p>
            </div>
          </div>
          
          <div className="quick-access-item">
            <div className="quick-access-icon popular">
              <Play size={20} />
            </div>
            <div className="quick-access-info">
              <h4 className="quick-access-title">Most Played</h4>
              <p className="quick-access-subtitle">Your top tracks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};