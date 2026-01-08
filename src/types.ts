import type { FieldValue } from "firebase/firestore";
import { z } from "zod";


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

export const ProductInputSchema = z.object({
  name: z.string().min(3, 'Le nom du produit doit contenir au moins 3 caractères.'),
  features: z.string().min(10, 'Veuillez décrire quelques caractéristiques (au moins 10 caractères).'),
  category: z.string().nonempty('La catégorie est requise.'),
  price: z.string().nonempty('Le prix est requis.'),
  tone: z.nativeEnum(ProductTone),
  imageUrl: z.string().optional(),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;

export interface GeneratedContent {
  title: string;
  slug: string; // Généré par l'IA pour coller parfaitement au titre
  description: string; // Format HTML (<h2>, <ul>, <strong>)
  shortDescription: string;
  metaDescription: string;
  tags: string[];
}


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

export interface ProductDescription extends GeneratedContent {
  id: string;
  userId: string;
  platform: string;
  createdAt: FieldValue | string;
  inputData: ProductInput;
}


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
  slug?: string;
  type: "simple" | "variable";
  regular_price: string;
  description: string;
  short_description: string;
  categories: Array<{ name: string }>;
  images: Array<{ src: string }>;
  tags: Array<{ name: string }>;
  meta_data: Array<{ key: string; value: string }>;
}
