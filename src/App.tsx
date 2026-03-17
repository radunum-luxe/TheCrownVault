import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import ImageEditor from './components/ImageEditor';
import Header from './components/Header';
import Gallery from './components/Gallery';
import { Tab } from './types';
import { GalleryProvider } from './context/GalleryContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.IMAGE_GEN);

  return (
    <GalleryProvider>
      <div className="min-h-screen bg-black text-stone-100 font-sans">
        <Header />
        <main className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 border-b border-stone-800">
              <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                {(Object.keys(Tab) as Array<keyof typeof Tab>).map((key) => {
                  const tabValue = Tab[key];
                  return (
                    <button
                      key={tabValue}
                      onClick={() => setActiveTab(tabValue)}
                      className={`${
                        activeTab === tabValue
                          ? 'border-gold text-gold'
                          : 'border-transparent text-stone-500 hover:text-silver hover:border-stone-700'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs uppercase tracking-widest transition-all duration-300 focus:outline-none`}
                    >
                      {tabValue.replace('_', ' ')}
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className={activeTab === Tab.IMAGE_GEN ? 'block' : 'hidden'}>
              <ImageGenerator />
            </div>
            <div className={activeTab === Tab.IMAGE_EDIT ? 'block' : 'hidden'}>
              <ImageEditor />
            </div>
            <div className={activeTab === Tab.IMAGE_ANALYZE ? 'block' : 'hidden'}>
              <ImageAnalyzer />
            </div>
            <div className={activeTab === Tab.GALLERY ? 'block' : 'hidden'}>
              <Gallery />
            </div>
          </div>
        </main>
         <footer className="bg-black text-center py-10 mt-12 border-t border-stone-900">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-600 mb-2">&copy; 2026 The Crown Vault</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold/40">Created by Luxe AI Tools</p>
        </footer>
      </div>
    </GalleryProvider>
  );
};

export default App;
