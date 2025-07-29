import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { Track, PlayerState } from '../types/music';

export const useAudio = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isShuffling: false,
    repeatMode: 'none',
    queue: [],
    currentIndex: -1,
  });

  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateCurrentTime = useCallback(() => {
    if (soundRef.current && playerState.isPlaying) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: soundRef.current?.seek() || 0
      }));
    }
  }, [playerState.isPlaying]);

  useEffect(() => {
    if (playerState.isPlaying && !intervalRef.current) {
      intervalRef.current = setInterval(updateCurrentTime, 1000);
    } else if (!playerState.isPlaying && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playerState.isPlaying, updateCurrentTime]);

  const loadTrack = useCallback((track: Track) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    const sound = new Howl({
      src: [track.url],
      html5: true,
      volume: playerState.volume,
      onload: () => {
        setPlayerState(prev => ({
          ...prev,
          duration: sound.duration(),
          currentTrack: track,
        }));
      },
      onplay: () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }));
      },
      onpause: () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: true,
        }));
      },
      onstop: () => {
        setPlayerState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
        }));
      },
      onend: () => {
        handleTrackEnd();
      },
      onerror: (id, error) => {
        console.error('Audio error:', error);
      }
    });

    soundRef.current = sound;
  }, [playerState.volume]);

  const play = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setPlayerState(prev => ({
        ...prev,
        currentTime: time,
      }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(clampedVolume);
    setPlayerState(prev => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (playerState.isMuted) {
      Howler.volume(playerState.volume);
      setPlayerState(prev => ({ ...prev, isMuted: false }));
    } else {
      Howler.volume(0);
      setPlayerState(prev => ({ ...prev, isMuted: true }));
    }
  }, [playerState.isMuted, playerState.volume]);

  const handleTrackEnd = useCallback(() => {
    const { repeatMode, currentIndex, queue } = playerState;
    
    if (repeatMode === 'one') {
      seek(0);
      play();
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const nextTrack = queue[nextIndex];
      setPlayerState(prev => ({ ...prev, currentIndex: nextIndex }));
      loadTrack(nextTrack);
      setTimeout(() => play(), 100);
    } else if (repeatMode === 'all' && queue.length > 0) {
      const firstTrack = queue[0];
      setPlayerState(prev => ({ ...prev, currentIndex: 0 }));
      loadTrack(firstTrack);
      setTimeout(() => play(), 100);
    }
  }, [playerState, seek, play, loadTrack]);

  const playNext = useCallback(() => {
    const { currentIndex, queue, isShuffling } = playerState;
    
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    const nextTrack = queue[nextIndex];
    setPlayerState(prev => ({ ...prev, currentIndex: nextIndex }));
    loadTrack(nextTrack);
    setTimeout(() => play(), 100);
  }, [playerState, loadTrack, play]);

  const playPrevious = useCallback(() => {
    const { currentIndex, queue } = playerState;
    
    if (queue.length === 0) return;

    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const prevTrack = queue[prevIndex];
    setPlayerState(prev => ({ ...prev, currentIndex: prevIndex }));
    loadTrack(prevTrack);
    setTimeout(() => play(), 100);
  }, [playerState, loadTrack, play]);

  const setQueue = useCallback((tracks: Track[], startIndex: number = 0) => {
    setPlayerState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
    }));

    if (tracks.length > 0 && startIndex < tracks.length) {
      loadTrack(tracks[startIndex]);
    }
  }, [loadTrack]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isShuffling: !prev.isShuffling,
    }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => {
      const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
      const currentModeIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentModeIndex + 1) % modes.length];
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setPlayerState(prev => {
      const newQueue = prev.queue.filter((_, i) => i !== index);
      const newCurrentIndex = index <= prev.currentIndex ? 
        Math.max(0, prev.currentIndex - 1) : prev.currentIndex;
      
      return {
        ...prev,
        queue: newQueue,
        currentIndex: newCurrentIndex,
      };
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    playerState,
    play,
    pause,
    stop,
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
    loadTrack,
  };
};