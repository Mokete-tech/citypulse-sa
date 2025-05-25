import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/providers/ThemeProvider';
import { siteConfig } from '@/config/site';

export const Logo = () => {
  const { theme } = useTheme();
  
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        {siteConfig.name}
      </div>
    </Link>
  );
};

export default Logo; 