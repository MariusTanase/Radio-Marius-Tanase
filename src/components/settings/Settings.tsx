import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import './Settings.css';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { ThemeMenu, ThemeOption } from '../ThemeMenu/ThemeMenu';
import BackgroundMenu from '../BackgroundMenu/BackgroundMenu';
import CustomButton from '../reusableComponents/CustomButton';
import { SettingsProps } from '../../types/types';

const themeContent: Record<string, ThemeOption> = {
  Light: { name: 'Light' },
  Dark: { name: 'Dark' },
  Crimson: { name: 'Crimson' },
  Blue: { name: 'Blue' },
};

const Settings: React.FC<SettingsProps> = ({ toggleUI }) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isUIHidden, setUIHidden] = useState<boolean>(false);

  const showMenu = (): void => {
    setMenuOpen(true);
  };

  const closeMenu = (): void => {
    setMenuOpen(false);
  };

  const toggleUIVisibility = (): void => {
    setUIHidden(!isUIHidden);
    toggleUI();
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
      
      <div className={`settings-menu ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-label="Settings menu">
        <div className="settings-menu-wrapper">
          <ThemeMenu content={themeContent} />
          <BackgroundMenu />
          <div className="settings-section">
            <h5 className="settings-category__title">Extra</h5>
            <CustomButton 
              title={!isUIHidden ? "Hide UI" : "Show UI"} 
              className="settings-button__close" 
              action={toggleUIVisibility}
            />
          </div>
        </div>
        <CustomButton 
          title="X" 
          className="settings-button__close-menu" 
          action={closeMenu} 
          aria-label="Close settings menu"
        />
      </div>
    </div>
  );
};

export default Settings;