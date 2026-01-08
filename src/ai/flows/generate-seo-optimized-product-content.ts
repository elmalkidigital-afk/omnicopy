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
  prompt: `Tu es un expert en copywriting e-commerce et SEO, spécialisé dans l'optimisation pour Rank Math. Ta mission est de créer une fiche produit parfaite en français.

    MOT-CLÉ PRINCIPAL : {{{name}}}
    
    INFORMATIONS PRODUIT :
    - Caractéristiques : {{{features}}}
    - Catégorie : {{{category}}}
    - Prix : {{{price}}}
    - Ton souhaité : {{{tone}}}
    {{#if imageUrl}}
    - Image: {{media url=imageUrl}}
    {{/if}}

    Génère le contenu marketing complet en respectant SCRUPULEUSEMENT toutes les consignes SEO ci-dessous pour obtenir un score Rank Math de 100/100.
    Le format de sortie doit être un JSON strict (pas de markdown).

    CHECKLIST SEO RANK MATH :
    1.  **Titre SEO (champ \`seoTitle\`)** :
        -   Doit faire entre 50 et 60 caractères.
        -   Doit commencer par le mot-clé principal : "{{{name}}}".
        -   Doit inclure un "power word" (ex: Ultime, Incroyable, Essentiel, Garanti, Révolutionnaire).

    2.  **Méta Description (champ \`metaDescription\`)** :
        -   Doit faire entre 120 et 160 caractères.
        -   Doit contenir le mot-clé principal : "{{{name}}}".

    3.  **Slug d'URL (champ \`handle\`)** :
        -   Doit être court et contenir le mot-clé principal.
        -   Format : mots-separes-par-des-tirets.

    4.  **Description Complète (champ \`description\`)** :
        -   **Longueur** : Le texte doit faire AU MOINS 600 mots.
        -   **Introduction** : La toute première phrase doit contenir le mot-clé principal "{{{name}}}".
        -   **Structure** : Utilise des sous-titres H2 et H3. Au moins un H2 doit contenir le mot-clé principal.
        -   **Densité du mot-clé** : Le mot-clé "{{{name}}}" doit apparaître naturellement environ 5-6 fois dans le texte.
        -   **Liens** : Inclus des placeholders pour les liens : un lien interne (ex: \`<a href="[Lien vers une catégorie]">découvrez notre collection</a>\`) et un lien externe dofollow vers une ressource pertinente (ex: \`<a href="[Lien vers une source fiable]" target="_blank">source d'information</a>\`).
        -   **Lisibilité** : Utilise des paragraphes courts (2-3 phrases maximum).
        -   **Média** : Si une image est fournie, insère une balise \`<img src="{{{imageUrl}}}" alt="Image de {{{name}}}" style="width:100%; height:auto; border-radius:8px; margin:16px 0;">\` dans le contenu.
    
    5.  **Champs Shopify/E-commerce** :
        -   **\`title\`** : Titre principal du produit, engageant pour le client.
        -   **\`shortDescription\`** : Résumé percutant de 2 phrases.
        -   **\`tags\`** : 3 à 5 tags pertinents.
        -   **\`vendor\`** : Nom de la marque ou du fabricant.
        -   **\`option1Name\` / \`option1Value\`** : Si pas de variante, utilise "Title" et "Default Title".

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
