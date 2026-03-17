import React from 'react';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-stone-900/50 rounded-xl border border-stone-800">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-stone-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gold rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-stone-300 font-medium animate-pulse">{message}</p>
    </div>
  );
};

export default Spinner;
