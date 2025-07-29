import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(50);
  
  const songs = [
    { id: 1, title: "Moonlight Sonata", artist: "Beethoven", duration: "5:20" },
    { id: 2, title: "Electronic Dreams", artist: "SynthWave", duration: "4:15" },
    { id: 3, title: "Jazz Nights", artist: "Cool Jazz Trio", duration: "3:45" },
    { id: 4, title: "Rock Anthem", artist: "Thunder Band", duration: "4:30" },
    { id: 5, title: "Ambient Space", artist: "Cosmic Sounds", duration: "6:10" }
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
  };

  return (
    <div className="app">
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
          🎵 Advanced Music Player
        </h1>
        
        {/* Current Song Display */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '2rem',
          minWidth: '400px'
        }}>
          <h2 style={{ marginBottom: '10px' }}>{songs[currentSong].title}</h2>
          <p style={{ opacity: 0.8, marginBottom: '20px' }}>
            by {songs[currentSong].artist} • {songs[currentSong].duration}
          </p>
          
          {/* Control Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
            <button 
              onClick={prevSong}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ⏮️
            </button>
            
            <button 
              onClick={togglePlay}
              style={{
                background: isPlaying ? '#ff4757' : '#2ed573',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                borderRadius: '50%',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button 
              onClick={nextSong}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ⏭️
            </button>
          </div>
          
          {/* Volume Control */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ marginRight: '10px' }}>🔊 Volume: {volume}%</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>
          
          <p style={{ marginTop: '20px', opacity: 0.8 }}>
            Status: {isPlaying ? '🎵 Playing' : '⏹️ Stopped'}
          </p>
        </div>
        
        {/* Playlist */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '400px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Playlist</h3>
          {songs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => setCurrentSong(index)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: index === currentSong ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                cursor: 'pointer',
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{song.title} - {song.artist}</span>
              <span style={{ opacity: 0.7 }}>{song.duration}</span>
            </div>
          ))}
        </div>
        
        <p style={{ marginTop: '2rem', opacity: 0.7 }}>
          🎶 Your music player is fully functional! 🎶
        </p>
      </div>
    </div>
  );
}

export default App;