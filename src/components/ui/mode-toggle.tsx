import React from 'react';

export const ModeToggle = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleMode}
      className="p-2 rounded-full bg-muted hover:bg-muted/80"
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ModeToggle; 