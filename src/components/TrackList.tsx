import React from 'react';
import { Play, Pause, Plus, Heart, MoreHorizontal, Music } from 'lucide-react';
import { Track } from '../types/music';
import './TrackList.css';

interface TrackListProps {
  tracks: Track[];
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onTrackAdd: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackPlay,
  onTrackAdd,
  currentTrack,
  isPlaying,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="track-list">
      <div className="track-list-header">
        <div className="header-cell header-play">#</div>
        <div className="header-cell header-title">Title</div>
        <div className="header-cell header-album">Album</div>
        <div className="header-cell header-duration">Duration</div>
        <div className="header-cell header-actions">Actions</div>
      </div>

      <div className="track-list-body">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div
              key={track.id}
              className={`track-list-row ${isCurrentTrack ? 'current' : ''}`}
              onDoubleClick={() => onTrackPlay(track, tracks)}
            >
              <div className="track-cell track-play">
                <div className="track-number">{index + 1}</div>
                <button
                  className="btn btn-icon play-btn"
                  onClick={() => onTrackPlay(track, tracks)}
                  title={isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentTrack && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>

              <div className="track-cell track-title-cell">
                <div className="track-artwork-small">
                  {track.artwork ? (
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="artwork-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="artwork-placeholder">
                      <Music size={16} />
                    </div>
                  )}
                </div>
                <div className="track-info">
                  <div className="track-title" title={track.title}>
                    {track.title}
                  </div>
                  <div className="track-artist" title={track.artist}>
                    {track.artist}
                  </div>
                </div>
              </div>

              <div className="track-cell track-album" title={track.album}>
                {track.album}
              </div>

              <div className="track-cell track-duration">
                {formatDuration(track.duration)}
              </div>

              <div className="track-cell track-actions">
                <button
                  className={`btn btn-icon track-action ${track.liked ? 'liked' : ''}`}
                  title={track.liked ? 'Unlike' : 'Like'}
                >
                  <Heart size={16} fill={track.liked ? 'currentColor' : 'none'} />
                </button>
                
                <button
                  className="btn btn-icon track-action"
                  onClick={() => onTrackAdd(track)}
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
          );
        })}
      </div>
    </div>
  );
};