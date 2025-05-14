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

// Create a super bold, school-style tick that's very prominent
export function BoldTickIcon({
  className,
  size = 'md',
  isActive = false
}: CustomTickIconProps) {
  // Size mapping - increased sizes for more prominence
  const sizeMap = {
    sm: 20,
    md: 28,
    lg: 36
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
          r="11"
          fill="url(#schoolTickGradient)"
        />
      )}

      {/* Extra bold school-style tick */}
      <path
        d="M4.5 12.5L9 18.5L19.5 6"
        fill="none"
        stroke={isActive ? "white" : "currentColor"}
        strokeWidth={isActive ? 6 : 5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />

      {/* Add a subtle shadow for depth when active */}
      {isActive && (
        <path
          d="M4.5 12.5L9 18.5L19.5 6"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute -bottom-0.5 -right-0.5 opacity-30"
          style={{ filter: 'blur(1px)' }}
        />
      )}

      {/* Gradient definition */}
      <defs>
        <linearGradient id="schoolTickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="50%" stopColor="#7e22ce" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Create a classic teacher's red checkmark
export function TeacherTickIcon({
  className,
  size = 'md',
  isActive = false
}: CustomTickIconProps) {
  // Size mapping - increased sizes for more prominence
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 40
  };

  const pixelSize = sizeMap[size];

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("transition-all duration-300", className)}
      style={{
        transform: isActive ? 'rotate(-5deg)' : 'none',
        filter: isActive ? 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))' : 'none'
      }}
    >
      {/* Classic teacher's checkmark with variable width stroke */}
      <path
        d="M4 13L9 19L20 5"
        fill="none"
        stroke={isActive ? "#e11d48" : "currentColor"}
        strokeWidth={isActive ? 7 : 5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: isActive ? '0' : '0',
          strokeDashoffset: isActive ? '0' : '0'
        }}
        className="transition-all duration-300"
      />
    </svg>
  );
}
