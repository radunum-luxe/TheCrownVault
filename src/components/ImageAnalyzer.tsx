import React, { useState } from 'react';
import { fileToBase64, analyzeImage } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import FileUpload from './common/FileUpload';

const PRESET_PROMPTS = [
    "Reverse Engineer Prompt: Create a detailed prompt to recreate this exact image in an AI generator.",
    "Describe this image in detail for a product listing.",
    "What is the hair texture and color in this image?",
    "Suggest 3 Instagram captions for this product photo.",
    "Analyze the lighting and composition of this image."
];

const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<{ file: File, base64: string } | null>(null);
    const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        if (analysis) {
            navigator.clipboard.writeText(analysis);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFileSelect = async (file: File) => {
        try {
            const base64 = await fileToBase64(file);
            setImage({ file, base64 });
            setAnalysis(null);
        } catch (err) {
            setError('Failed to read file.');
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !prompt) {
            setError('Please upload an image and provide a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeImage(image.base64, image.file.type, prompt);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-stone-900 p-6 rounded-xl shadow-lg border border-stone-800">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1">
                            Upload Image to Analyze
                        </label>
                        <FileUpload onFileSelect={handleFileSelect} acceptedTypes="image/*" />
                    </div>
                    
                    {image && (
                         <div>
                            <label htmlFor="prompt-analyze" className="block text-sm font-medium text-stone-300 mb-1">
                                What should I look for?
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {PRESET_PROMPTS.map(p => (
                                    <button type="button" key={p} onClick={() => setPrompt(p)} className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all duration-300 ${prompt === p ? 'bg-gold border-gold text-black font-bold' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-gold/50 hover:text-gold'}`}>{p}</button>
                                ))}
                            </div>
                            <input
                                type="text"
                                id="prompt-analyze"
                                className="w-full p-3 bg-stone-900/50 border border-stone-800 text-white rounded-lg shadow-inner focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all duration-300"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Describe this image"
                            />
                        </div>
                    )}
                    
                    <Button type="submit" isLoading={isLoading} disabled={!image || !prompt}>
                        Analyze Image
                    </Button>
                </form>
            </div>

            {error && <div className="text-red-400 p-4 bg-red-900/50 border border-red-500/50 rounded-md">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {image && (
                    <div>
                        <h3 className="text-lg font-medium text-stone-200 mb-2">Your Image</h3>
                        <div className="overflow-hidden rounded-lg shadow-lg border border-stone-800">
                            <img src={`data:${image.file.type};base64,${image.base64}`} alt="Uploaded for analysis" className="w-full h-auto" />
                        </div>
                    </div>
                )}
                
                {isLoading && (
                    <div className="md:col-start-2">
                        <Spinner message="Analyzing your image..." />
                    </div>
                )}

                {analysis && (
                    <div className="bg-stone-900 p-6 rounded-xl shadow-lg border border-stone-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-stone-200">AI Analysis</h3>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors text-xs font-medium border border-stone-700"
                            >
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy Result
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="prose prose-sm max-w-none text-stone-300 whitespace-pre-wrap bg-stone-950 p-4 rounded-lg border border-stone-800 font-mono text-xs leading-relaxed">
                            {analysis}
                        </div>
                        {prompt.includes("Reverse Engineer") && (
                            <p className="mt-4 text-[10px] text-stone-500 italic">
                                Tip: Paste this prompt into the Image Generation tab to recreate a similar style.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageAnalyzer;