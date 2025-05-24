import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold">CityPulse</h1>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-muted p-4 text-center text-muted-foreground">
        <p>© 2023 CityPulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 