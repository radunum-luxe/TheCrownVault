import React, { useState, useMemo } from 'react';
import { useGallery } from '../context/GalleryContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Maximize2, Copy, Check } from 'lucide-react';
import { GalleryItem } from '../types';

const Gallery: React.FC = () => {
    const { galleryItems, deleteItem, clearGallery } = useGallery();
    const [filter, setFilter] = useState<'all' | 'image'>('all');
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [copied, setCopied] = useState(false);

    const filteredItems = useMemo(() => {
        if (filter === 'all') {
            return galleryItems;
        }
        return galleryItems.filter(item => item.type === filter);
    }, [galleryItems, filter]);


    const handleCopyPrompt = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (galleryItems.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-stone-300">Your Gallery is Empty</h2>
                <p className="mt-2 text-stone-400">Start by generating some images!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h2 className="text-3xl font-bold text-stone-100">Your Saved Creations</h2>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2" role="group" aria-label="Filter gallery items">
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 border ${filter === 'all' ? 'bg-gold border-gold text-black' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-gold/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold'}`}>All</button>
                        <button onClick={() => setFilter('image')} className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-full transition-all duration-300 border ${filter === 'image' ? 'bg-gold border-gold text-black' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-gold/50 hover:text-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold'}`}>Images</button>
                    </div>
                    
                    <div className="relative">
                        {!showConfirmClear ? (
                            <button 
                                onClick={() => setShowConfirmClear(true)}
                                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                            >
                                Clear All
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-stone-900 border border-red-500/50 p-1 rounded-md">
                                <span className="text-xs text-stone-300 px-2">Are you sure?</span>
                                <button 
                                    onClick={() => {
                                        clearGallery();
                                        setShowConfirmClear(false);
                                    }}
                                    className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded hover:bg-red-500"
                                >
                                    Yes
                                </button>
                                <button 
                                    onClick={() => setShowConfirmClear(false)}
                                    className="px-2 py-1 text-xs font-bold bg-stone-700 text-stone-200 rounded hover:bg-stone-600"
                                >
                                    No
                                </button>
                            </div>
                        )}
                    </div>
                 </div>
            </div>

            {filteredItems.length === 0 ? (
                 <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-stone-300">No items match your filter.</h2>
                    <p className="mt-2 text-stone-400">Try selecting a different category.</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                    {filteredItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="group relative bg-stone-900 rounded-lg shadow-lg border border-stone-800 overflow-hidden break-inside-avoid cursor-pointer"
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={item.src} alt={item.prompt} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Saved Creation</span>
                                    <Maximize2 className="h-4 w-4 text-white/70" />
                                </div>
                                <p className="text-xs text-stone-300 line-clamp-2 italic leading-relaxed mb-2">"{item.prompt}"</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500"
                                    aria-label="Delete item"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                                <img 
                                    src={selectedItem.src} 
                                    alt="Large view" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-2">Prompt Details</h3>
                                    <div className="relative group">
                                        <div className="p-4 bg-stone-800/50 rounded-xl border border-stone-700/50 text-stone-200 text-sm leading-relaxed italic">
                                            "{selectedItem.prompt}"
                                        </div>
                                        <button 
                                            onClick={() => handleCopyPrompt(selectedItem.prompt)}
                                            className="absolute top-2 right-2 p-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg transition-colors"
                                            title="Copy prompt"
                                        >
                                            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-stone-800">
                                    <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase tracking-widest">
                                        <span>Saved on</span>
                                        <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            deleteItem(selectedItem.id);
                                            setSelectedItem(null);
                                        }}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-xl transition-colors border border-red-900/30 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove from Gallery
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;