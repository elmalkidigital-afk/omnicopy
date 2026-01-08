'use server';
/**
 * @fileOverview A flow to generate SEO-optimized product content.
 *
 * - generateSeoOptimizedProductContent - A function that handles the product content generation.
 * - GenerateSeoOptimizedProductContentInput - The input type for the generateSeoOptimizedProductContent function.
 * - GenerateSeoOptimizedProductContentOutput - The return type for the generateSeoOptimizedProductContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ProductTone = z.enum(['LUXURY', 'TECHNICAL', 'FRIENDLY', 'MARKETING']);
export type ProductTone = z.infer<typeof ProductTone>;

export const Platform = z.enum(['SHOPIFY', 'WOOCOMMERCE']);
export type Platform = z.infer<typeof Platform>;

const GenerateSeoOptimizedProductContentInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  features: z.string().describe('The features of the product.'),
  category: z.string().describe('The category of the product.'),
  price: z.string().describe('The price of the product.'),
  tone: ProductTone.describe('The tone of the product description (LUXURY, TECHNICAL, FRIENDLY, MARKETING).'),
  imageUrl: z.string().optional().describe('The URL of the product image.'),
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

export async function generateSeoOptimizedProductContent(input: GenerateSeoOptimizedProductContentInput): Promise<GenerateSeoOptimizedProductContentOutput> {
  return generateSeoOptimizedProductContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoOptimizedProductContentPrompt',
  input: {schema: GenerateSeoOptimizedProductContentInputSchema},
  output: {schema: GenerateSeoOptimizedProductContentOutputSchema},
  prompt: `Act as an expert e-commerce copywriter for the {{{tone}}} platform.

  Product details:
  - Name: {{{name}}}
  - Features: {{{features}}}
  - Category: {{{category}}}
  - Price: {{{price}}}
  - Tone: {{{tone}}}

  Generate marketing content in strict JSON format (no markdown) with this structure:
  {
    "title": "SEO-optimized title (max 60 chars)",
    "description": "Complete HTML description (<p>, <ul>, <strong>)",
    "shortDescription": "Concise summary (2 sentences)",
    "metaDescription": "SEO meta description (max 160 chars)",
    "tags": ["tag1", "tag2", "tag3"],
    "handle": "product-slug-for-url"
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
