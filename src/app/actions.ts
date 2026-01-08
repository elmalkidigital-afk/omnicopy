'use server';

import { generateProductContent } from '@/services/geminiService';
import type { ProductInput } from '@/types';

export async function generateProductContentAction(input: ProductInput) {
  try {
    const data = await generateProductContent(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error in generateProductContentAction:', error);
    // It's better to return a generic error message to the client
    // and log the detailed error on the server.
    return { success: false, error: (error as Error).message ||'Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.' };
  }
}
