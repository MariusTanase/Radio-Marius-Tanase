/**
 * Background generation utility using Pexels API
 * Note: You will need to replace 'YOUR_PEXELS_API_KEY' with your actual Pexels API key
 * Get your free API key at: https://www.pexels.com/api/
 */

// Cache for storing previously fetched background URLs
interface BackgroundCache {
  [key: string]: string[];
}

const backgroundCache: BackgroundCache = {};
const PEXELS_API_KEY = 'IO2htYRWcHhia6rDe0glYURIlxLZusz3XTBoZqMHWg5wudusESFF40Vx';

/**
 * Gets a random background image based on the theme
 * @param theme - The theme to search for
 * @returns Promise resolving when background is set
 */
const generateImage = async (theme: string): Promise<void> => {
  try {
    // Check if we have cached images for this theme
    if (!backgroundCache[theme] || backgroundCache[theme].length === 0) {
      await fetchAndCacheImages(theme);
    }

    // Get a random image from the cache
    const cachedImages = backgroundCache[theme];
    const randomIndex = Math.floor(Math.random() * cachedImages.length);
    const imageUrl = cachedImages[randomIndex];

    // Set the background image
    setBackgroundImage(imageUrl);

    // Save preference to localStorage
    saveBackgroundPreference(theme, imageUrl);

  } catch (error) {
    console.error('Failed to generate background:', error);

    // Fallback to a default background if error occurs
    setDefaultBackground();

    // Re-throw the error for the component to handle
    throw error;
  }
};

/**
 * Fetches images from Pexels API and caches them
 * @param theme - The theme to search for
 */
const fetchAndCacheImages = async (theme: string): Promise<void> => {
  try {
    // Option 1: Pexels API (recommended)
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(theme)}&orientation=landscape`, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      // Cache the image URLs
      backgroundCache[theme] = data.photos.map((photo: any) => photo.src.original);
    } else {
      // If no images found, set an empty array
      backgroundCache[theme] = [];
      throw new Error(`No images found for theme: ${theme}`);
    }
  } catch (error) {
    console.error('Error fetching from Pexels API:', error);

    // Option 2: Fallback to Picsum (no API key needed)
    try {
      const pics = [];
      for (let i = 0; i < 5; i++) {
        // Picsum provides random images, we'll add some randomness to the URLs
        pics.push(`https://picsum.photos/1920/1080?random=${Math.random()}`);
      }
      backgroundCache[theme] = pics;
    } catch (fallbackError) {
      console.error('Fallback image source also failed:', fallbackError);
      throw error; // Rethrow the original error
    }
  }
};

/**
 * Sets the background image of the page
 * @param url - The URL of the image to set as background
 */
const setBackgroundImage = (url: string): void => {
  const backgroundElement = document.querySelector('.background') as HTMLElement;

  if (backgroundElement) {
    // Preload the image first to avoid flickering
    const img = new Image();
    img.onload = () => {
      backgroundElement.style.backgroundImage = `url(${url})`;
      backgroundElement.classList.add('background-fade-in');

      // Remove the animation class after it completes
      setTimeout(() => {
        backgroundElement.classList.remove('background-fade-in');
      }, 1000);
    };

    img.src = url;
  } else {
    console.error('Background element not found in the DOM');
  }
};

/**
 * Saves the current background preference to localStorage
 * @param theme - The selected theme
 * @param imageUrl - The URL of the current background
 */
const saveBackgroundPreference = (theme: string, imageUrl: string): void => {
  try {
    localStorage.setItem('backgroundTheme', theme);
    localStorage.setItem('backgroundUrl', imageUrl);
  } catch (error) {
    console.error('Could not save background preference:', error);
  }
};

/**
 * Loads the saved background preference from localStorage
 * @returns The saved theme and URL, or null if none exists
 */
const loadBackgroundPreference = (): { theme: string; url: string } | null => {
  try {
    const theme = localStorage.getItem('backgroundTheme');
    const url = localStorage.getItem('backgroundUrl');

    if (theme && url) {
      return { theme, url };
    }

    return null;
  } catch (error) {
    console.error('Could not load background preference:', error);
    return null;
  }
};

/**
 * Sets a default background if no other is available
 */
const setDefaultBackground = (): void => {
  // Try multiple selectors to find the background element
  const backgroundElement =
    document.querySelector('.background') ||
    document.getElementById('background') ||
    document.querySelector('[data-background]');

  if (backgroundElement) {
    // Use a gradient as fallback
    (backgroundElement as HTMLElement).style.backgroundImage = 'linear-gradient(to right, #4b6cb7, #182848)';
  }
};

/**
 * Initializes the background on page load
 */
const initBackground = (): void => {
  const savedPreference = loadBackgroundPreference();

  if (savedPreference) {
    setBackgroundImage(savedPreference.url);
  } else {
    // Set default background
    setDefaultBackground();
  }
};

// Initialize background when module is loaded
if (typeof window !== 'undefined') {
  // Wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackground);
  } else {
    // DOM is already ready, initialize now
    initBackground();
  }
}

export { generateImage, initBackground };