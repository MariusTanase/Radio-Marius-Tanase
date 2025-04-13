import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faForward, faBackward, faPlay, faPause, faVolumeHigh, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { startRadio, stopRadio, setRadio, setRadioGenre, setRadioImage, setRadioName, setRadioVolume } from '../../utils/radio';
import { PlayerProps, RadioItem } from '../../types/types';

/**
 * Audio player component for streaming radio stations
 */
const Player: React.FC<PlayerProps> = ({ list, toggleUI }) => {
  const [radioId, setRadioId] = useState<number>(0);
  const [audioIsRunning, setAudioIsRunning] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.1);
  const [currentMetadata, setCurrentMetadata] = useState<string>('');
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainer = useRef<HTMLDivElement>(null);
  const metadataIntervalRef = useRef<number | null>(null);

  // Handle space key for play/pause
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat && 
          !(event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement)) {
        event.preventDefault(); // Prevent page scrolling
        audioIsRunning ? pauseAudio() : playAudio();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [audioIsRunning]);

  // Handle UI visibility toggle
  useEffect(() => {
    if (playerContainer.current) {
      if (toggleUI) {
        playerContainer.current.classList.add('hidden');
      } else {
        playerContainer.current.classList.remove('hidden');
      }
    }
  }, [toggleUI]);

  // Initialize player
  useEffect(() => {
    volumeControl(0.1);
    
    // Initialize with a random radio
    const initialRadioId = Math.floor(Math.random() * list.length);
    changeRadioAndPlay(initialRadioId);
    
    // Cleanup on component unmount
    return () => {
      stopRadio();
      if (metadataIntervalRef.current) {
        window.clearInterval(metadataIntervalRef.current);
        metadataIntervalRef.current = null;
      }
    };
  }, []);

  // Update currentMetadata whenever radioId changes
  useEffect(() => {
    if (list[radioId]) {
      setCurrentMetadata(list[radioId].title);
    }
  }, [radioId, list]);

  const playAudio = (): void => {
    setIsLoadingStream(true);
    
    startRadio()
      .then(success => {
        if (success) {
          setAudioIsRunning(true);
        }
        setIsLoadingStream(false);
      })
      .catch(() => {
        setIsLoadingStream(false);
      });
  };

  const pauseAudio = (): void => {
    stopRadio();
    setAudioIsRunning(false);
  };

  const changeRadio = (id: number): void => {
    const radio = list[id];
    if (radio) {
      setRadio(radio.url);
      setRadioName(radio.title);
      setRadioGenre(radio.artist || radio.genre || '');
      setRadioImage(radio.image, radio.title, radio.genre || '');
    }
  };

  const changeRadioAndPlay = (id: number): void => {
    if (id >= 0 && id < list.length) {
      setIsLoadingStream(true);
      
      // Update radioId state
      setRadioId(id);
      
      // If already playing, stop first
      if (audioIsRunning) {
        stopRadio();
      }
      
      // Change the radio
      changeRadio(id);
      
      // Small delay to allow audio to properly change source
      setTimeout(() => {
        playAudio();
      }, 100);
    }
  };

  const randomRadio = (): void => {
    const randomId = Math.floor(Math.random() * list.length);
    changeRadioAndPlay(randomId);
  };

  const previousRadio = (): void => {
    const prevId = radioId === 0 ? list.length - 1 : radioId - 1;
    changeRadioAndPlay(prevId);
  };

  const nextRadio = (): void => {
    const nextId = radioId === list.length - 1 ? 0 : radioId + 1;
    changeRadioAndPlay(nextId);
  };

  const volumeControl = (value: number): void => {
    setRadioVolume(value);
    setVolume(value);
  };

  // Helper function to determine volume icon
  const getVolumeIcon = () => {
    if (volume === 0) return faVolumeXmark;
    if (volume < 0.5) return faVolumeLow;
    return faVolumeHigh;
  };

  return (
    <div ref={playerContainer} className="audio-player" role="region" aria-label="Audio player">
      <div className="track-info">
        <img className="artwork" alt="" aria-hidden="true" />
        <h2 className="title"></h2>
        <h3 className="genre"></h3>
      </div>
      
      <div className="controls">
        <div className="controls-buttons">
          <button 
            className="control-button previous" 
            onClick={previousRadio}
            aria-label="Previous station"
            disabled={isLoadingStream}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          <button 
            className="control-button play" 
            onClick={audioIsRunning ? pauseAudio : playAudio}
            aria-label={audioIsRunning ? "Pause" : "Play"}
            disabled={isLoadingStream}
          >
            {isLoadingStream ? (
              <div className="loading-spinner"></div>
            ) : (
              <FontAwesomeIcon icon={audioIsRunning ? faPause : faPlay} />
            )}
          </button>

          <button 
            className="control-button next" 
            onClick={nextRadio}
            aria-label="Next station"
            disabled={isLoadingStream}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className="volume-control">
          <button 
            className="control-button shuffle" 
            onClick={randomRadio}
            aria-label="Random station"
            disabled={isLoadingStream}
          >
            <FontAwesomeIcon icon={faShuffle} />
          </button>
          
          <div className="volume-slider-container">
            <button 
              className="control-button volume-icon" 
              onClick={() => volumeControl(volume === 0 ? 0.5 : 0)}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              <FontAwesomeIcon icon={getVolumeIcon()} />
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              className="volume-slider"
              value={volume}
              onChange={(e) => volumeControl(Number(e.target.value))}
              aria-label="Volume control"
            />
          </div>
        </div>
      </div>

      <div className="now-playing">
        <div className="now-playing-label">Now Playing:</div> 
        <div className="current-radio">{currentMetadata}</div>
      </div>

      <audio 
        ref={audioRef} 
        onError={(e) => {
          console.error('Audio error:', e);
          setIsLoadingStream(false);
        }}
      />
    </div>
  );
};

export default Player;