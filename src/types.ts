
// FIX: Removed self-import of AspectRatio which was causing a declaration conflict.
export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_3_4 = '3:4',
  LANDSCAPE_4_3 = '4:3',
  PORTRAIT_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
}

export enum Tab {
    IMAGE_GEN = 'Image Generation',
    IMAGE_EDIT = 'Image Editor',
    IMAGE_ANALYZE = 'Image Analyzer',
    GALLERY = 'Gallery',
}

export interface GeneratedImage {
  image: {
    imageBytes: string;
  };
}

export interface GalleryItem {
  id: string;
  type: 'image';
  src: string;
  prompt: string;
  createdAt: number;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
