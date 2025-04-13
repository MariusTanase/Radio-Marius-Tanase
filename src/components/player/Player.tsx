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
  const [state, setState] = useState({
    radioId: 0,
    audioIsRunning: false,
    volume: 0.1,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainer = useRef<HTMLDivElement>(null);

  // Handle space key for play/pause
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault(); // Prevent page scrolling
        state.audioIsRunning ? pauseAudio() : playAudio();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.audioIsRunning]);

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

  // Initialize volume and radio on component mount
  useEffect(() => {
    volumeControl(0.1);
    randomRadio();

    // Cleanup on component unmount
    return () => {
      stopRadio();
    };
  }, []);

  const playAudio = (): void => {
    startRadio();
    setState((prevState) => ({ ...prevState, audioIsRunning: true }));
  };

  const pauseAudio = (): void => {
    stopRadio();
    setState((prevState) => ({ ...prevState, audioIsRunning: false }));
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

  const playRadio = (id: number): void => {
    if (id >= 0 && id < list.length) {
      changeRadio(id);
      playAudio();
      setState((prevState) => ({ ...prevState, radioId: id }));
    }
  };

  const randomRadio = (): void => {
    const randomId = Math.floor(Math.random() * list.length);
    playRadio(randomId);
  };

  const previousRadio = (): void => {
    let { radioId } = state;
    radioId = radioId === 0 ? list.length - 1 : radioId - 1;
    playRadio(radioId);
  };

  const nextRadio = (): void => {
    let { radioId } = state;
    radioId = radioId === list.length - 1 ? 0 : radioId + 1;
    playRadio(radioId);
  };

  const volumeControl = (value: number): void => {
    setRadioVolume(value);
    setState((prevState) => ({ ...prevState, volume: value }));
  };

  // Helper function to determine volume icon
  const getVolumeIcon = () => {
    if (state.volume === 0) return faVolumeXmark;
    if (state.volume < 0.5) return faVolumeLow;
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
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          <button 
            className="control-button play" 
            onClick={state.audioIsRunning ? pauseAudio : playAudio}
            aria-label={state.audioIsRunning ? "Pause" : "Play"}
          >
            <FontAwesomeIcon icon={state.audioIsRunning ? faPause : faPlay} />
          </button>

          <button 
            className="control-button next" 
            onClick={nextRadio}
            aria-label="Next station"
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className="volume-control">
          <button 
            className="control-button shuffle" 
            onClick={randomRadio}
            aria-label="Random station"
          >
            <FontAwesomeIcon icon={faShuffle} />
          </button>
          
          <div className="volume-slider-container">
            <button 
              className="control-button volume-icon" 
              onClick={() => volumeControl(state.volume === 0 ? 0.5 : 0)}
              aria-label={state.volume === 0 ? "Unmute" : "Mute"}
            >
              <FontAwesomeIcon icon={getVolumeIcon()} />
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              className="volume-slider"
              value={state.volume}
              onChange={(e) => volumeControl(Number(e.target.value))}
              aria-label="Volume control"
            />
          </div>
        </div>
      </div>

      <div className="now-playing">
        Now Playing: <span className="current-radio">{list[state.radioId]?.title || ''}</span>
      </div>

      <audio ref={audioRef} src="" />
    </div>
  );
};

export default Player;