import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false, ...props }: CardProps) => {
  const hoverStyles = hover 
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-2' 
    : '';
  
  return (
    <div className={`bg-gray-900 rounded-xl shadow-md shadow-gray-900/50 p-5 sm:p-6 border border-gray-800 ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

