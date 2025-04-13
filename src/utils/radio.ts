/**
 * Utility functions for controlling radio playback and UI updates
 */

/**
 * Sets the source URL for the audio element
 * @param radio - URL of the radio stream
 */
function setRadio(radio: string): void {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
        audioElement.src = radio;
    } else {
        console.error('Audio element not found in the DOM');
    }
}

/**
 * Sets the radio station name in the UI
 * @param radioName - The name of the radio station
 */
function setRadioName(radioName: string): void {
    const titleElement = document.querySelector('.title') as HTMLElement;
    if (titleElement) {
        titleElement.textContent = radioName;
    } else {
        console.error('Title element not found in the DOM');
    }
}

/**
 * Sets the radio station image and alt text
 * @param radioImage - URL of the radio station image
 * @param radioName - Name of the radio station (used for alt text)
 * @param radioGenre - Optional genre information
 */
function setRadioImage(radioImage: string, radioName: string, radioGenre: string = ''): void {
    const artworkElement = document.querySelector('.artwork') as HTMLImageElement;
    if (artworkElement) {
        artworkElement.src = radioImage;

        // Create more descriptive alt text when genre is available
        const altText = radioGenre
            ? `${radioName} - ${radioGenre} radio station`
            : `${radioName} radio station`;

        artworkElement.alt = altText;

        // Preload image to avoid flickering
        const img = new Image();
        img.src = radioImage;
    } else {
        console.error('Artwork element not found in the DOM');
    }
}

/**
 * Starts playing the radio
 * @returns Promise that resolves when playback starts
 */
async function startRadio(): Promise<boolean> {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (!audioElement) {
        console.error('Audio element not found in the DOM');
        return false;
    }

    try {
        await audioElement.play();
        console.log('Audio playing...');

        // Add active class to indicate playing state
        document.querySelector('.audio-player')?.classList.add('is-playing');

        return true;
    } catch (error) {
        console.error('Failed to play audio:', error);
        return false;
    }
}

/**
 * Stops radio playback
 */
function stopRadio(): void {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
        audioElement.pause();

        // Remove active class when paused
        document.querySelector('.audio-player')?.classList.remove('is-playing');

        console.log('Audio paused...');
    } else {
        console.error('Audio element not found in the DOM');
    }
}

/**
 * Sets the radio genre information in the UI
 * @param genre - The genre of the radio station
 */
function setRadioGenre(genre: string): void {
    const genreElement = document.querySelector('.genre') as HTMLElement;
    if (genreElement) {
        // Only add "Genre:" prefix if there's actual genre text
        genreElement.textContent = genre ? `Genre: ${genre}` : '';
    } else {
        console.error('Genre element not found in the DOM');
    }
}

/**
 * Sets the volume of the audio element
 * @param volume - Volume level (0 to 1)
 * @returns The volume level that was set
 */
function setRadioVolume(volume: number): number {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;

    if (!audioElement) {
        console.error('Audio element not found in the DOM');
        return 0;
    }

    // Ensure volume is within valid range
    const safeVolume = Math.max(0, Math.min(1, volume));

    audioElement.volume = safeVolume;

    // Update volume attribute for styling purposes
    document.documentElement.style.setProperty('--current-volume', safeVolume.toString());

    return safeVolume;
}

/**
 * Gets the current playback state
 * @returns True if audio is currently playing, false otherwise
 */
function isRadioPlaying(): boolean {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (!audioElement) {
        return false;
    }

    return !audioElement.paused;
}

/**
 * Gets the current volume level
 * @returns Current volume (0 to 1)
 */
function getRadioVolume(): number {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (!audioElement) {
        return 0;
    }

    return audioElement.volume;
}

export {
    setRadio,
    setRadioName,
    setRadioImage,
    startRadio,
    stopRadio,
    setRadioGenre,
    setRadioVolume,
    isRadioPlaying,
    getRadioVolume
};