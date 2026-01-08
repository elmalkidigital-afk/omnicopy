'use server';
/**
 * @fileOverview A flow to generate SEO-optimized product content.
 *
 * - generateSeoOptimizedProductContent - A function that handles the product content generation.
 * - GenerateSeoOptimizedProductContentInput - The input type for the generateSeoOptimizedProductContent function.
 * - GenerateSeoOptimizedProductContentOutput - The return type for the generateSeoOptimizedProductContent function.
 */

import {ai} from '@/ai/genkit';
import { ProductTone } from '@/types';
import {z} from 'genkit';


const GenerateSeoOptimizedProductContentInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  features: z.string().describe('The features of the product.'),
  category: z.string().describe('The category of the product.'),
  price: z.string().describe('The price of the product.'),
  tone: z.nativeEnum(ProductTone).describe('The tone of the product description (LUXURY, TECHNICAL, FRIENDLY, MARKETING).'),
  imageUrl: z.string().optional().describe("A data URI of the product image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type GenerateSeoOptimizedProductContentInput = z.infer<typeof GenerateSeoOptimizedProductContentInputSchema>;

const GeneratedContentSchema = z.object({
  title: z.string().describe('Titre SEO optimisé (max 60 car)'),
  description: z.string().describe('Description HTML complète (<p>, <ul>, <strong>)'),
  shortDescription: z.string().describe('Résumé percutant (2 phrases)'),
  metaDescription: z.string().describe('Meta description SEO (max 160 car)'),
  tags: z.array(z.string()).describe('Array de 3 tags pertinents.'),
  handle: z.string().optional().describe('slug-du-produit-pour-url'),
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

const GenerateSeoOptimizedProductContentOutputSchema = GeneratedContentSchema;

export type GenerateSeoOptimizedProductContentOutput = z.infer<typeof GenerateSeoOptimizedProductContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateSeoOptimizedProductContentPrompt',
  input: {schema: GenerateSeoOptimizedProductContentInputSchema},
  output: {schema: GenerateSeoOptimizedProductContentOutputSchema},
  prompt: `Agis comme un expert copywriter e-commerce pour la plateforme {{{tone}}}.
    
    Détails du produit :
    - Nom : {{{name}}}
    - Caractéristiques : {{{features}}}
    - Catégorie : {{{category}}}
    - Prix : {{{price}}}
    - Ton souhaité : {{{tone}}}
    {{#if imageUrl}}
    - Image: {{media url=imageUrl}}
    {{/if}}

    Génère le contenu marketing en français, au format JSON strict (pas de markdown) en suivant la structure demandée.
  `,
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
