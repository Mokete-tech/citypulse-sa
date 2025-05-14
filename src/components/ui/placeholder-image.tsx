import React from 'react';
import { cn } from '@/lib/utils';

interface PlaceholderImageProps {
  type?: 'deal' | 'event' | 'general';
  width?: number;
  height?: number;
  className?: string;
  text?: string;
}

/**
 * A component that renders a placeholder image directly in the DOM
 * This is guaranteed to work because it doesn't rely on external files
 */
export function PlaceholderImage({
  type = 'general',
  width = 800,
  height = 450,
  className,
  text
}: PlaceholderImageProps) {
  // Determine colors based on type
  const colors = {
    deal: {
      accent: '#3b82f6', // blue-500
      accentLight: 'rgba(59, 130, 246, 0.2)',
      text: '#64748b' // slate-500
    },
    event: {
      accent: '#8b5cf6', // violet-500
      accentLight: 'rgba(139, 92, 246, 0.2)',
      text: '#64748b' // slate-500
    },
    general: {
      accent: '#0ea5e9', // sky-500
      accentLight: 'rgba(14, 165, 233, 0.2)',
      text: '#64748b' // slate-500
    }
  };

  // Determine display text based on type
  const displayText = text || (type === 'deal' ? 'Deal Image' : type === 'event' ? 'Event Image' : 'CityPulse');

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      {/* Background */}
      <rect width="800" height="450" fill="#f0f4f8" />
      
      {/* Border */}
      <g fill="none" stroke="#a0aec0" strokeWidth="2">
        <rect x="150" y="100" width="500" height="250" rx="8" strokeDasharray="8 4" />
      </g>
      
      {/* Text */}
      <text
        x="400"
        y="225"
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fill={colors[type].text}
        textAnchor="middle"
      >
        {displayText}
      </text>
      
      {/* Type-specific icon */}
      {type === 'deal' && (
        <g transform="translate(350, 260)">
          <path
            d="M50,0 L100,50 L50,100 L0,50 Z"
            fill={colors.deal.accentLight}
            stroke={colors.deal.accent}
            strokeWidth="2"
          />
          <text
            x="50"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fill={colors.deal.accent}
            textAnchor="middle"
          >
            50% OFF
          </text>
        </g>
      )}
      
      {type === 'event' && (
        <g transform="translate(350, 260)">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill={colors.event.accentLight}
            stroke={colors.event.accent}
            strokeWidth="2"
          />
          <path
            d="M50,25 L55,45 L75,45 L60,55 L65,75 L50,65 L35,75 L40,55 L25,45 L45,45 Z"
            fill={colors.event.accent}
          />
        </g>
      )}
      
      {type === 'general' && (
        <g transform="translate(350, 260)">
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            rx="4"
            fill={colors.general.accentLight}
            stroke={colors.general.accent}
            strokeWidth="2"
          />
          <text
            x="50"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fill={colors.general.accent}
            textAnchor="middle"
            fontWeight="bold"
          >
            CP
          </text>
        </g>
      )}
    </svg>
  );
}

export default PlaceholderImage;
