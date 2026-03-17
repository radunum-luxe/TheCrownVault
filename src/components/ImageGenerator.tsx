import React, { useState } from 'react';
import { AspectRatio } from '../types';
import type { GeneratedImage } from '../types';
import { generateImages } from '../services/geminiService';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { useGallery } from '../context/GalleryContext';

const PRESET_PROMPTS = [
  {
    name: 'Silky Straight',
    prompt: 'Professional product photography of a silky straight virgin hair wig on a mannequin, 24 inches long, natural black color. The wig is presented cleanly with no visible straps or bands under the neck. Set in a modern, bright salon with soft, diffused lighting. The lace front is transparent and seamlessly blended. Shot in 4K with a sharp, magazine-style composition, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Body Wave',
    prompt: 'Glamour shot of a body wave lace front wig, 22 inches, jet black, on a mannequin. The hair has voluminous, glossy waves. No visible wig bands or securing straps. Background is a chic studio with soft focus and bokeh lights. Editorial finish, high-resolution, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Deep Wave',
    prompt: 'Detailed product photo of a deep wave curly wig, 20 inches, natural black, on a mannequin head with no visible neck bands or straps. The curls are well-defined and hydrated. Mannequin is positioned in a minimalist setting with a large plant. Highlights the texture and shine of the curls. Professional studio lighting, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Hollywood Waves',
    prompt: 'A glamorous pin-up style Hollywood waves wig on a mannequin, 22 inches long, jet black. The hair features deep, structured vintage waves with a high-gloss finish and a classic side part. No visible wig bands or straps. Set in a luxurious vintage dressing room with a vanity mirror and warm, soft lighting. High-end editorial photography, high-resolution, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Yaki Straight',
    prompt: 'Professional product photography of a yaki straight wig on a mannequin, 22 inches long, natural black color. The texture is slightly crimped and coarse, mimicking relaxed hair with a natural, voluminous look. No visible straps or bands. Set in a modern, bright salon with soft, diffused lighting. Shot in 4K, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Kinky Curly',
    prompt: 'Vibrant photo of a voluminous kinky curly wig on a mannequin, 18 inches, showcasing maximum texture and definition. The presentation is clean, with no distracting wig bands or straps showing. Set against a clean, off-white wall with natural side lighting from a large window to create soft shadows and highlight the curl pattern. Realistic, high-end feel, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Natural Afro',
    prompt: 'Stunning photo of a full, rounded natural afro wig on a mannequin. Rich, deep brown color with defined 4C curl texture. The presentation is professional and clean, with no visible straps or bands. Set in a warm, earthy-toned studio with soft natural light. Celebrates texture and volume. 4K resolution, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Honey Blonde Balayage',
    prompt: 'Luxury product photography of a long, 26-inch wig with a honey blonde balayage color on a mannequin. Soft, cascading curls with high-gloss shine. The lace front is perfectly melted into the mannequin skin. No visible neck bands or securing straps. Set in a high-end boutique salon with marble accents and warm lighting. Magazine-quality finish, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Sleek High Pony',
    prompt: 'Professional shot of a sleek, high ponytail wig on a mannequin. Jet black, 30 inches long, with a perfectly smooth finish and a wrapped base. The hairline is impeccably natural. No visible wig bands or straps. Modern, minimalist studio background with sharp lighting to emphasize the sleekness. High-fashion editorial style, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Pixie',
    prompt: 'Detailed close-up of a classic pixie cut wig on a mannequin. Natural black color. Showcasing the intricate layering and natural-looking scalp. The presentation is clean, with no visible securing bands. Set against a soft charcoal background with dramatic side lighting. High-end salon aesthetic, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Curly Pixie',
    prompt: 'Chic curly pixie cut wig on a mannequin. Short, bouncy curls with a natural black color. The curls are well-defined and add volume to the short style. No visible wig bands or straps. Set in a stylish, minimalist studio. Professional photography, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Ombre Bob',
    prompt: 'Chic product shot of a blunt-cut bob wig with a subtle chocolate-to-caramel ombre transition. 12 inches long, perfectly straight and glossy. No visible wig bands or neck straps. Set in a bright, airy loft with modern furniture. High-resolution, magazine-style composition, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Burgundy Curls',
    prompt: 'Deep burgundy curly wig on a mannequin, 24 inches long. The curls are tight and bouncy with a healthy sheen. No visible straps or bands. Set in a luxurious dressing room with velvet textures and warm ambient light. Professional photography, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Ginger Wave',
    prompt: 'Vibrant ginger orange body wave wig, 22 inches, on a mannequin. The hair has a soft, natural-looking wave pattern. No visible wig bands. Background is a clean, modern studio with soft pastel tones. Editorial finish, high-resolution, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Icy Blue Straight',
    prompt: 'Avant-garde product shot of an icy blue straight wig on a mannequin, 20 inches long. The hair is bone straight and reflective. No visible securing bands. Set in a futuristic, minimalist studio with cool blue lighting. Sharp magazine-style composition, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Rose Gold Bob',
    prompt: 'Trendy rose gold pink bob wig, 14 inches, with soft waves. The color is a delicate metallic pink. No visible neck straps. Set in a chic, feminine studio with floral accents. High-fashion, editorial style, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Salt and Pepper',
    prompt: 'Sophisticated salt and pepper grey wavy wig on a mannequin, 18 inches. A natural blend of silver and charcoal tones. Clean presentation with no visible bands. Set in a classic, elegant library setting with soft natural light. High-end aesthetic, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Space Buns',
    prompt: 'A trendy shot of a wig styled into two high space buns with long, wavy tendrils framing the face. Natural black color. The lace front is flawlessly melted. No visible securing bands around the neck or base. Set in a stylish, modern apartment with natural light. The look is playful yet chic. 4K quality, flawless and perfect in every detail, with absolutely no dandruff.',
  },
  {
    name: 'Styled with Headband',
    prompt: 'Creative product shot of a short, wavy bob wig on a mannequin, styled with a chic, wide silk headband. The focus is on how the wig can be accessorized. No functional wig straps are visible. The setting is a colorful, playful studio. High-fashion, editorial style, flawless and perfect in every detail, with absolutely no dandruff.',
  }
];

const HAIR_LENGTHS = [
  'Default',
  '10 inches',
  '14 inches',
  '18 inches',
  '22 inches',
  '26 inches',
  '30 inches',
  '34 inches',
];

const HAIR_COLORS = [
  'Default',
  'Natural Black',
  'Jet Black',
  'Honey Blonde',
  'Platinum Blonde',
  'Burgundy',
  'Ginger',
  'Chocolate Brown',
  'Caramel Ombre',
  'Icy Blue',
  'Rose Gold',
  'Silver Grey',
];

const MODEL_RACES = [
  'Default',
  'Black/African American',
  'Caucasian',
  'Hispanic/Latina',
  'Asian',
  'Middle Eastern',
  'Mixed Race',
];

const SKIN_TONES_BY_RACE: Record<string, string[]> = {
  'Default': ['Default'],
  'Black/African American': ['Default', 'Cocoa Brown', 'Walnut', 'Caramel', 'Deep Ebony', 'Rich Mahogany'],
  'Caucasian': ['Default', 'Porcelain', 'Beige', 'Olive', 'Tan', 'Fair'],
  'Hispanic/Latina': ['Default', 'Golden', 'Honey', 'Olive', 'Sun-kissed', 'Bronze'],
  'Asian': ['Default', 'Fair', 'Light Beige', 'Golden', 'Ivory', 'Natural'],
  'Middle Eastern': ['Default', 'Olive', 'Light Bronze', 'Sand', 'Warm Beige', 'Caramel'],
  'Mixed Race': ['Default', 'Golden', 'Caramel', 'Tan', 'Olive', 'Honey'],
};

const MODEL_EYE_COLORS = [
  'Default',
  'Brown',
  'Hazel',
  'Green',
  'Blue',
  'Grey',
  'Amber',
];

const MODEL_BODY_TYPES = [
  'Default',
  'Average',
  'Curvy',
  'Slim',
  'Athletic',
  'Plus Size',
];

const PHOTO_TYPES = [
  'Default',
  'Full Length',
  'Shoulder Up',
  'Bust Up',
  'Close-up',
  'Profile View',
  'Action Shot',
];

const OUTFIT_THEMES = [
  'Default',
  'Casual Chic',
  'Elegant Evening Wear',
  'Professional Business',
  'Streetwear Fashion',
  'Bohemian Style',
  'High-Fashion Editorial',
  'Athleisure',
  'Minimalist Modern',
];

const MANNEQUIN_SKIN_TONES = [
  'None',
  'White Matte',
  'Black Matte',
  'Brown Matte',
  'Flesh Tone',
  'Clear/Glass',
  'Gold Chrome',
  'Silver Chrome',
];

const LACE_OPTIONS = [
  'Default',
  'Lace Uncut',
  'Lace Cut',
];

const BABY_HAIR_OPTIONS = [
  'Default',
  'Baby Hair',
  'No Baby Hair',
];

const WIG_TYPES = [
  'Default',
  'Lace Front Wig',
  'Full Lace Wig',
  '360 Lace Wig',
  'Closure Wig',
  'U-Part Wig',
  'Headband Wig',
  'T-Part Wig',
  'Glueless Wig',
  'HD Lace Wig',
  'Transparent Lace Wig',
  'Silk Top Wig',
  'Monofilament Wig',
  'Hair Weave / Bundles',
  'Clip-in Extensions',
  'Tape-in Extensions',
  'I-Tip Extensions',
  'Micro-link Extensions',
];

const HAIR_STYLES = [
  'Default',
  'Bone Straight',
  'Body Wave',
  'Deep Wave',
  'Water Wave',
  'Loose Wave',
  'Kinky Curly',
  'Kinky Straight',
  'Yaki Straight',
  'Afro Curly',
  'Jerry Curly',
  'Pixie Cut',
  'Bob Cut',
  'Deep Curly',
  'Loose Deep Wave',
  'Natural Wave',
  'Crimped / Deep Crimp',
  'Wet and Wavy',
  'Flat Ironed Sleek',
  'Voluminous Blowout',
  'Hollywood Waves',
  'Beach Waves',
  'Spiral Curls',
  'Coily 4C Texture',
  'Silk Press',
];

const BANGS_STYLES = [
  'None',
  'Wispy Bangs',
  'Blunt Cut Bangs',
  'Curtain Bangs',
  'Side-Swept Bangs',
  'Curly Bangs',
  'Micro Bangs',
  'Fringe Bangs',
  'Feathered Bangs',
  'Layered Bangs',
];

const BACKGROUND_OPTIONS = [
  'Default',
  'Professional Photo Studio',
  'Lush Flower Garden',
  'Luxury Hair Salon',
  'Modern Minimalist Apartment',
  'Scenic Outdoor Nature',
  'Clean Off-white Wall',
  'Solid Black Wall',
  'Luxurious Gold Wall',
  'Soft Baby Blue Wall',
  'Deep Hunter Green Wall',
  'Vibrant Hot Pink Wall',
  'High-end Fashion Boutique',
  'Futuristic Neon Studio',
  'Elegant Marble Hallway',
];

const PANEL_LAYOUTS = [
  'Single Panel',
  'Multi-panel (3-way view)',
  'Multi-panel (4-way view)',
  'Side-by-side comparison',
];

const aspectRatioClasses: { [key in AspectRatio]: string } = {
  [AspectRatio.SQUARE]: 'aspect-square',
  [AspectRatio.PORTRAIT_3_4]: 'aspect-[3/4]',
  [AspectRatio.LANDSCAPE_4_3]: 'aspect-[4/3]',
  [AspectRatio.PORTRAIT_9_16]: 'aspect-[9/16]',
  [AspectRatio.LANDSCAPE_16_9]: 'aspect-[16/9]',
};

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [imageCount, setImageCount] = useState<number>(2);
  const [hairLength, setHairLength] = useState<string>('Default');
  const [hairStyle, setHairStyle] = useState<string>('Default');
  const [bangsStyle, setBangsStyle] = useState<string>('None');
  const [hairColor, setHairColor] = useState<string>('Default');
  const [modelRace, setModelRace] = useState<string>('Default');
  const [modelSkinTone, setModelSkinTone] = useState<string>('Default');
  const [modelEyeColor, setModelEyeColor] = useState<string>('Default');
  const [modelBodyType, setModelBodyType] = useState<string>('Default');
  const [outfitTheme, setOutfitTheme] = useState<string>('Default');
  const [photoType, setPhotoType] = useState<string>('Default');
  const [background, setBackground] = useState<string>('Default');
  const [mannequinSkinTone, setMannequinSkinTone] = useState<string>('None');
  const [panelLayout, setPanelLayout] = useState<string>('Single Panel');
  const [wigType, setWigType] = useState<string>('Default');
  const [laceStatus, setLaceStatus] = useState<string>('Default');
  const [babyHairStatus, setBabyHairStatus] = useState<string>('Default');
  const [isHyperRealistic, setIsHyperRealistic] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const { addItem } = useGallery();
  
  const [lastSuccessfulPrompt, setLastSuccessfulPrompt] = useState<string>('');
  const [lastSuccessfulAspectRatio, setLastSuccessfulAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [lastSuccessfulImageCount, setLastSuccessfulImageCount] = useState<number>(2);

  const resetSettings = () => {
    setHairLength('Default');
    setHairStyle('Default');
    setBangsStyle('None');
    setHairColor('Default');
    setModelRace('Default');
    setModelSkinTone('Default');
    setModelEyeColor('Default');
    setModelBodyType('Default');
    setOutfitTheme('Default');
    setPhotoType('Default');
    setBackground('Default');
    setMannequinSkinTone('None');
    setPanelLayout('Single Panel');
    setWigType('Default');
    setLaceStatus('Default');
    setBabyHairStatus('Default');
    setIsHyperRealistic(false);
  };

  const getMergedPrompt = (
    basePrompt: string,
    settings: {
      hairLength: string;
      hairStyle: string;
      bangsStyle: string;
      hairColor: string;
      modelRace: string;
      modelSkinTone: string;
      modelEyeColor: string;
      modelBodyType: string;
      outfitTheme: string;
      photoType: string;
      background: string;
      mannequinSkinTone: string;
      panelLayout: string;
      wigType: string;
      laceStatus: string;
      babyHairStatus: string;
      isHyperRealistic: boolean;
      isMultipleImages?: boolean;
    }
  ) => {
    let newPrompt = basePrompt;
    const { 
      hairLength, 
      hairStyle,
      bangsStyle,
      hairColor, 
      modelRace, 
      modelSkinTone, 
      modelEyeColor, 
      modelBodyType, 
      outfitTheme,
      photoType, 
      background,
      mannequinSkinTone,
      panelLayout,
      wigType,
      laceStatus,
      babyHairStatus,
      isHyperRealistic,
      isMultipleImages
    } = settings;
    
    // 0. Add/Remove Hyper-Realistic Keywords
    const hyperKeywords = 'hyper-realistic, 8k resolution, highly detailed, photorealistic, raw photo, masterpiece, sharp focus, intricate textures';
    if (isHyperRealistic) {
      if (!newPrompt.toLowerCase().includes('hyper-realistic')) {
        newPrompt = `${hyperKeywords}, ${newPrompt}`;
      }
    } else {
      // Remove hyper-realistic keywords if disabled
      const hyperRegex = /hyper-realistic|8k\s+resolution|highly\s+detailed|photorealistic|raw\s+photo|masterpiece|sharp\s+focus|intricate\s+textures/gi;
      newPrompt = newPrompt.replace(hyperRegex, '');
    }

    // 1. Update Model/Mannequin Description
    const mannequinRegex = /on\s+a\s+(?:[a-z\s-]+\s+)?mannequin(?: head)?/gi;
    const existingModelRegex = /on\s+a\s+beautiful\s+(?:[a-z\s-]+\s+)?model/gi;

    // 1.2 Update Wig Type
    if (wigType !== 'Default') {
      const wigTypeRegex = /(?:lace\s+front\s+|full\s+lace\s+|360\s+lace\s+|closure\s+|u-part\s+|headband\s+|t-part\s+|glueless\s+|hd\s+lace\s+|transparent\s+lace\s+|silk\s+top\s+|monofilament\s+)?wig|bundles|extensions/gi;
      if (wigTypeRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(wigTypeRegex, wigType);
      } else {
        newPrompt = `${wigType}, ${newPrompt}`;
      }
    }

    // 1.3 Update Hair Style
    if (hairStyle !== 'Default') {
      const styleRegex = /(?:bone\s+straight|body\s+wave|deep\s+wave|water\s+wave|loose\s+wave|kinky\s+curly|kinky\s+straight|yaki\s+straight|afro\s+curly|jerry\s+curly|pixie\s+cut|bob\s+cut|deep\s+curly|loose\s+deep\s+wave|natural\s+wave|crimped|deep\s+crimp|wet\s+and\s+wavy|flat\s+ironed|sleek|voluminous\s+blowout|hollywood\s+waves|beach\s+waves|spiral\s+curls|coily\s+4c|silk\s+press|perfectly\s+sleek|no\s+frizz|smooth\s+texture|large\s+loose\s+S-shaped\s+waves|tight\s+defined\s+waves|consistent\s+wave\s+pattern|natural\s+looking\s+ripples|wet\s+look\s+waves|tight\s+small\s+ringlets|high\s+volume|natural\s+texture|blown\s+out\s+natural\s+texture|coarse\s+but\s+straight|tight\s+coils|maximum\s+volume|authentic\s+texture|mirror-like\s+shine|perfectly\s+straight|no\s+flyaways|tight\s+spiral\s+curls|high\s+definition|bouncy\s+texture|relaxed\s+deep\s+waves|soft\s+texture|deep\s+crimp\s+texture|zigzag\s+waves|damp\s+look|defined\s+curls\s+with\s+shine|tightest\s+coils|natural\s+shrinkage|high\s+density|(?:[a-z\s-]+\s+)?hair\s+style|(?:[a-z\s-]+\s+)?hair\s+texture)/gi;
      
      let styleDesc = hairStyle.toLowerCase();
      // Enhance specific styles for accuracy
      if (hairStyle === 'Bone Straight') styleDesc = "bone straight, perfectly sleek, flat ironed, no frizz, smooth texture";
      if (hairStyle === 'Body Wave') styleDesc = "body wave, large loose S-shaped waves, voluminous";
      if (hairStyle === 'Deep Wave') styleDesc = "deep wave, tight defined waves, consistent wave pattern";
      if (hairStyle === 'Water Wave') styleDesc = "water wave, natural looking ripples, wet look waves";
      if (hairStyle === 'Kinky Curly') styleDesc = "kinky curly, tight small ringlets, high volume, natural texture";
      if (hairStyle === 'Kinky Straight') styleDesc = "kinky straight, blown out natural texture, coarse but straight";
      if (hairStyle === 'Afro Curly') styleDesc = "afro curly, tight coils, maximum volume, authentic texture";
      if (hairStyle === 'Flat Ironed Sleek') styleDesc = "flat ironed sleek, mirror-like shine, perfectly straight, no flyaways";
      if (hairStyle === 'Deep Curly') styleDesc = "deep curly, tight spiral curls, high definition, bouncy texture";
      if (hairStyle === 'Loose Deep Wave') styleDesc = "loose deep wave, relaxed deep waves, soft texture";
      if (hairStyle === 'Crimped / Deep Crimp') styleDesc = "crimped, deep crimp texture, zigzag waves, high volume";
      if (hairStyle === 'Wet and Wavy') styleDesc = "wet and wavy, damp look, defined curls with shine";
      if (hairStyle === 'Coily 4C Texture') styleDesc = "coily 4C texture, tightest coils, natural shrinkage, high density";
      
      if (styleRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(styleRegex, styleDesc);
      } else {
        newPrompt = `${styleDesc}, ${newPrompt}`;
      }
    }

    // 1.3.1 Update Bangs Style
    if (bangsStyle !== 'None' && bangsStyle !== 'Default') {
      const bangsRegex = /(?:wispy|blunt|curtain|side-swept|curly|micro|fringe|feathered|layered)?\s*bangs|thick\s+blunt\s+cut\s+bangs|straight\s+across\s+forehead|sharp\s+edges|wispy\s+see-through\s+bangs|light\s+and\s+airy|parted\s+in\s+the\s+middle|framing\s+the\s+face|(?:[a-z\s-]+\s+)?bangs/gi;
      let bangsDesc = bangsStyle.toLowerCase();
      
      // Enhance specific bangs for accuracy
      if (bangsStyle === 'Blunt Cut Bangs') bangsDesc = "thick blunt cut bangs, straight across forehead, sharp edges";
      if (bangsStyle === 'Wispy Bangs') bangsDesc = "wispy see-through bangs, light and airy, soft texture";
      if (bangsStyle === 'Curtain Bangs') bangsDesc = "curtain bangs, parted in the middle, framing the face";
      
      if (bangsRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(bangsRegex, bangsDesc);
      } else {
        newPrompt += `, with ${bangsDesc}`;
      }
    } else {
      // Remove bangs if set to None
      newPrompt = newPrompt.replace(/,\s*with\s+(?:wispy|blunt|curtain|side-swept|curly|micro|fringe|feathered|layered)?\s*bangs/gi, '');
      newPrompt = newPrompt.replace(/(?:wispy|blunt|curtain|side-swept|curly|micro|fringe|feathered|layered)?\s*bangs/gi, '');
    }

    // 1.4 Add/Remove Consistency Instruction
    const consistencyKeywords = 'consistent hairstyle, identical hair texture across all views, uniform look';
    if (isMultipleImages || panelLayout !== 'Single Panel') {
      if (!newPrompt.toLowerCase().includes('consistent')) {
        newPrompt += `, ${consistencyKeywords}`;
      }
    } else {
      // Remove consistency keywords if disabled
      const consistencyRegex = /consistent\s+hairstyle|identical\s+hair\s+texture\s+across\s+all\s+views|uniform\s+look/gi;
      newPrompt = newPrompt.replace(consistencyRegex, '');
    }

    // 1.5 Update Panel Layout
    if (panelLayout !== 'Single Panel') {
      const layoutRegex = /multi-panel|3-way\s+view|4-way\s+view|side-by-side\s+comparison|split\s+view|collage/gi;
      let layoutDesc = panelLayout.toLowerCase();
      if (panelLayout === 'Multi-panel (3-way view)') layoutDesc = "multi-panel 3-way view showing front, side, and back angles";
      if (panelLayout === 'Multi-panel (4-way view)') layoutDesc = "multi-panel 4-way view showing front, both sides, and back angles";
      if (panelLayout === 'Side-by-side comparison') layoutDesc = "side-by-side comparison view";

      if (layoutRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(layoutRegex, layoutDesc);
      } else {
        newPrompt = `${layoutDesc}, ${newPrompt}`;
      }
    } else {
      const layoutRegex = /multi-panel|3-way\s+view|4-way\s+view|side-by-side\s+comparison|split\s+view|collage/gi;
      newPrompt = newPrompt.replace(new RegExp(`,?\\s*${layoutRegex.source}`, 'gi'), '');
      newPrompt = newPrompt.replace(layoutRegex, '');
    }

    if (mannequinSkinTone !== 'None' && mannequinSkinTone !== 'Default') {
      // Mannequin overrides everything
      let tone = mannequinSkinTone.toLowerCase();
      if (tone === 'clear/glass') {
        tone = 'transparent clear glass';
      }
      const mannequinDesc = `on a ${tone} mannequin`;
      if (mannequinRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(mannequinRegex, mannequinDesc);
      } else if (existingModelRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(existingModelRegex, mannequinDesc);
      } else if (!newPrompt.toLowerCase().includes(tone)) {
        if (newPrompt.toLowerCase().includes('wig')) {
          newPrompt = newPrompt.replace(/(wig)/i, `$1 ${mannequinDesc}`);
        } else {
          newPrompt += `, ${mannequinDesc}`;
        }
      }
    } else if (modelRace !== 'Default') {
      // Model logic
      let bodyDesc = '';
      if (modelBodyType !== 'Default') {
        if (modelBodyType.toLowerCase() === 'plus size') {
          bodyDesc = 'curvy plus-size, full-figured ';
        } else if (modelBodyType.toLowerCase() === 'slim') {
          bodyDesc = 'slender slim build ';
        } else if (modelBodyType.toLowerCase() === 'athletic') {
          bodyDesc = 'toned athletic build ';
        } else if (modelBodyType.toLowerCase() === 'curvy') {
          bodyDesc = 'curvy hourglass figure ';
        } else {
          bodyDesc = `${modelBodyType.toLowerCase()} `;
        }
      }

      let modelDescription = `beautiful ${bodyDesc}${modelRace} model`;
      if (modelSkinTone !== 'Default') {
        modelDescription = `beautiful ${bodyDesc}${modelRace} model with ${modelSkinTone.toLowerCase()} skin tone`;
      }

      if (mannequinRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(mannequinRegex, `on a ${modelDescription}`);
      } else if (existingModelRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(existingModelRegex, `on a ${modelDescription}`);
      } else if (!newPrompt.toLowerCase().includes(modelRace.toLowerCase())) {
        if (newPrompt.toLowerCase().includes('wig')) {
          newPrompt = newPrompt.replace(/(wig)/i, `$1 on a ${modelDescription}`);
        } else {
          newPrompt += ` on a ${modelDescription}`;
        }
      }
    } else {
      // If both mannequin and model are None/Default, try to remove any model/mannequin descriptions
      newPrompt = newPrompt.replace(/,\s*on\s+a\s+(?:[a-z\s-]+\s+)?mannequin(?: head)?/gi, '');
      newPrompt = newPrompt.replace(/on\s+a\s+(?:[a-z\s-]+\s+)?mannequin(?: head)?/gi, '');
      newPrompt = newPrompt.replace(/,\s*on\s+a\s+beautiful\s+(?:[a-z\s-]+\s+)?model/gi, '');
      newPrompt = newPrompt.replace(/on\s+a\s+beautiful\s+(?:[a-z\s-]+\s+)?model/gi, '');
      newPrompt = newPrompt.replace(/,\s*with\s+[a-z\s-]+\s+skin\s+tone/gi, '');
    }

    // 2. Update Length
    const lengthRegex = /(?:hair\s+length\s+is\s+exactly\s+)?\d+\s*(?:inches?|-inch)(?:\s*long)?/gi;
    if (hairLength !== 'Default') {
      const lengthDesc = `hair length is exactly ${hairLength}`;
      if (lengthRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(lengthRegex, lengthDesc);
      } else {
        newPrompt += `, ${lengthDesc}`;
      }
    } else {
      // Remove length if set to Default
      newPrompt = newPrompt.replace(/,\s*hair\s+length\s+is\s+exactly\s+\d+\s*(?:inches?|-inch)/gi, '');
      newPrompt = newPrompt.replace(/hair\s+length\s+is\s+exactly\s+\d+\s*(?:inches?|-inch)/gi, '');
      newPrompt = newPrompt.replace(/,\s*\d+\s*(?:inches?|-inch)(?:\s*long)?/gi, '');
      newPrompt = newPrompt.replace(/\d+\s*(?:inches?|-inch)(?:\s*long)?/gi, '');
    }
    
    // 3. Update Color
    if (hairColor !== 'Default') {
      let foundColor = false;
      const sortedColors = [...HAIR_COLORS]
        .filter(c => c !== 'Default')
        .sort((a, b) => b.length - a.length);

      for (const color of sortedColors) {
        const r = new RegExp(`\\b${color}\\b`, 'gi');
        if (r.test(newPrompt)) {
          newPrompt = newPrompt.replace(r, hairColor);
          foundColor = true;
        }
      }
      
      if (!foundColor) {
        const variations = [
          { regex: /salt\s*and\s*pepper/i, replacement: hairColor },
          { regex: /chocolate-to-caramel\s*ombre/i, replacement: hairColor },
          { regex: /ginger\s*orange/i, replacement: hairColor },
          { regex: /rose\s*gold\s*pink/i, replacement: hairColor }
        ];
        for (const v of variations) {
          if (v.regex.test(newPrompt)) {
            newPrompt = newPrompt.replace(v.regex, hairColor);
            foundColor = true;
          }
        }
      }

      if (!foundColor) {
        const genericColorRegex = /([a-z\s]+color)/i;
        if (genericColorRegex.test(newPrompt)) {
          newPrompt = newPrompt.replace(genericColorRegex, `${hairColor} color`);
        } else {
          newPrompt += `, ${hairColor} color`;
        }
      }
    } else {
      // If hair color is Default, we don't necessarily remove it because it's a core attribute of a wig
      // but we could try to remove specific non-default colors if they were added by us
    }

    // 4. Add/Update/Remove Model Details
    if (modelEyeColor !== 'Default') {
      const eyeRegex = /with\s+stunning\s+[a-z]+\s+eyes/gi;
      const anyEyeRegex = /[a-z]+\s+eyes/gi;
      if (eyeRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(eyeRegex, `with stunning ${modelEyeColor} eyes`);
      } else if (anyEyeRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(anyEyeRegex, `${modelEyeColor} eyes`);
      } else {
        newPrompt += `, with stunning ${modelEyeColor} eyes`;
      }
    } else {
      // Remove eye color if set to Default
      newPrompt = newPrompt.replace(/,\s*with\s+stunning\s+[a-z]+\s+eyes/gi, '');
      newPrompt = newPrompt.replace(/with\s+stunning\s+[a-z]+\s+eyes/gi, '');
      newPrompt = newPrompt.replace(/,\s*[a-z]+\s+eyes/gi, '');
    }

    if (modelBodyType !== 'Default') {
      // Body type is now integrated into the main model description in section 1
      // But we still want to ensure it's removed if it was added as a standalone tag previously
      const bodyRegex = /curvy\s+plus-size|full-figured|slender\s+slim\s+build|toned\s+athletic\s+build|curvy\s+hourglass\s+figure|[a-z\s-]+\s+body\s+type/gi;
      if (!newPrompt.toLowerCase().includes(modelRace.toLowerCase())) {
        if (bodyRegex.test(newPrompt)) {
          newPrompt = newPrompt.replace(bodyRegex, `${modelBodyType} body type`);
        } else {
          newPrompt += `, ${modelBodyType} body type`;
        }
      }
    } else {
      // Remove body type if set to Default
      const bodyRegex = /curvy\s+plus-size|full-figured|slender\s+slim\s+build|toned\s+athletic\s+build|curvy\s+hourglass\s+figure|[a-z\s-]+\s+body\s+type/gi;
      newPrompt = newPrompt.replace(new RegExp(`,?\\s*${bodyRegex.source}`, 'gi'), '');
      newPrompt = newPrompt.replace(bodyRegex, '');
    }
    
    // 5. Update Photo Type
    if (photoType !== 'Default') {
      const shotTypes = [
        'Full Length', 'Shoulder Up', 'Bust Up', 'Close-up', 'Profile View', 'Action Shot',
        'full body shot', 'head and shoulders view', 'medium close-up', 'extreme close-up', 'side profile view',
        'portrait', 'wide angle', 'full length view', 'standing', 'head to toe'
      ];
      let foundShot = false;
      
      let shotDesc = photoType;
      if (photoType === 'Full Length') shotDesc = "full body shot, standing, showing model from head to toe, wide angle, full length view";
      if (photoType === 'Shoulder Up') shotDesc = "shoulder-up portrait, head and shoulders view";
      if (photoType === 'Bust Up') shotDesc = "bust-up shot, medium close-up, showing head and chest";
      if (photoType === 'Close-up') shotDesc = "extreme close-up, macro shot of hair texture and face";
      if (photoType === 'Profile View') shotDesc = "side profile view, showing the side of the head and hair";
      
      for (const shot of shotTypes) {
        const r = new RegExp(shot, 'gi');
        if (r.test(newPrompt)) {
          newPrompt = newPrompt.replace(r, shotDesc);
          foundShot = true;
          break;
        }
      }
      if (!foundShot) {
        // For full length, we want it at the front for maximum impact
        if (photoType === 'Full Length') {
          newPrompt = `${shotDesc}, ${newPrompt}`;
        } else {
          newPrompt = `${shotDesc}, ${newPrompt}`;
        }
      }
    }

    // 5.5 Update Outfit Theme
    if (outfitTheme !== 'Default' && outfitTheme !== 'None') {
      const outfitRegex = /wearing\s+[^,.]+|outfit\s+is\s+[^,.]+|dressed\s+in\s+[^,.]+/gi;
      let outfitDesc = outfitTheme.toLowerCase();
      
      if (outfitTheme === 'Casual Chic') outfitDesc = "wearing casual chic attire, stylish everyday clothes";
      if (outfitTheme === 'Elegant Evening Wear') outfitDesc = "wearing an elegant evening gown, sophisticated formal wear";
      if (outfitTheme === 'Professional Business') outfitDesc = "wearing professional business attire, sharp blazer and trousers";
      if (outfitTheme === 'Streetwear Fashion') outfitDesc = "wearing trendy streetwear fashion, urban style outfit";
      if (outfitTheme === 'Bohemian Style') outfitDesc = "wearing bohemian style clothing, flowy fabrics and artistic patterns";
      if (outfitTheme === 'High-Fashion Editorial') outfitDesc = "wearing high-fashion editorial couture, avant-garde designer outfit";
      if (outfitTheme === 'Athleisure') outfitDesc = "wearing stylish athleisure wear, premium workout clothes";
      if (outfitTheme === 'Minimalist Modern') outfitDesc = "wearing minimalist modern clothing, clean lines and neutral tones";

      if (outfitRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(outfitRegex, outfitDesc);
      } else {
        newPrompt += `, ${outfitDesc}`;
      }
    }

    // 6. Update Background
    if (background !== 'Default') {
      const backgroundKeywords = ['set in', 'background is', 'against a', 'setting is', 'environment is', 'with a background of'];
      let foundBackground = false;
      for (const keyword of backgroundKeywords) {
        const r = new RegExp(`${keyword}\\s+[^,.]+`, 'gi');
        if (r.test(newPrompt)) {
          newPrompt = newPrompt.replace(r, `${keyword} a ${background}`);
          foundBackground = true;
          break;
        }
      }
      if (!foundBackground) {
        newPrompt += `, set in a ${background}`;
      }
    } else {
      // Remove background if set to Default
      const backgroundKeywords = ['set in', 'background is', 'against a', 'setting is', 'environment is', 'with a background of'];
      for (const keyword of backgroundKeywords) {
        const r = new RegExp(`,?\\s*${keyword}\\s+[^,.]+`, 'gi');
        newPrompt = newPrompt.replace(r, '');
      }
    }

    // 6.5 Update Lace Status
    if (laceStatus !== 'Default') {
      const laceRegex = /lace\s+(?:un)?cut|seamlessly\s+melted\s+hairline|no\s+visible\s+lace\s+on\s+forehead|invisible\s+lace\s+front|perfectly\s+blended\s+edges|realistic\s+scalp\s+transition|visible\s+lace|invisible\s+lace|visible\s+excess\s+lace|raw\s+lace\s+edges|uncustomized\s+lace\s+front/gi;
      let laceDesc = laceStatus.toLowerCase();
      
      if (laceStatus === 'Lace Cut') {
        laceDesc = "lace cut, seamlessly melted hairline, no visible lace on forehead, invisible lace front, perfectly blended edges, realistic scalp transition";
      } else if (laceStatus === 'Lace Uncut') {
        laceDesc = "lace uncut, visible excess lace hanging from the hairline, raw lace edges, uncustomized lace front";
      }

      if (laceRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(laceRegex, laceDesc);
      } else {
        newPrompt += `, with ${laceDesc}`;
      }
    } else {
      const laceRegex = /lace\s+(?:un)?cut|seamlessly\s+melted\s+hairline|no\s+visible\s+lace\s+on\s+forehead|invisible\s+lace\s+front|perfectly\s+blended\s+edges|realistic\s+scalp\s+transition|visible\s+lace|invisible\s+lace|visible\s+excess\s+lace|raw\s+lace\s+edges|uncustomized\s+lace\s+front/gi;
      newPrompt = newPrompt.replace(new RegExp(`,?\\s*with\\s+${laceRegex.source}`, 'gi'), '');
      newPrompt = newPrompt.replace(new RegExp(`,?\\s*${laceRegex.source}`, 'gi'), '');
    }

    // 6.6 Update Baby Hair Status
    if (babyHairStatus !== 'Default') {
      const babyHairRegex = /(?:no\s+)?baby\s+hair/gi;
      let babyHairDesc = babyHairStatus.toLowerCase();
      
      if (babyHairStatus === 'No Baby Hair') {
        babyHairDesc = "absolutely no baby hair, clean hairline with no baby hair visible, no styled edges, no wispy hairs along the forehead";
      } else if (babyHairStatus === 'Baby Hair') {
        babyHairDesc = "with natural baby hair along the hairline";
      }

      if (babyHairRegex.test(newPrompt)) {
        newPrompt = newPrompt.replace(babyHairRegex, babyHairDesc);
      } else {
        newPrompt += `, ${babyHairDesc}`;
      }
    } else {
      newPrompt = newPrompt.replace(/,\s*(?:no\s+)?baby\s+hair/gi, '');
      newPrompt = newPrompt.replace(/(?:no\s+)?baby\s+hair/gi, '');
    }
    
    // 7. Cleanup and Deduplicate
    // Split by commas, trim, remove empty
    let phrases = newPrompt.split(',').map(p => p.trim()).filter(p => p.length > 0);
    
    // More aggressive deduplication: remove phrases that are contained within other phrases
    const uniquePhrases: string[] = [];
    for (const phrase of phrases) {
      const lowerPhrase = phrase.toLowerCase();
      let isDuplicate = false;
      for (let i = 0; i < uniquePhrases.length; i++) {
        const existingLower = uniquePhrases[i].toLowerCase();
        if (existingLower.includes(lowerPhrase)) {
          isDuplicate = true;
          break;
        }
        if (lowerPhrase.includes(existingLower)) {
          uniquePhrases[i] = phrase; // Keep the longer one
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        uniquePhrases.push(phrase);
      }
    }
    newPrompt = uniquePhrases.join(', ');

    newPrompt = newPrompt
      .replace(/,\s*\./g, '.')
      .replace(/\s+/g, ' ')
      .replace(/,\s*$/g, '')
      .trim();
    
    // Ensure the prompt ends with a period if it doesn't have one
    if (newPrompt && !newPrompt.endsWith('.')) {
      newPrompt += '.';
    }
    
    return newPrompt;
  };

  const handleUpdatePrompt = () => {
    const newPrompt = getMergedPrompt(prompt, {
      hairLength,
      hairStyle,
      bangsStyle,
      hairColor,
      modelRace,
      modelSkinTone,
      modelEyeColor,
      modelBodyType,
      outfitTheme,
      photoType,
      background,
      mannequinSkinTone,
      panelLayout,
      wigType,
      laceStatus,
      babyHairStatus,
      isHyperRealistic,
      isMultipleImages: imageCount > 1
    });
    setPrompt(newPrompt);
  };

  const handleRandomize = () => {
    const getRandom = (arr: string[]) => {
      const filtered = arr.filter(item => item !== 'Default' && item !== 'None');
      return filtered[Math.floor(Math.random() * filtered.length)];
    };

    const isMannequin = Math.random() > 0.5;
    let newModelRace = 'Default';
    let newModelSkinTone = 'Default';
    let newMannequinSkinTone = 'None';

    if (isMannequin) {
      newMannequinSkinTone = getRandom(MANNEQUIN_SKIN_TONES);
    } else {
      newModelRace = getRandom(MODEL_RACES);
      const skinToneOptions = SKIN_TONES_BY_RACE[newModelRace] || ['Default'];
      newModelSkinTone = getRandom(skinToneOptions);
    }

    const newHairLength = getRandom(HAIR_LENGTHS);
    const newHairStyle = getRandom(HAIR_STYLES);
    const newBangsStyle = getRandom(BANGS_STYLES);
    const newHairColor = getRandom(HAIR_COLORS);
    const newModelEyeColor = getRandom(MODEL_EYE_COLORS);
    const newModelBodyType = getRandom(MODEL_BODY_TYPES);
    const newOutfitTheme = getRandom(OUTFIT_THEMES);
    const newPhotoType = getRandom(PHOTO_TYPES);
    const newBackground = getRandom(BACKGROUND_OPTIONS);
    const newPanelLayout = Math.random() > 0.8 ? getRandom(PANEL_LAYOUTS) : 'Single Panel';
    const newWigType = getRandom(WIG_TYPES);
    const newLaceStatus = getRandom(LACE_OPTIONS);
    const newBabyHairStatus = getRandom(BABY_HAIR_OPTIONS);
    const newIsHyperRealistic = Math.random() > 0.5;

    setHairLength(newHairLength);
    setHairStyle(newHairStyle);
    setBangsStyle(newBangsStyle);
    setHairColor(newHairColor);
    setModelRace(newModelRace);
    setModelSkinTone(newModelSkinTone);
    setModelEyeColor(newModelEyeColor);
    setModelBodyType(newModelBodyType);
    setOutfitTheme(newOutfitTheme);
    setPhotoType(newPhotoType);
    setBackground(newBackground);
    setMannequinSkinTone(newMannequinSkinTone);
    setPanelLayout(newPanelLayout);
    setWigType(newWigType);
    setLaceStatus(newLaceStatus);
    setBabyHairStatus(newBabyHairStatus);
    setIsHyperRealistic(newIsHyperRealistic);

    let basePrompt = prompt;
    // Randomly decide whether to pick a new preset
    if (Math.random() > 0.3) {
      const randomPreset = PRESET_PROMPTS[Math.floor(Math.random() * PRESET_PROMPTS.length)];
      basePrompt = randomPreset.prompt;
    }

    const newPrompt = getMergedPrompt(basePrompt, {
      hairLength: newHairLength,
      hairStyle: newHairStyle,
      bangsStyle: newBangsStyle,
      hairColor: newHairColor,
      modelRace: newModelRace,
      modelSkinTone: newModelSkinTone,
      modelEyeColor: newModelEyeColor,
      modelBodyType: newModelBodyType,
      outfitTheme: newOutfitTheme,
      photoType: newPhotoType,
      background: newBackground,
      mannequinSkinTone: newMannequinSkinTone,
      panelLayout: newPanelLayout,
      wigType: newWigType,
      laceStatus: newLaceStatus,
      babyHairStatus: newBabyHairStatus,
      isHyperRealistic: newIsHyperRealistic,
      isMultipleImages: imageCount > 1
    });

    setPrompt(newPrompt);
  };

  const performGeneration = async (currentPrompt: string, currentAspectRatio: AspectRatio, currentCount: number) => {
    setIsLoading(true);
    setError(null);
    // Don't clear images immediately to avoid jarring UI jump
    // setImages([]); 

    try {
      console.log('Generating images with prompt:', currentPrompt);
      const generatedImages = await generateImages(currentPrompt, currentAspectRatio, currentCount);
      
      if (generatedImages && generatedImages.length > 0) {
        setImages(generatedImages);
        setLastSuccessfulPrompt(currentPrompt);
        setLastSuccessfulAspectRatio(currentAspectRatio);
        setLastSuccessfulImageCount(currentCount);
        setSavedIndices(new Set());
      } else {
        throw new Error('No images were generated. Please try a different prompt.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    const finalPrompt = getMergedPrompt(prompt, {
      hairLength,
      hairStyle,
      bangsStyle,
      hairColor,
      modelRace,
      modelSkinTone,
      modelEyeColor,
      modelBodyType,
      outfitTheme,
      photoType,
      background,
      mannequinSkinTone,
      panelLayout,
      wigType,
      laceStatus,
      babyHairStatus,
      isHyperRealistic,
      isMultipleImages: imageCount > 1
    });

    performGeneration(finalPrompt, aspectRatio, imageCount);
  };

  const handleRegenerate = () => {
    if (!lastSuccessfulPrompt) {
        setError('No previous generation to regenerate.');
        return;
    }
    performGeneration(lastSuccessfulPrompt, lastSuccessfulAspectRatio, lastSuccessfulImageCount);
  };

  const handleRegenerateSingle = async (index: number) => {
    if (!lastSuccessfulPrompt) {
      setError('No previous generation to regenerate.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateImages(lastSuccessfulPrompt, lastSuccessfulAspectRatio, 1);
      
      if (result && result.length > 0) {
        const newImages = [...images];
        newImages[index] = result[0];
        setImages(newImages);
      } else {
        throw new Error('Failed to generate a new version.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (base64Data: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64Data}`;
    link.download = `the-crown-vault-image-${Date.now()}-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const handleSaveToGallery = (img: GeneratedImage, index: number) => {
    if (!lastSuccessfulPrompt) return;
    
    const src = `data:image/jpeg;base64,${img.image.imageBytes}`;
    addItem({
      type: 'image',
      src: src,
      prompt: lastSuccessfulPrompt,
    });
    
    setSavedIndices(prev => new Set(prev).add(index));
  };

  return (
    <div className="space-y-8">
      <div className="bg-stone-900 p-6 rounded-xl shadow-lg border border-stone-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">
                Quick Start Presets
            </label>
            <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((p) => (
                    <button 
                      type="button" 
                      key={p.name} 
                      onClick={() => {
                        setPrompt(p.prompt);
                        resetSettings();
                      }} 
                      className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full border transition-all duration-300 ${prompt === p.prompt ? 'bg-black border-gold text-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] drop-shadow-[0_0_2px_rgba(212,175,55,0.8)]' : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-gold/50 hover:text-gold'}`}
                    >
                      {p.name}
                    </button>
                ))}
            </div>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-bold text-gold tracking-wide mb-1">
              Generation Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              className="w-full p-3 bg-stone-900/50 border border-stone-800 text-white rounded-lg shadow-inner focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all duration-300"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A photo of a golden retriever playing in a park..."
            />
            <div className="flex justify-end gap-4 mt-2">
              <button
                type="button"
                onClick={handleRandomize}
                className="text-xs font-bold text-gold hover:text-yellow-400 transition-colors flex items-center gap-1"
                title="Randomize all model and hair settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Randomize
              </button>
              <button
                type="button"
                onClick={handleUpdatePrompt}
                className="text-xs font-bold text-gold hover:text-yellow-400 transition-colors flex items-center gap-1"
                title="Apply these selections to the text prompt below"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Update Prompt Text
              </button>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-xl">
            <label htmlFor="mannequinSkinTone" className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] mb-3">
              Mannequin Settings
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <select
                id="mannequinSkinTone"
                className="flex-1 min-w-[200px] p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={mannequinSkinTone}
                onChange={(e) => {
                  const newTone = e.target.value;
                  setMannequinSkinTone(newTone);
                  // Reset model race when mannequin is selected
                  if (newTone !== 'None' && newTone !== 'Default') {
                    setModelRace('Default');
                    setModelSkinTone('Default');
                  }
                }}
              >
                {MANNEQUIN_SKIN_TONES.map((tone) => (
                  <option key={tone} value={tone}>{tone === 'None' ? 'None' : `${tone} Mannequin`}</option>
                ))}
              </select>
              <select
                id="panelLayout"
                className="flex-1 min-w-[200px] p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={panelLayout}
                onChange={(e) => setPanelLayout(e.target.value)}
              >
                {PANEL_LAYOUTS.map((layout) => (
                  <option key={layout} value={layout}>{layout}</option>
                ))}
              </select>
              <div className="text-xs text-stone-500 italic">
                Choose style and layout for product-only shots.
              </div>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-xl">
            <label htmlFor="wigType" className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] mb-3">
              Hair Weave / Wig Type
            </label>
            <div className="flex items-center gap-4">
              <select
                id="wigType"
                className="flex-1 p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={wigType}
                onChange={(e) => setWigType(e.target.value)}
              >
                {WIG_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="text-xs text-stone-500 italic">
                Select the specific construction type.
              </div>
            </div>
          </div>

          <div className="luxury-card p-5 rounded-xl">
            <label htmlFor="laceStatus" className="block text-[10px] font-bold text-gold/50 uppercase tracking-[0.2em] mb-3">
              Lace & Edge Settings
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <select
                  id="laceStatus"
                  className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  value={laceStatus}
                  onChange={(e) => setLaceStatus(e.target.value)}
                >
                  {LACE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="text-xs text-stone-500 italic">
                  Specify if the wig lace should appear cut or uncut.
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <select
                  id="babyHairStatus"
                  className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  value={babyHairStatus}
                  onChange={(e) => setBabyHairStatus(e.target.value)}
                >
                  {BABY_HAIR_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div className="text-xs text-stone-500 italic">
                  Specify if the wig should have baby hair.
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="hairStyle" className="block text-sm font-medium text-stone-300 mb-1">
                Hair Style Type
              </label>
              <select
                id="hairStyle"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={hairStyle}
                onChange={(e) => setHairStyle(e.target.value)}
              >
                {HAIR_STYLES.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="bangsStyle" className="block text-sm font-medium text-stone-300 mb-1">
                Bangs Style
              </label>
              <select
                id="bangsStyle"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={bangsStyle}
                onChange={(e) => setBangsStyle(e.target.value)}
              >
                {BANGS_STYLES.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="hairLength" className="block text-sm font-medium text-stone-300 mb-1">
                Hair Length
              </label>
              <select
                id="hairLength"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={hairLength}
                onChange={(e) => setHairLength(e.target.value)}
              >
                {HAIR_LENGTHS.map((length) => (
                  <option key={length} value={length}>{length}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="hairColor" className="block text-sm font-medium text-stone-300 mb-1">
                Hair Color
              </label>
              <select
                id="hairColor"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={hairColor}
                onChange={(e) => setHairColor(e.target.value)}
              >
                {HAIR_COLORS.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modelRace" className="block text-sm font-medium text-stone-300 mb-1">
                Model Race
              </label>
              <select
                id="modelRace"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={modelRace}
                onChange={(e) => {
                  const newRace = e.target.value;
                  setModelRace(newRace);
                  // Reset skin tone when race changes
                  setModelSkinTone('Default');
                  // Reset mannequin when race is selected
                  if (newRace !== 'Default') {
                    setMannequinSkinTone('None');
                  }
                }}
              >
                {MODEL_RACES.map((race) => (
                  <option key={race} value={race}>{race}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="modelSkinTone" className="block text-sm font-medium text-stone-300 mb-1">
                Model Skin Tone / Complexion
              </label>
              <select
                id="modelSkinTone"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={modelSkinTone}
                onChange={(e) => setModelSkinTone(e.target.value)}
              >
                {(SKIN_TONES_BY_RACE[modelRace] || ['Default']).map((tone) => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="modelBodyType" className="block text-sm font-medium text-stone-300 mb-1">
                Model Body Type
              </label>
              <select
                id="modelBodyType"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={modelBodyType}
                onChange={(e) => setModelBodyType(e.target.value)}
              >
                {MODEL_BODY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="outfitTheme" className="block text-sm font-medium text-stone-300 mb-1">
                Outfit Theme
              </label>
              <select
                id="outfitTheme"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={outfitTheme}
                onChange={(e) => setOutfitTheme(e.target.value)}
              >
                {OUTFIT_THEMES.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="photoType" className="block text-sm font-medium text-stone-300 mb-1">
                Photo Shot Type
              </label>
              <select
                id="photoType"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={photoType}
                onChange={(e) => setPhotoType(e.target.value)}
              >
                {PHOTO_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modelEyeColor" className="block text-sm font-medium text-stone-300 mb-1">
                Model or Mannequin Eye Color
              </label>
              <select
                id="modelEyeColor"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={modelEyeColor}
                onChange={(e) => setModelEyeColor(e.target.value)}
              >
                {MODEL_EYE_COLORS.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="background" className="block text-sm font-medium text-stone-300 mb-1">
                Background / Setting
              </label>
              <select
                id="background"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              >
                {BACKGROUND_OPTIONS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="aspectRatio" className="block text-sm font-medium text-stone-300 mb-1">
                Aspect Ratio
              </label>
              <select
                id="aspectRatio"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              >
                {Object.values(AspectRatio).map((ratio) => (
                  <option key={ratio} value={ratio}>{ratio}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="imageCount" className="block text-sm font-medium text-stone-300 mb-1">
                Number of Images (1-4)
              </label>
              <select
                id="imageCount"
                className="w-full p-2.5 bg-black border border-stone-800 text-stone-300 rounded-md text-sm focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
                value={imageCount}
                onChange={(e) => setImageCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={`flex items-center p-5 rounded-xl border transition-all duration-300 ${isHyperRealistic ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-stone-900/30 border-gold/10'}`}>
            <label className="flex items-center cursor-pointer group w-full">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isHyperRealistic}
                  onChange={(e) => setIsHyperRealistic(e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isHyperRealistic ? 'bg-black/60 shadow-inner' : 'bg-stone-800'}`}></div>
                <div className={`dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${isHyperRealistic ? 'transform translate-x-4 bg-white shadow-md' : 'bg-white'}`}></div>
              </div>
              <div className={`ml-3 font-bold text-xs uppercase tracking-widest transition-colors ${isHyperRealistic ? 'text-black' : 'text-stone-300 group-hover:text-gold'}`}>
                Hyper-Realistic Mode
              </div>
            </label>
            <div className={`ml-auto text-[10px] italic uppercase tracking-wider transition-colors ${isHyperRealistic ? 'text-black/80 font-semibold' : 'text-stone-500'}`}>
              Maximum Detail & Realism
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 flex-1 md:flex-none">
              <Button 
                type="submit" 
                isLoading={isLoading}
                className="min-w-[180px]"
              >
                Generate Images
              </Button>
              {(lastSuccessfulPrompt || images.length > 0) && (
                <Button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="!from-stone-700 !to-stone-600 hover:!from-stone-600 hover:!to-stone-500 focus:!ring-stone-500 min-w-[140px]"
                >
                  Regenerate
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <button
                type="button"
                onClick={handleRandomize}
                className="text-xs font-bold text-gold hover:text-yellow-400 transition-colors flex items-center gap-1"
                title="Randomize all model and hair settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Randomize
              </button>
              <button
                type="button"
                onClick={handleUpdatePrompt}
                className="text-xs font-bold text-gold hover:text-yellow-400 transition-colors flex items-center gap-1"
                title="Apply these selections to the text prompt below"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Update Prompt Text
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="text-red-400 p-4 bg-red-900/50 border border-red-500/50 rounded-md">{error}</div>}
      
      {isLoading && <Spinner message="Generating your stunning product photos..." />}

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="group relative">
              <div className={`overflow-hidden rounded-lg shadow-lg border border-stone-800 ${aspectRatioClasses[lastSuccessfulAspectRatio]}`}>
                <img
                  src={`data:image/jpeg;base64,${img.image.imageBytes}`}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 rounded-lg">
                <button
                  onClick={() => handleSaveToGallery(img, index)}
                  className={`w-32 ${savedIndices.has(index) ? 'bg-emerald-600' : 'bg-royal-purple hover:bg-royal-purple-light'} text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center justify-center gap-2 border border-gold/20`}
                  title="Save to Gallery"
                >
                  {savedIndices.has(index) ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium">Saved</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium">Save to Gallery</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownload(img.image.imageBytes, index)}
                  className="w-32 bg-stone-700 hover:bg-stone-600 text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200 flex items-center justify-center gap-2"
                  title="Download Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-xs font-medium">Download</span>
                </button>
                <button
                  onClick={() => handleRegenerateSingle(index)}
                  disabled={isLoading}
                  className="w-32 bg-stone-800/80 hover:bg-stone-700 text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Regenerate this specific image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-xs font-medium">Regenerate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;