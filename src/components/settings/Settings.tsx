import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import './Settings.css';
import { faGear, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ThemeMenu } from '@/components/ThemeMenu/ThemeMenu';
import BackgroundMenu from '@/components/BackgroundMenu/BackgroundMenu';
import CustomButton from '../reusableComponents/CustomButton';
import { SettingsProps } from '../../types/types';

const themeContent = {
  Light: { name: 'Light' },
  Dark: { name: 'Dark' },
  Crimson: { name: 'Crimson' },
  Blue: { name: 'Blue' },
};

const Settings = ({ toggleUI }: SettingsProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isUIHidden, setUIHidden] = useState(false);
  const [areParticlesEnabled, setAreParticlesEnabled] = useState(() => {
    // Initialize from localStorage or default to true
    const savedPreference = localStorage.getItem('particlesEnabled');
    return savedPreference !== null ? savedPreference === 'true' : true;
  });

  // Effect to save particles preference whenever it changes
  useEffect(() => {
    localStorage.setItem('particlesEnabled', String(areParticlesEnabled));
    
    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, [areParticlesEnabled]);

  const showMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleUIVisibility = () => {
    setUIHidden(!isUIHidden);
    toggleUI();
  };

  const toggleParticles = () => {
    setAreParticlesEnabled(!areParticlesEnabled);
  };

  return (
    <div className={`settings-container ${isMenuOpen ? "noBackground" : ''}`}>
      <button 
        className={`settings-button ${isMenuOpen ? 'hidden' : ''}`} 
        onClick={showMenu}
        aria-label="Open settings"
      >
        <FontAwesomeIcon icon={faGear} className="spin" />
      </button>
      <div className={`settings-menu ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-label="Settings">
        <div className="settings-menu-wrapper">
          <ThemeMenu content={themeContent} />
          <BackgroundMenu />
          
          <div className="settings-section">
            <h5 className='settings-category__title'>
              Extra Settings
            </h5>
            <div className="settings-options">
              <CustomButton 
                title={!isUIHidden ? "Hide UI" : "Show UI"} 
                className="settings-button__option" 
                action={toggleUIVisibility}
                ariaLabel={!isUIHidden ? "Hide user interface" : "Show user interface"}
              />
              <CustomButton 
                title={areParticlesEnabled ? "Disable Particles" : "Enable Particles"} 
                className="settings-button__option" 
                action={toggleParticles}
                ariaLabel={areParticlesEnabled ? "Disable background particles" : "Enable background particles"}
              />
            </div>
          </div>
        </div>
          <CustomButton 
            title={<FontAwesomeIcon icon={faTimes} />}
            className="settings-button__close-menu" 
            action={closeMenu} 
            ariaLabel="Close settings menu"
          />
      </div>
    </div>
  );
};

export default Settings;