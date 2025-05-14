import { cn } from "@/lib/utils";

interface CustomTickIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
}

export function CustomTickIcon({ 
  className, 
  size = 'md',
  isActive = false
}: CustomTickIconProps) {
  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const pixelSize = sizeMap[size];
  
  // Determine stroke width based on active state
  const strokeWidth = isActive ? 3 : 2.5;
  
  // Determine colors based on active state
  const strokeColor = isActive ? "white" : "currentColor";
  const fillColor = isActive ? "#9333ea" : "none";
  
  return (
    <svg 
      width={pixelSize} 
      height={pixelSize} 
      viewBox="0 0 24 24" 
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={cn("transition-all duration-300", className)}
    >
      {/* Custom tick shape with rounded edges */}
      <path 
        d="M20 6L9 17L4 12" 
        strokeWidth={strokeWidth} 
        className="transition-all duration-300"
      />
      
      {/* Optional background circle for active state */}
      {isActive && (
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth={1.5} 
          strokeOpacity={0.4}
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

// Create a more stylized version with a fancy tick
export function FancyTickIcon({ 
  className, 
  size = 'md',
  isActive = false
}: CustomTickIconProps) {
  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const pixelSize = sizeMap[size];
  
  return (
    <svg 
      width={pixelSize} 
      height={pixelSize} 
      viewBox="0 0 24 24" 
      fill="none"
      className={cn("transition-all duration-300", className)}
    >
      {/* Background circle */}
      {isActive && (
        <circle 
          cx="12" 
          cy="12" 
          r="11" 
          fill="url(#gradient)" 
          className="animate-pulse"
        />
      )}
      
      {/* Fancy tick with curved edges and variable thickness */}
      <path 
        d="M20 6.5C14.5 12 11.5 15.5 9 17.5L4 12.5" 
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
        strokeWidth={isActive ? 3.5 : 3}
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Create a bold, rounded tick that looks more modern
export function BoldTickIcon({ 
  className, 
  size = 'md',
  isActive = false
}: CustomTickIconProps) {
  // Size mapping
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const pixelSize = sizeMap[size];
  
  return (
    <svg 
      width={pixelSize} 
      height={pixelSize} 
      viewBox="0 0 24 24" 
      fill="none"
      className={cn("transition-all duration-300", className)}
    >
      {/* Background circle for active state */}
      {isActive && (
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          fill="url(#boldGradient)" 
        />
      )}
      
      {/* Bold tick with rounded caps */}
      <path 
        d="M6 12L10 16L18 8" 
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
        strokeWidth={isActive ? 4 : 3.5}
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="boldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}
