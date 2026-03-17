import React, { useState, useEffect } from 'react';
import { fileToBase64, editImage } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import FileUpload from './common/FileUpload';

const AUTOSAVE_KEY = 'imageEditorAutoSave';
const DEFAULT_PROMPT = 'Add a silky editorial finish';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ type: string, base64: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(AUTOSAVE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        // Only restore lightweight metadata, not large base64 images
        if (savedState.prompt) {
          setPrompt(savedState.prompt);
        }
      }
    } catch (err) {
      console.error("Failed to load auto-saved editor state:", err);
      localStorage.removeItem(AUTOSAVE_KEY); // Clear corrupted data
    }
  }, []);

  // Save state to localStorage on any change
  useEffect(() => {
    try {
      const stateToSave = {
        // Stop saving large base64 strings to localStorage
        prompt,
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error("Failed to auto-save editor state:", err);
    }
  }, [prompt]);


  const handleFileSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setOriginalImage({ type: file.type, base64 });
      setEditedImage(null); // Clear previous edit when new image is uploaded
    } catch (err) {
      setError('Failed to read file.');
      console.error(err);
    }
  };
  
  const handleReset = () => {
      setOriginalImage(null);
      setEditedImage(null);
      setPrompt(DEFAULT_PROMPT);
      setError(null);
      localStorage.removeItem(AUTOSAVE_KEY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalImage || !prompt) {
      setError('Please upload an image and provide an editing prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const resultBase64 = await editImage(originalImage.base64, originalImage.type, prompt);
      setEditedImage(resultBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image editing.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${editedImage}`;
    link.download = `the-crown-vault-edited-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    if (!originalImage || !prompt) return;
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="space-y-8">
      <div className="bg-stone-900 p-6 rounded-xl shadow-lg border border-stone-800">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1">
                Upload Image
              </label>
              <FileUpload onFileSelect={handleFileSelect} acceptedTypes="image/*" />
            </div>
            
            {originalImage && (
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-stone-300 mb-1">
                        Editing Instruction
                    </label>
                    <input
                        type="text"
                        id="prompt"
                        className="w-full p-3 bg-stone-900/50 border border-stone-800 text-white rounded-lg shadow-inner focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all duration-300"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter, remove the background"
                    />
                </div>
            )}
            
            <div className="flex items-center gap-4">
                <Button type="submit" isLoading={isLoading} disabled={!originalImage || !prompt}>
                    Apply Edit
                </Button>
                {originalImage && (
                    <Button
                        type="button"
                        onClick={handleReset}
                        className="!from-stone-700 !to-stone-600 hover:!from-stone-600 hover:!to-stone-500 focus:!ring-stone-500"
                    >
                        Reset Editor
                    </Button>
                )}
            </div>
        </form>
      </div>

      {error && <div className="text-red-400 p-4 bg-red-900/50 border border-red-500/50 rounded-md">{error}</div>}
      
      {isLoading && <Spinner message="Applying your creative edits..." />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {originalImage && (
          <div>
            <h3 className="text-lg font-medium text-stone-200 mb-2">Original</h3>
            <div className="overflow-hidden rounded-lg shadow-lg border border-stone-800">
              <img src={`data:${originalImage.type};base64,${originalImage.base64}`} alt="Original" className="w-full h-auto" />
            </div>
          </div>
        )}
        {editedImage && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-stone-200">Edited</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-1 bg-stone-700 hover:bg-stone-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
                  title="Try another version"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-royal-purple to-royal-purple-light text-white text-sm font-semibold rounded-full shadow-[0_0_15px_rgba(76,29,149,0.3)] hover:shadow-[0_0_20px_rgba(76,29,149,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-gold/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
             <div className="overflow-hidden rounded-lg shadow-lg border border-stone-800">
              <img src={`data:image/jpeg;base64,${editedImage}`} alt="Edited" className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;