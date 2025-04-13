import React, { useEffect, useState } from 'react';
import './ThemeMenu.css';

export interface ThemeOption {
  name: string;
}

export interface ThemeMenuProps {
  content: Record<string, ThemeOption>;
}

export const ThemeMenu: React.FC<ThemeMenuProps> = ({ content }) => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') ?? 'blue';
  });

  const handleThemeChange = (newTheme: string): void => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="theme-container">
      <h5 className="settings-category__title">Select Theme</h5>
      <div className="theme-container__items">
        {Object.entries(content).map(([key, themeOption]) => (
          <button
            key={key}
            className={`theme-item ${theme === key.toLowerCase() ? 'theme-item--active' : ''}`}
            onClick={() => handleThemeChange(key.toLowerCase())}
            aria-label={`Set theme to ${key}`}
          >
            <span className="theme-item__name">{key}</span>
          </button>
        ))}
      </div>
    </div>
  );
};