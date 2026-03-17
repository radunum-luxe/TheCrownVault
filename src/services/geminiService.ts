import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const generateImages = async (prompt: string, aspectRatio: AspectRatio, numberOfImages: number) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set. Please ensure it is configured in your environment.');
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const generateOne = async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return {
                        image: {
                            imageBytes: part.inlineData.data
                        }
                    };
                }
            }
        }
        return null;
    };

    // Run calls in parallel
    const tasks = Array.from({ length: numberOfImages }, () => generateOne());
    const results = await Promise.all(tasks);
    
    return results.filter(img => img !== null) as any[];
};

export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set. Please ensure it is configured in your environment.');
    }
    const ai = new GoogleGenAI({ apiKey });

    let systemInstruction = "You are an expert image analyst for a luxury hair brand. Provide clear, professional insights.";
    
    if (prompt.toLowerCase().includes("reverse engineer") || prompt.toLowerCase().includes("recreate")) {
        systemInstruction = `You are a prompt engineering expert. Your goal is to analyze the provided image of a hair product (on a mannequin or model) and create a highly detailed, technical prompt that can be used to REGENERATE a similar image.
        
        Focus on:
        1. Hair Details: Texture (silky straight, body wave, etc.), color (natural black, honey blonde, etc.), style, and CRITICALLY the hair length (e.g., 12 inches, 24 inches, waist-length, shoulder-length).
        2. Presentation: Is it on a mannequin or a model? Mention "no visible straps or bands" if applicable.
        3. Technical Specs: Lighting (soft, diffused, studio), background (minimalist, salon, marble), and camera angle (close-up, editorial).
        4. Quality Keywords: Always include "flawless and perfect in every detail, with absolutely no dandruff" and "high-resolution product photography".
        
        Output ONLY the final prompt text, ready to be copied and pasted. Do not include introductory text or explanations.`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType: mimeType } },
                { text: prompt },
            ],
        },
        config: {
            systemInstruction: systemInstruction
        }
    });
    return response.text;
};

// FIX: Added the missing editImage function to handle image editing requests. This resolves the import error.
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set. Please ensure it is configured in your environment.');
    }
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('Image editing failed to produce an image.');
};
