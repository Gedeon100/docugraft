import { AdTemplate, AdProject, StoryboardScene } from '../types';

// High-fidelity vector SVG Data URIs for realistic demo products
export function createProductSvgDataUri(type: 'perfume' | 'headphones' | 'sneaker' | 'serum' | 'watch' | 'coffee'): string {
  let svgContent = '';

  if (type === 'perfume') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#141416"/>
            <stop offset="50%" stop-color="#1e1822"/>
            <stop offset="100%" stop-color="#0a080c"/>
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="#f5d77f"/>
            <stop offset="50%" stop-color="#d4af37"/>
            <stop offset="100%" stop-color="#aa8c2c"/>
          </linearGradient>
          <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
            <stop offset="30%" stop-color="rgba(255,255,255,0.1)"/>
            <stop offset="70%" stop-color="rgba(255,255,255,0.2)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.5)"/>
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(212, 175, 55, 0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg)"/>
        <circle cx="400" cy="500" r="320" fill="url(#glow)"/>
        <!-- Pedestal -->
        <ellipse cx="400" cy="740" rx="260" ry="40" fill="#18151c"/>
        <ellipse cx="400" cy="735" rx="250" ry="32" fill="#25202b"/>
        <!-- Perfume Bottle -->
        <rect x="280" y="420" width="240" height="280" rx="24" fill="#2e1d32" stroke="url(#gold)" stroke-width="4"/>
        <rect x="290" y="430" width="220" height="260" rx="18" fill="url(#glass)"/>
        <!-- Fragrance liquid inside -->
        <path d="M 292 520 Q 400 500 508 520 L 508 680 Q 400 690 292 680 Z" fill="rgba(212,175,55,0.45)"/>
        <!-- Cap and Neck -->
        <rect x="365" y="380" width="70" height="40" fill="url(#gold)"/>
        <rect x="340" y="290" width="120" height="90" rx="10" fill="#0d0d0f" stroke="url(#gold)" stroke-width="3"/>
        <!-- Label -->
        <rect x="320" y="520" width="160" height="90" rx="6" fill="#120e16" stroke="url(#gold)" stroke-width="1.5"/>
        <text x="400" y="555" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700" fill="#f5d77f" text-anchor="middle" letter-spacing="4">ÉLIXIR NOIR</text>
        <text x="400" y="580" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="500" fill="#e2c992" text-anchor="middle" letter-spacing="2">EAU DE PARFUM · 100ML</text>
        <line x1="350" y1="595" x2="450" y2="595" stroke="#d4af37" stroke-width="1"/>
      </svg>
    `;
  } else if (type === 'headphones') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg_h" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16"/>
            <stop offset="60%" stop-color="#111827"/>
            <stop offset="100%" stop-color="#030712"/>
          </linearGradient>
          <radialGradient id="cyan_glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.2)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4b5563"/>
            <stop offset="50%" stop-color="#1f2937"/>
            <stop offset="100%" stop-color="#111827"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg_h)"/>
        <circle cx="400" cy="460" r="300" fill="url(#cyan_glow)"/>
        <!-- Headband arch -->
        <path d="M 230 460 C 230 220, 570 220, 570 460" fill="none" stroke="url(#metallic)" stroke-width="36" stroke-linecap="round"/>
        <path d="M 270 380 C 270 260, 530 260, 530 380" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-opacity="0.8"/>
        <!-- Left Ear Cup -->
        <ellipse cx="230" cy="490" rx="55" ry="90" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <ellipse cx="230" cy="490" rx="40" ry="70" fill="#0f172a"/>
        <circle cx="230" cy="490" r="16" fill="#38bdf8" fill-opacity="0.4"/>
        <!-- Right Ear Cup -->
        <ellipse cx="570" cy="490" rx="55" ry="90" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <ellipse cx="570" cy="490" rx="40" ry="70" fill="#0f172a"/>
        <circle cx="570" cy="490" r="16" fill="#38bdf8" fill-opacity="0.4"/>
        <!-- Spec details -->
        <text x="400" y="660" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="3">SONIC ULTRA ANC</text>
        <text x="400" y="690" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="500" fill="#38bdf8" text-anchor="middle">RÉDUCTION ACTIVE 45dB · 60H AUTONOMIE</text>
      </svg>
    `;
  } else if (type === 'sneaker') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg_s" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#18181b"/>
            <stop offset="50%" stop-color="#27272a"/>
            <stop offset="100%" stop-color="#09090b"/>
          </linearGradient>
          <radialGradient id="orange_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(249, 115, 22, 0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg_s)"/>
        <circle cx="400" cy="500" r="320" fill="url(#orange_glow)"/>
        <!-- Speed lines -->
        <line x1="120" y1="360" x2="300" y2="360" stroke="#f97316" stroke-width="3" stroke-dasharray="8 6"/>
        <line x1="100" y1="410" x2="260" y2="410" stroke="#f97316" stroke-width="2" stroke-dasharray="12 8"/>
        <!-- Stylized Running Sneaker Silhouette -->
        <g transform="translate(140, 320) rotate(-12, 260, 160)">
          <!-- Sole Cushion -->
          <path d="M 40 260 C 120 280, 340 270, 480 230 C 500 220, 520 200, 500 220 C 440 260, 260 300, 40 280 Z" fill="#f97316"/>
          <path d="M 60 250 C 140 265, 330 255, 470 215 C 490 205, 440 235, 60 270 Z" fill="#fb923c"/>
          <!-- Shoe Body Upper -->
          <path d="M 90 240 C 100 170, 200 120, 270 110 C 330 150, 390 190, 460 210 C 380 230, 200 240, 90 240 Z" fill="#f4f4f5"/>
          <!-- Swoosh / Dynamic Wave Accent -->
          <path d="M 170 200 Q 280 160 380 180 Q 280 210 170 200 Z" fill="#ea580c"/>
          <!-- Heel Counter & Collar -->
          <path d="M 90 240 C 80 180, 130 140, 190 130 L 220 170 C 150 180, 120 210, 90 240 Z" fill="#18181b"/>
          <!-- Lacing Details -->
          <line x1="260" y1="125" x2="290" y2="155" stroke="#f97316" stroke-width="4"/>
          <line x1="280" y1="140" x2="310" y2="170" stroke="#f97316" stroke-width="4"/>
          <line x1="300" y1="155" x2="330" y2="185" stroke="#f97316" stroke-width="4"/>
        </g>
        <text x="400" y="700" font-family="'Plus Jakarta Sans', sans-serif" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="4">KINETIC PULSE 3</text>
        <text x="400" y="730" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#f97316" text-anchor="middle">PROPULSION CARBONE · POIDS PLUME 180G</text>
      </svg>
    `;
  } else if (type === 'serum') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg_sr" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#062e24"/>
            <stop offset="50%" stop-color="#021c16"/>
            <stop offset="100%" stop-color="#010f0b"/>
          </linearGradient>
          <radialGradient id="emerald_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(52, 211, 153, 0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg_sr)"/>
        <circle cx="400" cy="500" r="300" fill="url(#emerald_glow)"/>
        <!-- Botanical leaf silhouettes in background -->
        <path d="M 180 320 Q 240 260 300 340 Q 240 400 180 320 Z" fill="rgba(16, 185, 129, 0.15)"/>
        <path d="M 620 400 Q 560 340 500 420 Q 560 480 620 400 Z" fill="rgba(16, 185, 129, 0.15)"/>
        <!-- Dropper Bottle -->
        <rect x="320" y="440" width="160" height="260" rx="20" fill="rgba(255,255,255,0.12)" stroke="#10b981" stroke-width="2"/>
        <rect x="330" y="520" width="140" height="170" rx="10" fill="#047857" fill-opacity="0.3"/>
        <!-- Dropper Pipette Top -->
        <rect x="375" y="380" width="50" height="60" fill="#ffffff" rx="4"/>
        <path d="M 385 380 Q 400 320 415 380 Z" fill="#0f172a"/>
        <!-- Minimalist Label -->
        <rect x="340" y="490" width="120" height="120" rx="4" fill="#ffffff"/>
        <text x="400" y="525" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#064e3b" text-anchor="middle">BOTANIC LAB</text>
        <text x="400" y="550" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" fill="#10b981" text-anchor="middle">ACIDE HYALURONIQUE</text>
        <text x="400" y="575" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="500" fill="#334155" text-anchor="middle">99.8% NATUREL · 50ML</text>
        <text x="400" y="750" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="700" fill="#ecfdf5" text-anchor="middle">ÉCLAT INSTANTANÉ</text>
      </svg>
    `;
  } else if (type === 'watch') {
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg_w" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111827"/>
            <stop offset="50%" stop-color="#1f2937"/>
            <stop offset="100%" stop-color="#030712"/>
          </linearGradient>
          <radialGradient id="silver_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(148, 163, 184, 0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg_w)"/>
        <circle cx="400" cy="500" r="320" fill="url(#silver_glow)"/>
        <!-- Strap -->
        <rect x="340" y="160" width="120" height="680" rx="14" fill="#334155"/>
        <line x1="345" y1="180" x2="345" y2="820" stroke="#475569" stroke-width="2"/>
        <line x1="455" y1="180" x2="455" y2="820" stroke="#475569" stroke-width="2"/>
        <!-- Case -->
        <circle cx="400" cy="500" r="170" fill="#1e293b" stroke="#cbd5e1" stroke-width="12"/>
        <!-- Bezel & Dial -->
        <circle cx="400" cy="500" r="145" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
        <!-- Indices -->
        <line x1="400" y1="365" x2="400" y2="385" stroke="#f8fafc" stroke-width="4"/>
        <line x1="400" y1="615" x2="400" y2="635" stroke="#f8fafc" stroke-width="4"/>
        <line x1="265" y1="500" x2="285" y2="500" stroke="#f8fafc" stroke-width="4"/>
        <line x1="515" y1="500" x2="535" y2="500" stroke="#f8fafc" stroke-width="4"/>
        <!-- Hands -->
        <line x1="400" y1="500" x2="450" y2="440" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
        <line x1="400" y1="500" x2="340" y2="500" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
        <circle cx="400" cy="500" r="8" fill="#38bdf8"/>
        <!-- Subdial -->
        <circle cx="400" cy="560" r="30" fill="none" stroke="#64748b" stroke-width="1.5"/>
        <text x="400" y="440" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="2">ASTRON AUTOMATIC</text>
      </svg>
    `;
  } else {
    // coffee
    svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg_c" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2d150b"/>
            <stop offset="50%" stop-color="#1b0c05"/>
            <stop offset="100%" stop-color="#0a0402"/>
          </linearGradient>
          <radialGradient id="amber_glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(245, 158, 11, 0.25)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#bg_c)"/>
        <circle cx="400" cy="500" r="320" fill="url(#amber_glow)"/>
        <!-- Coffee pouch bag -->
        <path d="M 280 340 L 520 340 L 500 700 L 300 700 Z" fill="#3e2316" stroke="#f59e0b" stroke-width="2"/>
        <rect x="290" y="320" width="220" height="25" rx="4" fill="#24130a"/>
        <!-- Artisan Kraft Label -->
        <rect x="320" y="440" width="160" height="190" rx="8" fill="#d97706" fill-opacity="0.9"/>
        <text x="400" y="480" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="2">TORRÉFACTION 1886</text>
        <text x="400" y="510" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" fill="#fef3c7" text-anchor="middle">PUR ARABICA ÉTHIOPIE</text>
        <line x1="350" y1="525" x2="450" y2="525" stroke="#ffffff" stroke-width="1"/>
        <text x="400" y="555" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="500" fill="#ffffff" text-anchor="middle">NOTES CACAO & AGRUMES</text>
        <text x="400" y="585" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">GRAINS BIOLOGIQUES</text>
      </svg>
    `;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const SAMPLE_PRODUCTS = [
  {
    id: 'perfume',
    name: 'Élixir Noir (Parfum Luxe)',
    category: 'Luxe & Beauté',
    imageUrl: createProductSvgDataUri('perfume'),
    tagline: 'L’élégance magnétique qui captive les regards.',
    promoBadge: '-40% AUJOURD’HUI',
    price: '59€ au lieu de 99€',
  },
  {
    id: 'sneaker',
    name: 'Kinetic Pulse 3 (Sneakers)',
    category: 'Sport & Mode',
    imageUrl: createProductSvgDataUri('sneaker'),
    tagline: 'Dépassez vos limites avec la semelle carbone.',
    promoBadge: 'OFFRE LIMITÉE',
    price: '89€ (Livraison Offerte)',
  },
  {
    id: 'headphones',
    name: 'Sonic Ultra ANC (Casque)',
    category: 'High-Tech',
    imageUrl: createProductSvgDataUri('headphones'),
    tagline: 'Plongez dans le silence absolu avec 60H d’autonomie.',
    promoBadge: 'NOUVEAU',
    price: '129€ au lieu de 199€',
  },
  {
    id: 'serum',
    name: 'Botanic Lab Sérum Éclat',
    category: 'Cosmétique Bio',
    imageUrl: createProductSvgDataUri('serum'),
    tagline: 'Un teint éclatant et repulpé en seulement 7 jours.',
    promoBadge: 'BEST-SELLER',
    price: '29,90€ (Pack Duo Dispo)',
  },
  {
    id: 'watch',
    name: 'Astron Chronographe',
    category: 'Horlogerie',
    imageUrl: createProductSvgDataUri('watch'),
    tagline: 'La précision mécanique d’exception à votre poignet.',
    promoBadge: 'ÉDITION LIMITÉE',
    price: '189€ (Garantie 5 Ans)',
  },
  {
    id: 'coffee',
    name: 'Torréfaction 1886',
    category: 'Gastronomie',
    imageUrl: createProductSvgDataUri('coffee'),
    tagline: 'L’arôme intense des hauts plateaux d’Éthiopie.',
    promoBadge: '1 ACHETÉ = 1 OFFERT',
    price: '19,90€ le lot de 2',
  },
];

export const PRESET_TEMPLATES: AdTemplate[] = [
  {
    id: 'viral_ecommerce_tiktok',
    name: 'TikTok Viral — Accroche Choc & Conversion',
    category: 'E-Commerce / TikTok & Reels',
    description: 'Structure 5 scènes hyper-rythmée conçue pour stopper le scroll, créer le besoin et déclencher l’achat immédiat.',
    aspectRatio: '9:16',
    audioTheme: 'energetic_trap',
    scenes: [
      {
        id: 'scene_hook',
        title: '01. L’Accroche (Stop-Scroll)',
        role: 'hook',
        imageUrl: createProductSvgDataUri('sneaker'),
        durationSec: 3,
        motionPreset: 'kinetic_glitch',
        transition: 'flash_white',
        headline: 'ARRÊTEZ DE COURIR AVEC DES CHAUSSURES LOURDES !',
        subheadline: 'Voici le secret que les marques classiques vous cachent',
        captionPosition: 'top',
        captionStyle: 'tiktok_bold',
        voiceoverScript: 'Arrêtez de courir avec des chaussures lourdes ! Regardez attentivement ceci.',
        overlays: [
          {
            id: 'ov_1',
            type: 'badge_limited',
            text: 'ATTENTION CRÉATEURS',
            position: 'top_left',
            colorTheme: 'red',
            animation: 'pulse',
            startTimeSec: 0,
            durationSec: 3,
          },
        ],
      },
      {
        id: 'scene_problem',
        title: '02. Le Problème & La Douleur',
        role: 'problem',
        imageUrl: createProductSvgDataUri('sneaker'),
        durationSec: 3,
        motionPreset: 'ken_burns_in',
        transition: 'slide_left',
        headline: 'Fatigue musculaire, ampoules et zéro relance...',
        subheadline: '94% des coureurs souffrent d’un mauvais amorti',
        captionPosition: 'center',
        captionStyle: 'tiktok_bold',
        voiceoverScript: 'Chaque foulée vous épuise et vous perdez votre énergie à cause d\'un mauvais amorti.',
        overlays: [],
      },
      {
        id: 'scene_solution',
        title: '03. La Solution & Révélation',
        role: 'solution',
        imageUrl: createProductSvgDataUri('sneaker'),
        durationSec: 4,
        motionPreset: 'neon_sweep',
        transition: 'zoom_in',
        headline: 'KINETIC PULSE 3 : PROPULSION CARBONE',
        subheadline: 'Seulement 180g. +35% de retour d’énergie à chaque pas.',
        captionPosition: 'bottom',
        captionStyle: 'neon_glow',
        voiceoverScript: 'Découvrez la Kinetic Pulse 3. Plaque carbone intégrée, 180 grammes seulement.',
        overlays: [
          {
            id: 'ov_2',
            type: 'badge_promo',
            text: '-40% CETTE SEMAINE',
            position: 'top_right',
            colorTheme: 'amber',
            animation: 'bounce',
            startTimeSec: 0,
            durationSec: 4,
          },
        ],
      },
      {
        id: 'scene_proof',
        title: '04. Preuve Sociale & Avis',
        role: 'proof',
        imageUrl: createProductSvgDataUri('sneaker'),
        durationSec: 3,
        motionPreset: 'parallax_tilt',
        transition: 'wipe_up',
        headline: 'NOTÉ 4.9/5 PAR PLUS DE 15 000 SPORTIFS',
        subheadline: '« Je ne peux plus m’en passer ! » — Julien, Marathonien',
        captionPosition: 'center',
        captionStyle: 'clean_boxed',
        voiceoverScript: 'Plus de quinze mille sportifs l\'ont déjà adoptée cette saison.',
        overlays: [
          {
            id: 'ov_3',
            type: 'badge_rating',
            text: '★ ★ ★ ★ ★ 4.9/5',
            subtext: '15 420 Avis Vérifiés',
            position: 'top',
            colorTheme: 'emerald',
            animation: 'pop',
            startTimeSec: 0,
            durationSec: 3,
          },
        ],
      },
      {
        id: 'scene_cta',
        title: '05. Appel à l’Action (CTA)',
        role: 'cta',
        imageUrl: createProductSvgDataUri('sneaker'),
        durationSec: 3,
        motionPreset: 'dynamic_snap',
        transition: 'fade',
        headline: 'COMMANDER MAINTENANT · LIVRAISON OFFERTE',
        subheadline: 'Code promo exclusif : RUNVIP (-15€ supplémentaires)',
        captionPosition: 'bottom',
        captionStyle: 'tiktok_bold',
        voiceoverScript: 'Cliquez sur le lien ci-dessous pour commander avec la livraison offerte dès aujourd\'hui !',
        overlays: [
          {
            id: 'ov_4',
            type: 'cta_button',
            text: 'PROFITER DE L’OFFRE',
            subtext: 'Stock restant : 12 pièces',
            position: 'bottom',
            colorTheme: 'indigo',
            animation: 'pulse',
            startTimeSec: 0,
            durationSec: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'luxury_beauty_ad',
    name: 'Luxe & Beauté Minimaliste (Élixir)',
    category: 'Luxe / Cosmétique',
    description: 'Esthétique ultra léchée, zooms lents cinématiques, motion design minimaliste et voix off raffinée.',
    aspectRatio: '9:16',
    audioTheme: 'luxury_ambient',
    scenes: [
      {
        id: 'scene_lux_1',
        title: '01. L’Essence du Luxe',
        role: 'hook',
        imageUrl: createProductSvgDataUri('perfume'),
        durationSec: 4,
        motionPreset: 'luxury_float',
        transition: 'fade',
        headline: 'L’ART DE LA SÉDUCTION SUBTILE',
        subheadline: 'Élixir Noir · Haute Parfumerie Française',
        captionPosition: 'bottom',
        captionStyle: 'minimal_luxury',
        voiceoverScript: 'L\'art de la séduction réside dans ce qui ne s\'oublie jamais.',
        overlays: [
          {
            id: 'ov_lux_1',
            type: 'badge_trust',
            text: 'FABRIQUÉ EN FRANCE',
            position: 'top_left',
            colorTheme: 'black_gold',
            animation: 'slide_in',
            startTimeSec: 0,
            durationSec: 4,
          },
        ],
      },
      {
        id: 'scene_lux_2',
        title: '02. Notes & Révélation',
        role: 'solution',
        imageUrl: createProductSvgDataUri('perfume'),
        durationSec: 4,
        motionPreset: 'ken_burns_in',
        transition: 'zoom_in',
        headline: 'OUD NOIR · BOIS DE SANTAL · VANILLE BOURBON',
        subheadline: 'Une tenue exceptionnelle de plus de 24 heures.',
        captionPosition: 'bottom',
        captionStyle: 'minimal_luxury',
        voiceoverScript: 'Un accord envoûtant d\'oud noir et de vanille précieuse qui tient 24 heures sur votre peau.',
        overlays: [
          {
            id: 'ov_lux_2',
            type: 'price_tag',
            text: 'COFFRET PRESTIGE 59€',
            subtext: 'Édition Numérotée',
            position: 'top_right',
            colorTheme: 'black_gold',
            animation: 'glow',
            startTimeSec: 0,
            durationSec: 4,
          },
        ],
      },
      {
        id: 'scene_lux_3',
        title: '03. Offre Privilège',
        role: 'cta',
        imageUrl: createProductSvgDataUri('perfume'),
        durationSec: 4,
        motionPreset: 'ken_burns_out',
        transition: 'fade',
        headline: 'RECEVEZ VOTRE ÉCHANTILLON OFFERT',
        subheadline: 'Satisfait ou remboursé sous 30 jours.',
        captionPosition: 'center',
        captionStyle: 'minimal_luxury',
        voiceoverScript: 'Commandez votre flacon aujourd\'hui et recevez l\'écrin voyage offert.',
        overlays: [
          {
            id: 'ov_lux_3',
            type: 'cta_button',
            text: 'DÉCOUVRIR LA COLLECTION',
            position: 'bottom',
            colorTheme: 'black_gold',
            animation: 'pulse',
            startTimeSec: 0,
            durationSec: 4,
          },
        ],
      },
    ],
  },
  {
    id: 'tech_product_reveal',
    name: 'High-Tech Launch (YouTube & Paysage 16:9)',
    category: 'High-Tech / Gadget',
    description: 'Format horizontal 16:9 taillé pour YouTube Ads, Facebook Ads et landing pages vidéo.',
    aspectRatio: '16:9',
    audioTheme: 'tech_future',
    scenes: [
      {
        id: 'scene_tech_1',
        title: '01. Découverte Technologique',
        role: 'hook',
        imageUrl: createProductSvgDataUri('headphones'),
        durationSec: 3.5,
        motionPreset: 'neon_sweep',
        transition: 'flash_white',
        headline: 'L’INGÉNIERIE ACOUSTIQUE DU FUTUR',
        subheadline: 'Sonic Ultra ANC : Réduction active de bruit 45dB',
        captionPosition: 'bottom',
        captionStyle: 'neon_glow',
        voiceoverScript: 'Voici la nouvelle référence mondiale de l\'audio immersif.',
        overlays: [
          {
            id: 'ov_tech_1',
            type: 'badge_limited',
            text: 'LANCEMENT EXCLUSIF',
            position: 'top_left',
            colorTheme: 'cyan',
            animation: 'pulse',
            startTimeSec: 0,
            durationSec: 3.5,
          },
        ],
      },
      {
        id: 'scene_tech_2',
        title: '02. Autonomie & Performance',
        role: 'solution',
        imageUrl: createProductSvgDataUri('headphones'),
        durationSec: 4,
        motionPreset: 'parallax_tilt',
        transition: 'slide_left',
        headline: '60 HEURES D’ÉCOUTE SANS INTERRUPTION',
        subheadline: 'Charge ultra rapide : 10 min de charge = 5 heures de musique',
        captionPosition: 'bottom',
        captionStyle: 'neon_glow',
        voiceoverScript: 'Profitez de soixante heures d\'autonomie continue sans jamais recharger.',
        overlays: [
          {
            id: 'ov_tech_2',
            type: 'badge_promo',
            text: '-70€ LANCEMENT',
            position: 'top_right',
            colorTheme: 'cyan',
            animation: 'pop',
            startTimeSec: 0,
            durationSec: 4,
          },
        ],
      },
      {
        id: 'scene_tech_3',
        title: '03. Passez Commande',
        role: 'cta',
        imageUrl: createProductSvgDataUri('headphones'),
        durationSec: 3.5,
        motionPreset: 'dynamic_snap',
        transition: 'zoom_in',
        headline: 'LIVRAISON EXPRESS 24H OFFERTE',
        subheadline: 'Garantie constructeur 3 ans incluse.',
        captionPosition: 'center',
        captionStyle: 'clean_boxed',
        voiceoverScript: 'Commandez le vôtre immédiatement et profitez de la réduction de lancement.',
        overlays: [
          {
            id: 'ov_tech_3',
            type: 'cta_button',
            text: 'COMMANDER MAINTENANT',
            position: 'bottom',
            colorTheme: 'cyan',
            animation: 'pulse',
            startTimeSec: 0,
            durationSec: 3.5,
          },
        ],
      },
    ],
  },
];

export const INITIAL_PROJECT: AdProject = {
  id: 'proj_default_1',
  title: 'Campagne Publicitaire Produit 2026',
  aspectRatio: '9:16',
  scenes: PRESET_TEMPLATES[0].scenes,
  audioTheme: 'energetic_trap',
  audioVolume: 0.6,
  voiceoverVoiceId: '',
  voiceoverRate: 1.0,
  voiceoverPitch: 1.0,
  voiceoverVolume: 1.0,
  enableAutoSubtitles: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
