import React from 'react';
import { Track } from '../types/music';
import { TrackCard } from './TrackCard';
import { TrackList } from './TrackList';
import { LayoutGrid, List } from 'lucide-react';
import './LibraryView.css';

interface LibraryViewProps {
  tracks: Track[];
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onTrackAdd: (track: Track) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  onTrackPlay,
  onTrackAdd,
  currentTrack,
  isPlaying,
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const genreStats = React.useMemo(() => {
    const genres = tracks.reduce((acc, track) => {
      const genre = track.genre || 'Unknown';
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(genres)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [tracks]);

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="library-view">
      <div className="view-header">
        <div>
          <h1 className="view-title">Your Library</h1>
          <p className="view-subtitle">
            {tracks.length} songs • {hours > 0 ? `${hours}h ` : ''}{minutes}m total
          </p>
        </div>
        
        <div className="view-controls">
          <div className="view-mode-toggle">
            <button
              className={`btn btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`btn btn-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {genreStats.length > 0 && (
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Popular Genres</h2>
          </div>
          <div className="genre-stats">
            {genreStats.map(([genre, count]) => (
              <div key={genre} className="genre-stat-item">
                <span className="genre-name">{genre}</span>
                <span className="genre-count">{count} {count === 1 ? 'song' : 'songs'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">All Songs</h2>
          <button className="btn btn-primary">
            Play All
          </button>
        </div>

        {viewMode === 'grid' ? (
          <div className="tracks-grid">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={() => onTrackPlay(track, tracks)}
                onAdd={() => onTrackAdd(track)}
                isCurrentTrack={currentTrack?.id === track.id}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        ) : (
          <TrackList
            tracks={tracks}
            onTrackPlay={onTrackPlay}
            onTrackAdd={onTrackAdd}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
          />
        )}
      </div>
    </div>
  );
};