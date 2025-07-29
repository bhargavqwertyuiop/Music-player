import React, { useState, useMemo } from 'react';
import { Search, X, Filter, Music } from 'lucide-react';
import { Track } from '../types/music';
import { TrackCard } from './TrackCard';
import { TrackList } from './TrackList';
import './SearchView.css';

interface SearchViewProps {
  tracks: Track[];
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onTrackAdd: (track: Track) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const SearchView: React.FC<SearchViewProps> = ({
  tracks,
  onTrackPlay,
  onTrackAdd,
  searchQuery,
  onSearchChange,
  currentTrack,
  isPlaying,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterBy, setFilterBy] = useState<'all' | 'title' | 'artist' | 'album' | 'genre'>('all');

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    
    return tracks.filter(track => {
      switch (filterBy) {
        case 'title':
          return track.title.toLowerCase().includes(query);
        case 'artist':
          return track.artist.toLowerCase().includes(query);
        case 'album':
          return track.album.toLowerCase().includes(query);
        case 'genre':
          return track.genre?.toLowerCase().includes(query);
        default:
          return (
            track.title.toLowerCase().includes(query) ||
            track.artist.toLowerCase().includes(query) ||
            track.album.toLowerCase().includes(query) ||
            track.genre?.toLowerCase().includes(query)
          );
      }
    });
  }, [tracks, searchQuery, filterBy]);

  const clearSearch = () => {
    onSearchChange('');
  };

  const popularSearches = ['Jazz', 'Electronic', 'Classical', 'Rock', 'Pop'];

  return (
    <div className="search-view">
      <div className="view-header">
        <h1 className="view-title">Search</h1>
        <p className="view-subtitle">Find your favorite music</p>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search for songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              className="btn btn-icon clear-search-btn"
              onClick={clearSearch}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="search-filters">
          <button
            className="btn btn-icon filter-toggle"
            title="Filters"
          >
            <Filter size={16} />
          </button>
          
          <div className="filter-options">
            {(['all', 'title', 'artist', 'album', 'genre'] as const).map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${filterBy === filter ? 'active' : ''}`}
                onClick={() => setFilterBy(filter)}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!searchQuery.trim() ? (
        <div className="search-suggestions">
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Popular Searches</h2>
            </div>
            
            <div className="popular-searches">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  className="popular-search-item"
                  onClick={() => onSearchChange(search)}
                >
                  <Search size={16} />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Browse All</h2>
            </div>
            
            <div className="browse-categories">
              {['Recently Played', 'Liked Songs', 'Most Played', 'New Releases'].map((category) => (
                <div key={category} className="category-card">
                  <h3 className="category-title">{category}</h3>
                  <p className="category-subtitle">Discover {category.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="search-results">
          {filteredTracks.length > 0 ? (
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">
                  {filteredTracks.length} result{filteredTracks.length !== 1 ? 's' : ''} for "{searchQuery}"
                </h2>
                
                <div className="view-controls">
                  <button
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </button>
                  <button
                    className={`btn ${viewMode === 'list' ? 'btn-primary' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="search-results-grid">
                  {filteredTracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={() => onTrackPlay(track, filteredTracks)}
                      onAdd={() => onTrackAdd(track)}
                      isCurrentTrack={currentTrack?.id === track.id}
                      isPlaying={isPlaying}
                    />
                  ))}
                </div>
              ) : (
                <TrackList
                  tracks={filteredTracks}
                  onTrackPlay={onTrackPlay}
                  onTrackAdd={onTrackAdd}
                  currentTrack={currentTrack}
                  isPlaying={isPlaying}
                />
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Music className="empty-state-icon" />
              <h3 className="empty-state-title">No results found</h3>
              <p className="empty-state-description">
                Try searching with different keywords or browse our categories above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};