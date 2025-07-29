import React from 'react';
import { Play, Pause, X, Music, Shuffle } from 'lucide-react';
import { Track } from '../types/music';
import './QueueView.css';

interface QueueViewProps {
  queue: Track[];
  currentIndex: number;
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onRemoveFromQueue: (index: number) => void;
  isPlaying: boolean;
}

export const QueueView: React.FC<QueueViewProps> = ({
  queue,
  currentIndex,
  onTrackPlay,
  onRemoveFromQueue,
  isPlaying,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = queue.reduce((acc, track) => acc + track.duration, 0);
  const remainingDuration = queue
    .slice(currentIndex + 1)
    .reduce((acc, track) => acc + track.duration, 0);

  if (queue.length === 0) {
    return (
      <div className="queue-view">
        <div className="view-header">
          <h1 className="view-title">Queue</h1>
          <p className="view-subtitle">Your playback queue is empty</p>
        </div>

        <div className="empty-state">
          <Music className="empty-state-icon" />
          <h3 className="empty-state-title">No songs in queue</h3>
          <p className="empty-state-description">
            Add songs to your queue to see them here. You can add songs by clicking the plus button next to any track.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="queue-view">
      <div className="view-header">
        <div>
          <h1 className="view-title">Queue</h1>
          <p className="view-subtitle">
            {queue.length} songs • {Math.floor(totalDuration / 60)}m total
            {remainingDuration > 0 && ` • ${Math.floor(remainingDuration / 60)}m remaining`}
          </p>
        </div>

        <div className="queue-actions">
          <button className="btn btn-primary">
            <Shuffle size={16} />
            Shuffle Queue
          </button>
          <button className="btn">
            Clear Queue
          </button>
        </div>
      </div>

      <div className="queue-sections">
        {/* Currently Playing */}
        {currentIndex >= 0 && currentIndex < queue.length && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Now Playing</h2>
            </div>
            
            <div className="current-track-card">
              <div className="track-artwork">
                {queue[currentIndex].artwork ? (
                  <img
                    src={queue[currentIndex].artwork}
                    alt={queue[currentIndex].title}
                    className="artwork-image"
                  />
                ) : (
                  <div className="artwork-placeholder">
                    <Music size={24} />
                  </div>
                )}
                
                <div className="artwork-overlay">
                  <button
                    className="btn btn-icon-lg play-btn"
                    onClick={() => onTrackPlay(queue[currentIndex], queue)}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                </div>
              </div>

              <div className="track-details">
                <h3 className="track-title">{queue[currentIndex].title}</h3>
                <p className="track-artist">{queue[currentIndex].artist}</p>
                <p className="track-album">{queue[currentIndex].album}</p>
                <p className="track-duration">{formatDuration(queue[currentIndex].duration)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Up Next */}
        {currentIndex < queue.length - 1 && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                Up Next ({queue.length - currentIndex - 1} songs)
              </h2>
            </div>

            <div className="queue-list">
              {queue.slice(currentIndex + 1).map((track, index) => {
                const actualIndex = currentIndex + 1 + index;
                
                return (
                  <div key={`${track.id}-${actualIndex}`} className="queue-item">
                    <div className="queue-item-number">
                      {actualIndex + 1}
                    </div>

                    <div className="queue-item-artwork">
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

                    <div className="queue-item-info">
                      <div className="track-title" title={track.title}>
                        {track.title}
                      </div>
                      <div className="track-artist" title={track.artist}>
                        {track.artist}
                      </div>
                    </div>

                    <div className="queue-item-duration">
                      {formatDuration(track.duration)}
                    </div>

                    <div className="queue-item-actions">
                      <button
                        className="btn btn-icon queue-action"
                        onClick={() => onTrackPlay(track, queue)}
                        title="Play now"
                      >
                        <Play size={16} />
                      </button>
                      
                      <button
                        className="btn btn-icon queue-action"
                        onClick={() => onRemoveFromQueue(actualIndex)}
                        title="Remove from queue"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Previously Played */}
        {currentIndex > 0 && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">
                Previously Played ({currentIndex} songs)
              </h2>
            </div>

            <div className="queue-list">
              {queue.slice(0, currentIndex).reverse().map((track, index) => {
                const actualIndex = currentIndex - 1 - index;
                
                return (
                  <div key={`${track.id}-${actualIndex}`} className="queue-item played">
                    <div className="queue-item-number">
                      {actualIndex + 1}
                    </div>

                    <div className="queue-item-artwork">
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

                    <div className="queue-item-info">
                      <div className="track-title" title={track.title}>
                        {track.title}
                      </div>
                      <div className="track-artist" title={track.artist}>
                        {track.artist}
                      </div>
                    </div>

                    <div className="queue-item-duration">
                      {formatDuration(track.duration)}
                    </div>

                    <div className="queue-item-actions">
                      <button
                        className="btn btn-icon queue-action"
                        onClick={() => onTrackPlay(track, queue)}
                        title="Play again"
                      >
                        <Play size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};