import React, { useEffect } from 'react';
import './CategoryFilter.css';
import { RadioItem } from '../../types/types';

interface CategoryFilterProps {
  radios: RadioItem[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  toggleUI: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  radios, 
  activeCategory, 
  onCategoryChange,
  toggleUI
}) => {
    let radioGenreContainer = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (radioGenreContainer.current) {
        console.log('toggleUI', toggleUI);
        if (toggleUI) {
          radioGenreContainer.current.classList.add('hidden');
        } else {
          radioGenreContainer.current.classList.remove('hidden');
        }
      }
    }, [toggleUI]);

  // Extract unique genres from radios
  const getUniqueGenres = (): string[] => {
    const genres = radios
      .map(radio => radio.genre || 'Uncategorized')
      .filter(Boolean);
    
    // Get unique genres
    const uniqueGenres = Array.from(new Set(genres));
    
    // Sort genres alphabetically
    return ['All', ...uniqueGenres.sort()];
  };

  const genres = getUniqueGenres();

  return (
    <div className="category-filter" ref={radioGenreContainer}>
      <h3 className="category-filter__title">Genres</h3>
      <ul className="category-filter__list">
        {genres.map(genre => (
          <li 
            key={genre} 
            className={`category-filter__item ${activeCategory === genre ? 'category-filter__item--active' : ''}`}
            onClick={() => onCategoryChange(genre)}
          >
            {genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;