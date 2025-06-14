
import { useState, useEffect, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const LiveChatParticles = () => {
  const [mounted, setMounted] = useState(false);

  // Memoize particles to prevent recreation on every render
  const particles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    })), []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1.5 h-1.5 rounded-full opacity-10 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `linear-gradient(45deg, #8b5cf6, #06b6d4)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s'
          }}
        />
      ))}
    </div>
  );
};

export default LiveChatParticles;
