import type { GenerateSeoOptimizedProductContentInput, GeneratedContent, ProductTone as GenkitTone, Platform } from "@/ai/flows/generate-seo-optimized-product-content";

export type ProductInput = GenerateSeoOptimizedProductContentInput;
export type ProductTone = GenkitTone;
export type { GeneratedContent, Platform };

export const tones: { value: ProductTone; label: string }[] = [
    { value: 'LUXURY', label: 'Luxe & Élégant' },
    { value: 'TECHNICAL', label: 'Technique & Précis' },
    { value: 'FRIENDLY', label: 'Convivial & Accessible' },
    { value: 'MARKETING', label: 'Marketing & Percutant' },
];

export const categories = [
    'Mode',
    'Tech',
    'Déco',
    'Alimentaire',
    'Beauté',
    'Sport',
    'Maison',
    'Autres'
];
