import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  className = '',
  footer,
  ...props 
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {title && (
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="border-t pt-4 mt-4">
          {footer}
        </div>
      )}
    </div>
  );
};
