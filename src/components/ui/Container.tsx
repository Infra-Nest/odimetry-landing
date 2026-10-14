import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = ({ 
  children, 
  className = '', 
  size = 'lg' 
}: ContainerProps) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };
  
  return (
    <div className={`odimetry-container mx-auto px-5 sm:px-6 md:px-8 lg:px-8 ${maxWidths[size]} ${className}`}>
      {children}
    </div>
  );
};
