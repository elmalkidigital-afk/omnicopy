import { z } from 'zod';
import type { GenerateSeoOptimizedProductContentInput, GeneratedContent as GenkitGeneratedContent } from "@/ai/flows/generate-seo-optimized-product-content";

export const ProductTone = z.enum(['LUXURY', 'TECHNICAL', 'FRIENDLY', 'MARKETING']);
export type ProductTone = z.infer<typeof ProductTone>;

export const Platform = z.enum(['SHOPIFY', 'WOOCOMMERCE']);
export type Platform = z.infer<typeof Platform>;

export type ProductInput = GenerateSeoOptimizedProductContentInput;
export type GeneratedContent = GenkitGeneratedContent;

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
