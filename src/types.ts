import type { GenerateSeoOptimizedProductContentInput, GeneratedContent as GenkitGeneratedContent } from "@/ai/flows/generate-seo-optimized-product-content";

export enum ProductTone {
  LUXURY = "Luxe & Élégant",
  TECHNICAL = "Technique & Précis",
  FRIENDLY = "Convivial & Accessible",
  MARKETING = "Marketing & Percutant"
}

export enum Platform {
  SHOPIFY = "shopify",
  WOOCOMMERCE = "woocommerce"
}

export type ProductInput = GenerateSeoOptimizedProductContentInput;
export type GeneratedContent = GenkitGeneratedContent;

export const tones: { value: ProductTone; label: string }[] = [
    { value: ProductTone.LUXURY, label: 'Luxe & Élégant' },
    { value: ProductTone.TECHNICAL, label: 'Technique & Précis' },
    { value: ProductTone.FRIENDLY, label: 'Convivial & Accessible' },
    { value: ProductTone.MARKETING, label: 'Marketing & Percutant' },
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
