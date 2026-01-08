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
  seoTitle: z.string().describe('Titre optimisé pour le SEO (max 60 caractères).'),
  description: z.string().describe('Description HTML complète et engageante (<p>, <ul>, <strong>).'),
  shortDescription: z.string().describe('Résumé percutant (2-3 phrases) pour les listes de produits.'),
  metaDescription: z.string().describe('Meta description SEO (max 160 caractères) pour les moteurs de recherche.'),
  tags: z.array(z.string()).describe('Array de 3 à 5 tags pertinents pour la recherche et le filtrage.'),
  handle: z.string().optional().describe('Le slug optimisé pour l\'URL (par exemple: slug-du-produit-pour-url).'),
  vendor: z.string().describe('Le nom du fabricant ou de la marque du produit.'),
  option1Name: z.string().describe('Nom de la première option de variante (ex: Couleur, Taille). Mettre "Title" si pas de variante.'),
  option1Value: z.string().describe('Valeur de cette première option (ex: Bleu, M). Mettre "Default Title" si pas de variante.')
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

    Génère le contenu marketing complet en français pour une fiche produit Shopify.
    Assure-toi de remplir tous les champs demandés, en particulier les champs spécifiques à Shopify comme le vendeur (vendor) et les options de variantes.
    Si le produit n'a pas de variantes évidentes, utilise "Title" et "Default Title" pour les options.
    Le format de sortie doit être un JSON strict (pas de markdown).
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
