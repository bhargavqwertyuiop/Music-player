import React from 'react';
import { Play, Pause, Plus, Heart, MoreHorizontal, Music } from 'lucide-react';
import { Track } from '../types/music';
import './TrackCard.css';

interface TrackCardProps {
  track: Track;
  onPlay: () => void;
  onAdd: () => void;
  isCurrentTrack: boolean;
  isPlaying: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onPlay,
  onAdd,
  isCurrentTrack,
  isPlaying,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`track-card ${isCurrentTrack ? 'current' : ''}`}>
      <div className="track-card-artwork">
        {track.artwork ? (
          <img
            src={track.artwork}
            alt={track.title}
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
            onClick={onPlay}
            title={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentTrack && isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>

      <div className="track-card-content">
        <div className="track-info">
          <h3 className="track-title" title={track.title}>
            {track.title}
          </h3>
          <p className="track-artist" title={track.artist}>
            {track.artist}
          </p>
          <p className="track-album" title={track.album}>
            {track.album}
          </p>
        </div>

        <div className="track-meta">
          <span className="track-duration">{formatDuration(track.duration)}</span>
          {track.year && <span className="track-year">{track.year}</span>}
        </div>

        <div className="track-actions">
          <button
            className={`btn btn-icon track-action ${track.liked ? 'liked' : ''}`}
            title={track.liked ? 'Unlike' : 'Like'}
          >
            <Heart size={16} fill={track.liked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            className="btn btn-icon track-action"
            onClick={onAdd}
            title="Add to queue"
          >
            <Plus size={16} />
          </button>
          
          <button
            className="btn btn-icon track-action"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {track.genre && (
        <div className="track-genre">
          {track.genre}
        </div>
      )}
    </div>
  );
};