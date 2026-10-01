import React from 'react';

interface DealLogoProps {
  variant?: 'full' | 'compact' | 'monogram' | 'horizontal';
  className?: string;
  theme?: 'dark' | 'light' | 'original';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DealLogo: React.FC<DealLogoProps> = ({
  variant = 'full',
  className = '',
  theme = 'original',
  size = 'md'
}) => {
  // Color tokens
  const strokeColor = theme === 'light' ? '#FAF7F2' : '#54483C';
  const textColor = theme === 'light' ? '#FAF7F2' : '#3F3832';
  const subtextColor = theme === 'light' ? '#D8CEC2' : '#756A60';
  const shadowColor = theme === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(84,72,60,0.35)';

  const sizeClasses = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-36'
  };

  if (variant === 'monogram') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 120 120"
          className={sizeClasses[size] || 'h-16'}
          style={{ width: 'auto' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="deal-carve" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor={shadowColor} />
            </filter>
          </defs>
          <g filter="url(#deal-carve)">
            {/* Architectural L Stem & Serifs */}
            <path
              d="M 40 26 H 55 V 30 H 49 V 84 H 74 V 88 H 40 Z"
              fill={strokeColor}
            />
            {/* Intertwined D Arch with deep carved drop */}
            <path
              d="M 54 38 C 72 38 86 48 86 64 C 86 80 72 90 54 90 C 53 90 52 90 51 89.8 V 83 C 68 83 78 75 78 64 C 78 53 68 45 51 45 V 38.2 C 52 38.1 53 38 54 38 Z"
              fill={strokeColor}
            />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        {/* Monogram */}
        <svg
          viewBox="0 0 120 120"
          className="h-10 w-10 flex-shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 38 24 H 54 V 28 H 48 V 85 H 75 V 89 H 38 Z"
            fill={strokeColor}
          />
          <path
            d="M 53 37 C 72 37 87 47 87 63.5 C 87 80 72 90 53 90 C 52 90 50.8 90 50 89.8 V 82.5 C 67 82.5 78 74.5 78 63.5 C 78 52.5 67 44.5 50 44.5 V 37.2 C 51 37.1 52 37 53 37 Z"
            fill={strokeColor}
          />
        </svg>

        <div className="flex flex-col">
          <span
            className="font-serif-arch text-lg font-bold tracking-[0.28em] leading-none"
            style={{ color: textColor }}
          >
            DEAL
          </span>
          <span
            className="text-[8.5px] uppercase tracking-[0.22em] font-medium mt-1"
            style={{ color: subtextColor }}
          >
            Design · Engineering · Architecture · Living
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <svg
          viewBox="0 0 120 100"
          className="h-12 w-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 40 18 H 55 V 22 H 49 V 74 H 74 V 78 H 40 Z"
            fill={strokeColor}
          />
          <path
            d="M 54 29 C 72 29 86 38 86 53 C 86 68 72 77 54 77 C 53 77 52 77 51 76.8 V 70.5 C 67 70.5 77 63 77 53 C 77 43 67 35.5 51 35.5 V 29.2 C 52 29.1 53 29 54 29 Z"
            fill={strokeColor}
          />
        </svg>
        <span
          className="font-serif-arch text-sm font-semibold tracking-[0.35em] mt-0.5"
          style={{ color: textColor }}
        >
          DEAL
        </span>
      </div>
    );
  }

  // Default 'full' variant matches the official brand poster
  return (
    <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
      {/* The Monogram */}
      <svg
        viewBox="0 0 140 130"
        className={sizeClasses[size] || 'h-24'}
        style={{ width: 'auto' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="deal-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3.5" stdDeviation="3" floodColor={shadowColor} />
          </filter>
        </defs>
        <g filter="url(#deal-shadow)">
          {/* L letter */}
          <path
            d="M 44 24 H 61 V 28.5 H 55 V 89 H 84 V 94 H 44 Z"
            fill={strokeColor}
          />
          {/* D letter */}
          <path
            d="M 60 38 C 81 38 98 49.5 98 68 C 98 86.5 81 98 60 98 C 58.5 98 57.5 98 56.5 97.8 V 89.5 C 75.5 89.5 88 80 88 68 C 88 56 75.5 46.5 56.5 46.5 V 38.3 C 57.5 38.1 58.5 38 60 38 Z"
            fill={strokeColor}
          />
        </g>
      </svg>

      {/* D E A L Wordmark */}
      <div
        className="font-serif-arch text-xl md:text-2xl font-bold tracking-[0.38em] my-1"
        style={{ color: textColor }}
      >
        D E A L
      </div>

      {/* Subtitle */}
      <div
        className="text-[9px] md:text-[10.5px] uppercase tracking-[0.24em] font-medium flex items-center justify-center gap-1.5 opacity-90"
        style={{ color: subtextColor }}
      >
        <span>DESIGN</span>
        <span className="text-[7px]">·</span>
        <span>ENGINEERING</span>
        <span className="text-[7px]">·</span>
        <span>ARCHITECTURE</span>
        <span className="text-[7px]">·</span>
        <span>LIVING</span>
      </div>
    </div>
  );
};
