import React from 'react';
import { LoadingState } from '@/components/ui/loading-state';

const PageLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingState isLoading={true} type="page" />
    </div>
  );
};

export default PageLoadingFallback;
