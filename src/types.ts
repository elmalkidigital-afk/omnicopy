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

// Specific interfaces for export formats
export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  Vendor: string;
  Type: string;
  Tags: string;
  Published: string;
  "Option1 Name": string;
  "Option1 Value": string;
  "Variant SKU": string;
  "Variant Grams": string;
  "Variant Inventory Tracker": string;
  "Variant Inventory Qty": string;
  "Variant Inventory Policy": string;
  "Variant Fulfillment Service": string;
  "Variant Price": string;
  "Variant Requires Shipping": string;
  "Variant Taxable": string;
  "Image Src": string;
  "Image Position": string;
  "SEO Title": string;
  "SEO Description": string;
}

export interface WooProduct {
  name: string;
  type: "simple" | "variable";
  regular_price: string;
  description: string;
  short_description: string;
  categories: Array<{ name: string }>;
  images: Array<{ src: string }>;
  tags: Array<{ name: string }>;
  meta_data: Array<{ key: string; value: string }>;
}
