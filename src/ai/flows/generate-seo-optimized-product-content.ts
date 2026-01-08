'use server';
/**
 * @fileOverview A flow to generate SEO-optimized product content.
 *
 * - generateSeoOptimizedProductContent - A function that handles the product content generation.
 * - GenerateSeoOptimizedProductContentInput - The input type for the generateSeoOptimizedProductContent function.
 * - GenerateSeoOptimizedProductContentOutput - The return type for the generateSeoOptimizedProductContent function.
 */

import {ai} from '@/ai/genkit';
import { ProductTone } from '@/lib/types';
import {z} from 'genkit';


const GenerateSeoOptimizedProductContentInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  features: z.string().describe('The features of the product.'),
  category: z.string().describe('The category of the product.'),
  price: z.string().describe('The price of the product.'),
  tone: ProductTone.describe('The tone of the product description (LUXURY, TECHNICAL, FRIENDLY, MARKETING).'),
  imageUrl: z.string().optional().describe("A data URI of the product image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type GenerateSeoOptimizedProductContentInput = z.infer<typeof GenerateSeoOptimizedProductContentInputSchema>;

const GeneratedContentSchema = z.object({
  title: z.string().describe('SEO-optimized product title (max 60 chars).'),
  description: z.string().describe('Complete HTML description (with <p>, <ul>, <strong> tags).'),
  shortDescription: z.string().describe('Concise and impactful summary (2 sentences).'),
  metaDescription: z.string().describe('SEO meta description (max 160 chars).'),
  tags: z.array(z.string()).describe('Array of relevant tags.'),
  handle: z.string().optional().describe('Product slug for URL (Shopify).'),
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

const GenerateSeoOptimizedProductContentOutputSchema = GeneratedContentSchema;

export type GenerateSeoOptimizedProductContentOutput = z.infer<typeof GenerateSeoOptimizedProductContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateSeoOptimizedProductContentPrompt',
  input: {schema: GenerateSeoOptimizedProductContentInputSchema},
  output: {schema: GenerateSeoOptimizedProductContentOutputSchema},
  prompt: `Agissez en tant qu'expert rédacteur e-commerce pour la plateforme {{{tone}}}.

  Détails du produit:
  - Nom: {{{name}}}
  - Caractéristiques: {{{features}}}
  - Catégorie: {{{category}}}
  - Prix: {{{price}}}
  - Ton: {{{tone}}}
  {{#if imageUrl}}
  - Image: {{media url=imageUrl}}
  {{/if}}

  Générez le contenu marketing en français, au format JSON strict (pas de markdown) avec cette structure:
  {
    "title": "Titre optimisé SEO (max 60 caractères)",
    "description": "Description HTML complète (<p>, <ul>, <strong>)",
    "shortDescription": "Résumé concis (2 phrases)",
    "metaDescription": "Méta-description SEO (max 160 caractères)",
    "tags": ["tag1", "tag2", "tag3"],
    "handle": "slug-produit-pour-url"
  }`,
});

const generateSeoOptimizedProductContentFlow = ai.defineFlow(
  {
    name: 'generateSeoOptimizedProductContentFlow',
    inputSchema: GenerateSeoOptimizedProductContentInputSchema,
    outputSchema: GenerateSeoOptimizedProductContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateSeoOptimizedProductContent(input: GenerateSeoOptimizedProductContentInput): Promise<GenerateSeoOptimizedProductContentOutput> {
  return generateSeoOptimizedProductContentFlow(input);
}
