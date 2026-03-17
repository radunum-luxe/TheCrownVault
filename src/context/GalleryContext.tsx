import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GalleryItem } from '../types';

const GALLERY_STORAGE_KEY = 'crownVaultGallery';

interface GalleryContextType {
    galleryItems: GalleryItem[];
    addItem: (item: Omit<GalleryItem, 'id' | 'createdAt'>) => void;
    deleteItem: (id: string) => void;
    clearGallery: () => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    useEffect(() => {
        try {
            const storedItems = localStorage.getItem(GALLERY_STORAGE_KEY);
            if (storedItems) {
                setGalleryItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error("Failed to load gallery from localStorage", error);
            setGalleryItems([]);
        }
    }, []);

    const saveItemsToStorage = (items: GalleryItem[]) => {
        let currentItems = items;
        let success = false;
        let attempts = 0;
        const maxAttempts = 5;

        while (!success && attempts < maxAttempts && currentItems.length > 0) {
            try {
                localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(currentItems));
                success = true;
            } catch (error) {
                attempts++;
                if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                    const newSize = Math.floor(currentItems.length / 2);
                    if (newSize === 0) break;
                    currentItems = currentItems.slice(0, newSize);
                    console.warn(`Gallery truncated to ${newSize} items due to storage limits (Attempt ${attempts})`);
                } else {
                    console.error("Non-quota error saving to localStorage", error);
                    break;
                }
            }
        }

        if (!success && currentItems.length > 0) {
            try {
                const singleItem = [currentItems[0]];
                localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(singleItem));
            } catch (error) {
                console.error("Failed to save even a single item to localStorage. Clearing gallery storage.", error);
                localStorage.removeItem(GALLERY_STORAGE_KEY);
            }
        }
    };

    const addItem = (item: Omit<GalleryItem, 'id' | 'createdAt'>) => {
        const newItem: GalleryItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: Date.now()
        };
        setGalleryItems(prevItems => {
            const updatedItems = [newItem, ...prevItems];
            saveItemsToStorage(updatedItems);
            return updatedItems;
        });
    };

    const deleteItem = (id: string) => {
        setGalleryItems(prevItems => {
            const updatedItems = prevItems.filter(item => item.id !== id);
            saveItemsToStorage(updatedItems);
            return updatedItems;
        });
    };

    const clearGallery = () => {
        setGalleryItems([]);
        localStorage.removeItem(GALLERY_STORAGE_KEY);
    };

    return (
        <GalleryContext.Provider value={{ galleryItems, addItem, deleteItem, clearGallery }}>
            {children}
        </GalleryContext.Provider>
    );
};

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (context === undefined) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
};
