import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAddSong, setShowAddSong] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);
  
  const [songs, setSongs] = useState([
    { 
      id: 1, 
      title: "Moonlight Sonata", 
      artist: "Beethoven", 
      duration: "5:20",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    },
    { 
      id: 2, 
      title: "Electronic Dreams", 
      artist: "SynthWave", 
      duration: "4:15",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop"
    },
    { 
      id: 3, 
      title: "Jazz Nights", 
      artist: "Cool Jazz Trio", 
      duration: "3:45",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
    }
  ]);

  // Audio controls
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        if (isRepeat) {
          audio.currentTime = 0;
          audio.play();
        } else {
          nextSong();
        }
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [volume, isRepeat]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else {
      nextIndex = (currentSong + 1) % songs.length;
    }
    setCurrentSong(nextIndex);
    setIsPlaying(true);
  };

  const prevSong = () => {
    const prevIndex = (currentSong - 1 + songs.length) % songs.length;
    setCurrentSong(prevIndex);
    setIsPlaying(true);
  };

  const selectSong = (index) => {
    setCurrentSong(index);
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
    }
  };

  const addSong = () => {
    if (newSong.title && newSong.artist && selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const newSongObj = {
        id: Date.now(),
        title: newSong.title,
        artist: newSong.artist,
        duration: "Unknown",
        url: url,
        cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
      };
      
      setSongs([...songs, newSongObj]);
      setNewSong({ title: '', artist: '' });
      setSelectedFile(null);
      setShowAddSong(false);
    }
  };

  // Auto-play when song changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  return (
    <div className="app">
      <div className="music-player">
        {/* Header */}
        <div className="header">
          <h1 className="app-title">
            <span className="music-icon">🎵</span>
            MusicWave
            <span className="pulse-dot"></span>
          </h1>
          <button 
            className="add-song-btn"
            onClick={() => setShowAddSong(true)}
          >
            <span>➕</span> Add Song
          </button>
        </div>

        {/* Current Song Display */}
        <div className="current-song-card">
          <div className="song-artwork">
            <img 
              src={songs[currentSong]?.cover} 
              alt="Album Art"
              className={`album-cover ${isPlaying ? 'spinning' : ''}`}
            />
            <div className="play-overlay" onClick={togglePlay}>
              <span className="play-icon">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
            </div>
          </div>
          
          <div className="song-info">
            <h2 className="song-title">{songs[currentSong]?.title}</h2>
            <p className="song-artist">{songs[currentSong]?.artist}</p>
            
            {/* Progress Bar */}
            <div className="progress-container">
              <span className="time">{formatTime(currentTime)}</span>
              <div className="progress-bar" onClick={handleSeek}>
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="progress-thumb"></div>
                </div>
              </div>
              <span className="time">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button 
            className={`control-btn ${isShuffle ? 'active' : ''}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title="Shuffle"
          >
            🔀
          </button>
          
          <button className="control-btn" onClick={prevSong}>
            ⏮️
          </button>
          
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button className="control-btn" onClick={nextSong}>
            ⏭️
          </button>
          
          <button 
            className={`control-btn ${isRepeat ? 'active' : ''}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title="Repeat"
          >
            🔁
          </button>
        </div>

        {/* Volume Control */}
        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="volume-slider"
          />
          <span className="volume-text">{volume}%</span>
        </div>

        {/* Playlist */}
        <div className="playlist">
          <h3 className="playlist-title">Your Library</h3>
          <div className="song-list">
            {songs.map((song, index) => (
              <div 
                key={song.id}
                className={`song-item ${index === currentSong ? 'active' : ''}`}
                onClick={() => selectSong(index)}
              >
                <div className="song-item-cover">
                  <img src={song.cover} alt="" />
                  {index === currentSong && isPlaying && (
                    <div className="playing-indicator">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  )}
                </div>
                <div className="song-item-info">
                  <div className="song-item-title">{song.title}</div>
                  <div className="song-item-artist">{song.artist}</div>
                </div>
                <div className="song-item-duration">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Song Modal */}
        {showAddSong && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add New Song</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddSong(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-content">
                <div className="form-group">
                  <label>Song Title</label>
                  <input 
                    type="text"
                    value={newSong.title}
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    placeholder="Enter song title"
                  />
                </div>
                
                <div className="form-group">
                  <label>Artist Name</label>
                  <input 
                    type="text"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                    placeholder="Enter artist name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Audio File</label>
                  <div className="file-input-container">
                    <input 
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      id="audio-file"
                    />
                    <label htmlFor="audio-file" className="file-input-label">
                      {selectedFile ? selectedFile.name : '📁 Choose Audio File'}
                    </label>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowAddSong(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={addSong}
                    disabled={!newSong.title || !newSong.artist || !selectedFile}
                  >
                    Add Song
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef}
          src={songs[currentSong]?.url}
          preload="metadata"
        />
      </div>
    </div>
  );
}

export default App;