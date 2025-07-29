import React from 'react';
import { Track, ViewMode, PlayerState } from '../types/music';
import { LibraryView } from './LibraryView';
import { QueueView } from './QueueView';
import { SearchView } from './SearchView';
import { PlaylistsView } from './PlaylistsView';
import { SettingsView } from './SettingsView';
import './MainContent.css';

interface MainContentProps {
  currentView: ViewMode;
  tracks: Track[];
  onTrackPlay: (track: Track, trackList?: Track[]) => void;
  onTrackAdd: (track: Track) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  playerState: PlayerState;
  onRemoveFromQueue: (index: number) => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  currentView,
  tracks,
  onTrackPlay,
  onTrackAdd,
  searchQuery,
  onSearchChange,
  playerState,
  onRemoveFromQueue,
}) => {
  const renderContent = () => {
    switch (currentView) {
      case 'library':
        return (
          <LibraryView
            tracks={tracks}
            onTrackPlay={onTrackPlay}
            onTrackAdd={onTrackAdd}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
          />
        );
      case 'search':
        return (
          <SearchView
            tracks={tracks}
            onTrackPlay={onTrackPlay}
            onTrackAdd={onTrackAdd}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
          />
        );
      case 'queue':
        return (
          <QueueView
            queue={playerState.queue}
            currentIndex={playerState.currentIndex}
            onTrackPlay={onTrackPlay}
            onRemoveFromQueue={onRemoveFromQueue}
            isPlaying={playerState.isPlaying}
          />
        );
      case 'playlists':
        return (
          <PlaylistsView
            onTrackPlay={onTrackPlay}
            onTrackAdd={onTrackAdd}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <LibraryView
            tracks={tracks}
            onTrackPlay={onTrackPlay}
            onTrackAdd={onTrackAdd}
            currentTrack={playerState.currentTrack}
            isPlaying={playerState.isPlaying}
          />
        );
    }
  };

  return (
    <div className="main-content">
      <div className="main-content-inner">
        {renderContent()}
      </div>
    </div>
  );
};