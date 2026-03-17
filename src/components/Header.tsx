import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-stone-900 border-b border-stone-800">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight luxury-gradient-text font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                The Crown Vault
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-gold/60 hidden sm:block font-medium">Private AI Image Studio for Luxury Hair Brands</p>
        </div>
      </div>
    </header>
  );
};

export default Header;