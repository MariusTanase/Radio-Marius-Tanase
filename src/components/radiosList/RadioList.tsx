import React, { useEffect, useRef, useState } from 'react';
import { radios } from './radios';
import { setRadio, setRadioName, startRadio, setRadioGenre, setRadioImage } from '../../utils/radio';
import './RadioList.css';
import { RadioItem, ToggleUIProps } from '../../types/types';
import CategoryFilter from '../Categories/CategoryFilter';

/**
 * Component that displays a list of radio stations that can be selected
 */
const RadioList: React.FC<ToggleUIProps> = ({ toggleUI }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const radioPlaylistContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (radioPlaylistContainer.current) {
      if (toggleUI) {
        radioPlaylistContainer.current.classList.add('hidden');
      } else {
        radioPlaylistContainer.current.classList.remove('hidden');
      }
    }
  }, [toggleUI]);

  /**
   * Change the current radio station
   * @param radio The radio station to change to
   */
  const changeRadio = (radio: RadioItem): void => {
    const { url, title, genre, image } = radio;

    setRadio(url);
    setRadioName(title);
    setRadioGenre(genre || '');
    setRadioImage(image, title);
    startRadio();
  };

  /**
   * Handle category change
   * @param category The selected category
   */
  const handleCategoryChange = (category: string): void => {
    setActiveCategory(category);
  };

  /**
   * Filter radios by active category
   */
  const filteredRadios = activeCategory === 'All' 
    ? radios 
    : radios.filter(radio => (radio.genre || 'Uncategorized') === activeCategory);

  return (
    <>
      <CategoryFilter 
        radios={radios} 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        toggleUI={toggleUI}
      />
      
      <div ref={radioPlaylistContainer} className="radios-container" aria-label="Radio stations list">
        {filteredRadios.length === 0 ? (
          <div className="no-radios-message">
            No radio stations found in this category.
          </div>
        ) : (
          <ul className="radios-list">
            {filteredRadios.map((radio) => {
              const { id, title, genre } = radio;
              return (
                <li 
                  key={id} 
                  className="radio-element" 
                  onClick={() => changeRadio(radio)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play ${title} - ${genre || ''} radio`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      changeRadio(radio);
                    }
                  }}
                >
                  <div className="radio-image">
                    <img src={radio.image} alt="" aria-hidden="true" />
                  </div>
                  <div className="radio-info">
                    <h4>{title}</h4>
                    {genre && <p className="radio-genre">{genre}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default RadioList;