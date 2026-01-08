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
  title: z.string().describe('Titre accrocheur pour le produit.'),
  description: z.string().describe('Description HTML complète et engageante (<p>, <ul>, <strong>).'),
  shortDescription: z.string().describe('Résumé percutant (2-3 phrases) pour les listes de produits.'),
  metaDescription: z.string().describe('Meta description SEO (max 160 caractères) pour les moteurs de recherche.'),
  tags: z.array(z.string()).describe('Array de 3 à 5 tags pertinents pour la recherche et le filtrage.'),
});


export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

const GenerateSeoOptimizedProductContentOutputSchema = z.object({
  title: z.string().describe('Titre accrocheur pour le produit.'),
  description: z.string().describe('Description HTML complète et engageante (<p>, <ul>, <strong>).'),
  shortDescription: z.string().describe('Résumé percutant (2-3 phrases) pour les listes de produits.'),
  metaDescription: z.string().describe('Meta description SEO (max 160 caractères) pour les moteurs de recherche.'),
  tags: z.array(z.string()).describe('Array de 3 à 5 tags pertinents pour la recherche et le filtrage.'),
});

export type GenerateSeoOptimizedProductContentOutput = z.infer<typeof GenerateSeoOptimizedProductContentOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateSeoOptimizedProductContentPrompt',
  input: {schema: GenerateSeoOptimizedProductContentInputSchema},
  output: {schema: GenerateSeoOptimizedProductContentOutputSchema},
  prompt: `Tu es un expert en copywriting e-commerce et SEO.
    Ta mission est de créer le contenu marketing complet pour la fiche produit suivante, en français.
    Le format de sortie doit être un JSON strict (pas de markdown).

    INFORMATIONS PRODUIT :
    - Nom / Mot-clé principal : {{{name}}}
    - Caractéristiques : {{{features}}}
    - Catégorie : {{{category}}}
    - Prix : {{{price}}}
    - Ton souhaité : {{{tone}}}
    {{#if imageUrl}}
    - Image: {{media url=imageUrl}}
    {{/if}}

    Génère les champs suivants :
    - title : Un titre produit accrocheur et optimisé SEO.
    - description : Une description complète et engageante (minimum 250 mots). Utilise du HTML simple (<p>, <ul>, <li>, <strong>) pour la mise en forme. Structure le contenu avec des paragraphes clairs.
    - shortDescription : Un résumé percutant de 2 à 3 phrases pour les aperçus ou les listes de produits.
    - metaDescription : Une méta description optimisée pour le SEO (environ 155 caractères) qui incite au clic.
    - tags : Un tableau de 3 à 5 mots-clés pertinents.

    Remplis TOUS les champs du JSON demandé.
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
