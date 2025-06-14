
import { useState, useEffect, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const LiveChatParticles = () => {
  const [mounted, setMounted] = useState(false);

  // Create completely static particles that never change
  const particles = useMemo(() => 
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 20 + (i * 20), // More predictable positioning
      y: 20 + (i * 15),
      delay: i * 0.8,
      duration: 6 + (i * 0.5) // Varied but predictable duration
    })), []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `pulse ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default LiveChatParticles;
