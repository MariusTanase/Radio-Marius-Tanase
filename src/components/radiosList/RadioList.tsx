import React, { useEffect, useRef } from 'react';
import { radios } from '../../radios';
import { setRadio, setRadioName, startRadio, setRadioGenre, setRadioImage } from '../../utils/radio';
import './RadioList.css';
import { RadioObject, ToggleUIProps, RadioItem } from '../../types/types';

/**
 * Component that displays a list of radio stations that can be selected
 */
const RadioList: React.FC<ToggleUIProps> = ({ toggleUI }) => {
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
  const changeRadio = (radio: RadioObject): void => {
    const { url, title, genre, image } = radio;

    setRadio(url);
    setRadioName(title);
    setRadioGenre(genre);
    setRadioImage(image, title);
    startRadio();
  };

  return (
    <div ref={radioPlaylistContainer} className="radios-container" aria-label="Radio stations list">
      <ul className="radios-list">
        {radios.map((radio: RadioObject) => {
          const { id, title, genre } = radio;
          return (
            <li 
              key={id} 
              className="radio-element" 
              onClick={() => changeRadio(radio)}
              tabIndex={0}
              role="button"
              aria-label={`Play ${title} - ${genre} radio`}
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
                <p className="radio-genre">{genre}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RadioList;