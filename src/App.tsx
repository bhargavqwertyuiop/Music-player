import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAudio } from './hooks/useAudio';
import { Track, ViewMode } from './types/music';
import { Sidebar } from './components/Sidebar';
import { PlayerControls } from './components/PlayerControls';
import { MainContent } from './components/MainContent';
import { sampleTracks } from './data/sampleTracks';
import './App.css';

function App() {
  const {
    playerState,
    play,
    pause,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    setQueue,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
  } = useAudio();

  const [currentView, setCurrentView] = useState<ViewMode>('library');
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with sample tracks
  useEffect(() => {
    if (tracks.length > 0 && playerState.queue.length === 0) {
      setQueue(tracks);
    }
  }, [tracks, playerState.queue.length, setQueue]);

  const handleTrackPlay = (track: Track, trackList?: Track[]) => {
    const tracksToUse = trackList || tracks;
    const trackIndex = tracksToUse.findIndex(t => t.id === track.id);
    setQueue(tracksToUse, trackIndex);
    setTimeout(() => play(), 100);
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
      
      <div className="app-container">
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          playerState={playerState}
        />
        
        <MainContent
          currentView={currentView}
          tracks={filteredTracks}
          onTrackPlay={handleTrackPlay}
          onTrackAdd={addToQueue}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          playerState={playerState}
          onRemoveFromQueue={removeFromQueue}
        />
      </div>

      <PlayerControls
        playerState={playerState}
        onPlay={play}
        onPause={pause}
        onNext={playNext}
        onPrevious={playPrevious}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
      />
    </div>
  );
}

export default App;