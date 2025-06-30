'use client';

import { useState, useEffect } from 'react';
import { Volume2, Pause, Play } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  className?: string;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  asDiv?: boolean; // Render as div to avoid nested buttons
}

export function TextToSpeech({ 
  text, 
  className = '', 
  variant = 'icon',
  size = 'md',
  asDiv = false
}: TextToSpeechProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check if browser supports speech synthesis
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = () => {
    if (!isSupported || !text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };



  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  const getIcon = () => {
    if (isPlaying && !isPaused) {
      return <Pause className={getIconSize()} />;
    } else if (isPlaying && isPaused) {
      return <Play className={getIconSize()} />;
    } else {
      return <Volume2 className={getIconSize()} />;
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors ${className}`}
        title={isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Read aloud'}
        disabled={!text.trim()}
      >
        {getIcon()}
        <span className="hidden sm:inline">
          {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Listen'}
        </span>
      </button>
    );
  }

  const buttonProps = {
    onClick: handleClick,
    className: `p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted cursor-pointer ${className}`,
    title: isPlaying ? (isPaused ? 'Resume reading' : 'Pause reading') : 'Read aloud',
  };

  if (asDiv) {
    return (
      <div
        {...buttonProps}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={isPlaying ? (isPaused ? 'Resume reading' : 'Pause reading') : 'Read aloud'}
      >
        {getIcon()}
      </div>
    );
  }

  return (
    <button
      {...buttonProps}
      disabled={!text.trim()}
    >
      {getIcon()}
    </button>
  );
} 