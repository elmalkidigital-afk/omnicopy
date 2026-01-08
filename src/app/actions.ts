'use server';

import { generateSeoOptimizedProductContent } from '@/ai/flows/generate-seo-optimized-product-content';
import type { ProductInput } from '@/types';

export async function generateProductContentAction(input: ProductInput) {
  try {
    const data = await generateSeoOptimizedProductContent(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error in generateProductContentAction:', error);
    // It's better to return a generic error message to the client
    // and log the detailed error on the server.
    return { success: false, error: 'Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.' };
  }
}
