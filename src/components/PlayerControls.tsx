import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  MoreHorizontal,
} from 'lucide-react';
import { PlayerState } from '../types/music';
import './PlayerControls.css';

interface PlayerControlsProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !playerState.duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * playerState.duration;
    
    onSeek(Math.max(0, Math.min(newTime, playerState.duration)));
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current || !playerState.duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * playerState.duration;
    
    setTempTime(newTime);
  };

  const handleProgressMouseUp = () => {
    if (isDragging) {
      onSeek(tempTime);
      setIsDragging(false);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    onVolumeChange(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging, tempTime]);

  const currentTime = isDragging ? tempTime : playerState.currentTime;
  const progressPercentage = playerState.duration > 0 
    ? (currentTime / playerState.duration) * 100 
    : 0;

  const getRepeatIcon = () => {
    switch (playerState.repeatMode) {
      case 'one':
        return Repeat1;
      case 'all':
        return Repeat;
      default:
        return Repeat;
    }
  };

  const RepeatIcon = getRepeatIcon();

  return (
    <div className="player-controls">
      <div className="player-controls-content">
        {/* Track Info */}
        <div className="track-info">
          {playerState.currentTrack ? (
            <>
              <div className="track-artwork">
                {playerState.currentTrack.artwork ? (
                  <img
                    src={playerState.currentTrack.artwork}
                    alt={playerState.currentTrack.title}
                    className="artwork-image"
                  />
                ) : (
                  <div className="artwork-placeholder">
                    <div className="artwork-icon">♪</div>
                  </div>
                )}
              </div>
              <div className="track-details">
                <div className="track-title">{playerState.currentTrack.title}</div>
                <div className="track-artist">{playerState.currentTrack.artist}</div>
              </div>
              <button className="btn btn-icon track-action">
                <Heart size={18} />
              </button>
            </>
          ) : (
            <div className="track-placeholder">
              <div className="track-title">No track selected</div>
              <div className="track-artist">Choose a song to start playing</div>
            </div>
          )}
        </div>

        {/* Main Controls */}
        <div className="main-controls">
          <div className="control-buttons">
            <button
              className={`btn btn-icon control-btn ${playerState.isShuffling ? 'active' : ''}`}
              onClick={onToggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            
            <button
              className="btn btn-icon control-btn"
              onClick={onPrevious}
              disabled={!playerState.currentTrack}
              title="Previous"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              className="btn btn-icon-lg play-pause-btn"
              onClick={playerState.isPlaying ? onPause : onPlay}
              disabled={!playerState.currentTrack}
              title={playerState.isPlaying ? 'Pause' : 'Play'}
            >
              {playerState.isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              className="btn btn-icon control-btn"
              onClick={onNext}
              disabled={!playerState.currentTrack}
              title="Next"
            >
              <SkipForward size={20} />
            </button>
            
            <button
              className={`btn btn-icon control-btn ${playerState.repeatMode !== 'none' ? 'active' : ''}`}
              onClick={onToggleRepeat}
              title={`Repeat: ${playerState.repeatMode}`}
            >
              <RepeatIcon size={18} />
            </button>
          </div>

          <div className="progress-container">
            <span className="time-display">{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              className="progress-slider"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="progress-thumb" />
                </div>
              </div>
            </div>
            <span className="time-display">{formatTime(playerState.duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="volume-controls">
          <div className="volume-section">
            <button
              className="btn btn-icon volume-btn"
              onClick={onToggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              title={playerState.isMuted ? 'Unmute' : 'Mute'}
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            
            <div
              className={`volume-slider-container ${showVolumeSlider ? 'visible' : ''}`}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <div
                ref={volumeRef}
                className="volume-slider"
                onClick={handleVolumeChange}
              >
                <div className="volume-track">
                  <div
                    className="volume-fill"
                    style={{ width: `${playerState.volume * 100}%` }}
                  >
                    <div className="volume-thumb" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="btn btn-icon">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};