import React, { useState } from 'react';
import './BackgroundMenu.css';
import { generateImage } from '../../utils/backgroundGeneration';

// Define the available background themes
const backgroundThemes = [
  { id: 'mountain', name: 'Mountain', icon: '🏔️' },
  { id: 'beach', name: 'Beach', icon: '🏝️' },
  { id: 'sky', name: 'Sky', icon: '☁️' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'cozy', name: 'Cozy', icon: '🛋️' },
  { id: 'japan', name: 'Japan', icon: '🗾' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'dog', name: 'Dog', icon: '🐶' },
  { id: 'city', name: 'City', icon: '🏙️' },
  { id: 'space', name: 'Space', icon: '🌌' }
];

interface BackgroundTheme {
  id: string;
  name: string;
  icon: string;
}

const BackgroundMenu: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBackgroundChange = async (theme: BackgroundTheme): Promise<void> => {
    setIsLoading(true);
    setActiveTheme(theme.id);
    
    try {
      await generateImage(theme.id);
    } catch (error) {
      console.error('Failed to generate background:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background-container">
      <h5 className="settings-category__title">Select Background</h5>
      
      {isLoading && (
        <div className="background-loading">
          <div className="background-loading__spinner"></div>
          <span>Loading new background...</span>
        </div>
      )}
      
      <div className="background-container__items">
        {backgroundThemes.map((theme) => (
          <button
            key={theme.id}
            className={`background-item ${activeTheme === theme.id ? 'background-item--active' : ''}`}
            onClick={() => handleBackgroundChange(theme)}
            aria-label={`Set background to ${theme.name}`}
          >
            <span className="background-item__icon">{theme.icon}</span>
            <span className="background-item__name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundMenu;