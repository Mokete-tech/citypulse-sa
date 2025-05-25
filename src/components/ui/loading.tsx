import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 24, className = '' }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className={`animate-spin text-primary ${className}`} size={size} />
    </div>
  );
};

export default Loading; 