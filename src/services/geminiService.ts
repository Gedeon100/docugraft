import { GoogleGenAI } from '@google/genai';
import { StoryboardScene } from '../types';
import { createProductSvgDataUri } from '../data/defaultTemplates';

export interface ScriptGenerationParams {
  productName: string;
  category: string;
  targetAudience: string;
  keyBenefit: string;
  offerPrice?: string;
  aspectRatio?: '9:16' | '1:1' | '16:9';
}

export async function generateAdStoryboard(
  params: ScriptGenerationParams,
  baseImageUrl?: string
): Promise<StoryboardScene[]> {
  const { productName, category, targetAudience, keyBenefit, offerPrice } = params;
  const imageToUse = baseImageUrl || createProductSvgDataUri('sneaker');

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Tu es un expert mondial en création de publicités vidéo TikTok, Reels et YouTube Ads à très haute conversion pour les créateurs et marques e-commerce.
Génère un storyboard publicitaire en 5 scènes percutantes en français pour le produit suivant :
- Produit : ${productName}
- Catégorie : ${category}
- Cible : ${targetAudience}
- Bénéfice clé : ${keyBenefit}
- Offre : ${offerPrice || 'Offre spéciale'}

Renvoie UNIQUEMENT un tableau JSON valide (sans backticks markdown si possible, ou pur JSON) contenant exactement 5 scènes avec les champs :
[
  {
    "title": "01. L'Accroche",
    "role": "hook",
    "durationSec": 3,
    "motionPreset": "kinetic_glitch",
    "transition": "flash_white",
    "headline": "ACCROCHE CHOC EN MAJUSCULES (max 8 mots)",
    "subheadline": "Sous-titre engageant",
    "captionPosition": "top",
    "captionStyle": "tiktok_bold",
    "voiceoverScript": "Script voix off percutant de 2 secondes max."
  },
  {
    "title": "02. Le Problème",
    "role": "problem",
    "durationSec": 3,
    "motionPreset": "ken_burns_in",
    "transition": "slide_left",
    "headline": "LE PROBLÈME FRUSTRANT",
    "subheadline": "Explication de la douleur client",
    "captionPosition": "center",
    "captionStyle": "tiktok_bold",
    "voiceoverScript": "Script voix off expliquant la frustration."
  },
  {
    "title": "03. La Révélation",
    "role": "solution",
    "durationSec": 4,
    "motionPreset": "neon_sweep",
    "transition": "zoom_in",
    "headline": "NOM PRODUIT : LA RÉVOLUTION",
    "subheadline": "Bénéfice majeur visible",
    "captionPosition": "bottom",
    "captionStyle": "neon_glow",
    "voiceoverScript": "Script voix off présentant la solution magique."
  },
  {
    "title": "04. Preuve Sociale",
    "role": "proof",
    "durationSec": 3,
    "motionPreset": "parallax_tilt",
    "transition": "wipe_up",
    "headline": "NOTÉ 4.9/5 PAR LES UTILISATEURS",
    "subheadline": "Témoignage court enthousiaste",
    "captionPosition": "center",
    "captionStyle": "clean_boxed",
    "voiceoverScript": "Script voix off avec chiffre d'utilisateurs conquis."
  },
  {
    "title": "05. Appel à l'Action",
    "role": "cta",
    "durationSec": 3,
    "motionPreset": "dynamic_snap",
    "transition": "fade",
    "headline": "COMMANDER MAINTENANT · -40%",
    "subheadline": "Code promo exclusif : VIP2026",
    "captionPosition": "bottom",
    "captionStyle": "tiktok_bold",
    "voiceoverScript": "Cliquez vite sur le lien ci-dessous pour profiter de l'offre limitée !"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.map((item, idx) => ({
            id: `gen_scene_${Date.now()}_${idx}`,
            title: item.title || `Scène 0${idx + 1}`,
            role: item.role || 'custom',
            imageUrl: imageToUse,
            durationSec: item.durationSec || 3.5,
            motionPreset: item.motionPreset || 'ken_burns_in',
            transition: item.transition || 'fade',
            headline: item.headline || productName.toUpperCase(),
            subheadline: item.subheadline || keyBenefit,
            captionPosition: item.captionPosition || 'bottom',
            captionStyle: item.captionStyle || 'tiktok_bold',
            overlays: idx === 0 ? [{
              id: `ov_gen_${idx}`,
              type: 'badge_limited',
              text: 'OFFRE SPÉCIALE',
              position: 'top_left',
              colorTheme: 'red',
              animation: 'pulse',
              startTimeSec: 0,
              durationSec: 3,
            }] : idx === 4 ? [{
              id: `ov_gen_${idx}`,
              type: 'cta_button',
              text: 'COMMANDER MAINTENANT',
              subtext: offerPrice || 'Livraison Offerte',
              position: 'bottom',
              colorTheme: 'indigo',
              animation: 'pulse',
              startTimeSec: 0,
              durationSec: 3,
            }] : [],
            voiceoverScript: item.voiceoverScript || '',
          }));
        }
      }
    } catch (err) {
      console.warn('Gemini API call skipped or fallback applied:', err);
    }
  }

  // Smart instantaneous local fallback generation
  const cleanName = (productName || 'Produit Révolutionnaire').toUpperCase();
  const cleanBenefit = keyBenefit || 'Résultats garantis dès la première utilisation';
  const cleanOffer = offerPrice || 'Offre Exceptionnelle';

  return [
    {
      id: `fallback_1_${Date.now()}`,
      title: "01. L'Accroche Stop-Scroll",
      role: 'hook',
      imageUrl: imageToUse,
      durationSec: 3,
      motionPreset: 'kinetic_glitch',
      transition: 'flash_white',
      headline: `NE COMMANDEZ PAS AVANT D'AVOIR VU CECI !`,
      subheadline: `La révélation 2026 pour ${targetAudience || 'les passionnés'}`,
      captionPosition: 'top',
      captionStyle: 'tiktok_bold',
      voiceoverScript: `Ne commandez rien avant d'avoir vu ceci ! Voici la révélation que vous attendiez.`,
      overlays: [
        {
          id: `ov_fb_1`,
          type: 'badge_limited',
          text: 'VIRAL 2026',
          position: 'top_left',
          colorTheme: 'red',
          animation: 'pulse',
          startTimeSec: 0,
          durationSec: 3,
        },
      ],
    },
    {
      id: `fallback_2_${Date.now()}`,
      title: '02. La Frustration / Problème',
      role: 'problem',
      imageUrl: imageToUse,
      durationSec: 3,
      motionPreset: 'ken_burns_in',
      transition: 'slide_left',
      headline: `MARRE DES SOLUTIONS TRADITIONNELLES ?`,
      subheadline: `Perte de temps, déceptions et coûts excessifs...`,
      captionPosition: 'center',
      captionStyle: 'tiktok_bold',
      voiceoverScript: `Vous en avez assez de perdre votre temps avec des solutions inefficaces ?`,
      overlays: [],
    },
    {
      id: `fallback_3_${Date.now()}`,
      title: '03. La Démonstration',
      role: 'solution',
      imageUrl: imageToUse,
      durationSec: 4,
      motionPreset: 'neon_sweep',
      transition: 'zoom_in',
      headline: `${cleanName} : ${cleanBenefit}`,
      subheadline: `Conçu sur-mesure pour votre quotidien.`,
      captionPosition: 'bottom',
      captionStyle: 'neon_glow',
      voiceoverScript: `Voici ${productName}. ${cleanBenefit}.`,
      overlays: [
        {
          id: `ov_fb_2`,
          type: 'badge_promo',
          text: cleanOffer,
          position: 'top_right',
          colorTheme: 'amber',
          animation: 'bounce',
          startTimeSec: 0,
          durationSec: 4,
        },
      ],
    },
    {
      id: `fallback_4_${Date.now()}`,
      title: '04. Preuve & Avis Clients',
      role: 'proof',
      imageUrl: imageToUse,
      durationSec: 3,
      motionPreset: 'parallax_tilt',
      transition: 'wipe_up',
      headline: `NOTÉ 4.9/5 PAR PLUS DE 10 000 CLIENTS`,
      subheadline: `« Le meilleur investissement de mon année ! »`,
      captionPosition: 'center',
      captionStyle: 'clean_boxed',
      voiceoverScript: `Déjà plus de dix mille clients conquis à travers le monde.`,
      overlays: [
        {
          id: `ov_fb_3`,
          type: 'badge_rating',
          text: '★ ★ ★ ★ ★ 4.9/5',
          subtext: 'Avis Vérifiés',
          position: 'top',
          colorTheme: 'emerald',
          animation: 'pop',
          startTimeSec: 0,
          durationSec: 3,
        },
      ],
    },
    {
      id: `fallback_5_${Date.now()}`,
      title: "05. Appel à l'Action & Promo",
      role: 'cta',
      imageUrl: imageToUse,
      durationSec: 3,
      motionPreset: 'dynamic_snap',
      transition: 'fade',
      headline: `CLIQUEZ CI-DESSOUS · LIVRAISON 24H OFFERTE`,
      subheadline: `Stock très limité pour les 50 premières commandes`,
      captionPosition: 'bottom',
      captionStyle: 'tiktok_bold',
      voiceoverScript: `Profitez-en maintenant en cliquant sur le lien ci-dessous avant rupture de stock !`,
      overlays: [
        {
          id: `ov_fb_4`,
          type: 'cta_button',
          text: 'COMMANDER MAINTENANT',
          subtext: 'Garantie Satisfait ou Remboursé',
          position: 'bottom',
          colorTheme: 'indigo',
          animation: 'pulse',
          startTimeSec: 0,
          durationSec: 3,
        },
      ],
    },
  ];
}
