import React, { useEffect, useMemo, useState } from 'react';
import './background.css';
import { initBackground } from '../../utils/backgroundGeneration';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const Background = () => {
  const [init, setInit] = useState(false);
  const [isParticlesEnabled, setIsParticlesEnabled] = useState(() => {
    // Initialize from localStorage or default to true
    return localStorage.getItem('particlesEnabled') !== 'false';
  });

  // Initialize background once component mounts
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initBackground();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize the particles engine only once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Listen for changes to the 'particlesEnabled' setting in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'particlesEnabled') {
        setIsParticlesEnabled(e.newValue !== 'false');
      }
    };

    // Direct localStorage check for changes from other components
    const checkLocalStorage = () => {
      const currentSetting = localStorage.getItem('particlesEnabled') !== 'false';
      if (currentSetting !== isParticlesEnabled) {
        setIsParticlesEnabled(currentSetting);
      }
    };

    // Set up listeners and interval checks
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(checkLocalStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isParticlesEnabled]);

  // Handler for when particles container is loaded
  const particlesLoaded = async (container?: Container): Promise<void> => {
    if (container) {
      console.log("Particles container loaded");
    }
  };

  // Particles configuration
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false, // Important! Don't use fullScreen mode
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: false,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 2, // Slowed down for smoother effect
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 }, // Randomized opacity
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
          }
        },
        shape: {
          type: "circle", // Changed to circle for better performance
        },
        size: {
          value: { min: 1, max: 5 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.1,
          }
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="background" id="background" data-background>
      <div className="background-overlay"></div>
      
      {/* Only render the Particles component when enabled */}
      {init && isParticlesEnabled && (
        <div className="particles-container">
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default Background;