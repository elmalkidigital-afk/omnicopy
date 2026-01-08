
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductInput, GeneratedContent } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("La variable d'environnement GEMINI_API_KEY est manquante.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Utilisation de Flash pour la vitesse ou Pro pour la qualité, ici Pro pour le SEO complexe
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

export const generateProductContent = async (input: ProductInput): Promise<GeneratedContent> => {
  
  // 🚀 PROMPT SEO EXPERT AMÉLIORÉ 🚀
  const prompt = `
    Tu es un expert SEO E-Commerce et Rédacteur Web de haut niveau (spécialisé WooCommerce et Shopify).
    
    TÂCHE : Générer une fiche produit optimisée pour le référencement naturel (SEO) et la conversion.
    
    DONNÉES D'ENTRÉE :
    - Nom du produit : "${input.name}"
    - Caractéristiques : ${input.features}
    - Catégorie : ${input.category}
    - Prix : ${input.price}
    - Ton/Rédaction : ${input.tone}

    INSTRUCTIONS SEO STRICTES :
    1. **Title (Titre H1)** : Doit être accrocheur, contenir le mot-clé principal, faire max 60 caractères.
    2. **Slug (URL)** : Génère un slug court, en minuscules, avec des tirets, basé sur le titre généré. Pas d'accents ni de caractères spéciaux. Ex: "montre-sport-pro".
    3. **Description (HTML)** :
       - Structure en HTML5 (<h2>, <ul>, <li>, <p>, <strong>).
       - IMPORTANT : Le mot-clé principal (le nom du produit) doit apparaître dans les **100 premiers mots** du premier paragraphe.
       - Utilise au moins un titre <h2> pour structurer (ex: "Pourquoi choisir ce ${input.category} ?", "Caractéristiques techniques").
       - Mets les points clés en liste à puces (<ul><li>) pour la lisibilité.
       - Adopte le ton demandé : ${input.tone}.
    4. **Short Description** : Résumé percutant de 2 phrases maximum pour l'affichage liste.
    5. **Meta Description** : Max 160 caractères. Doit inclure le mot-clé principal et un verbe d'action (ex: "Achetez", "Découvrez").
    6. **Tags** : Génère 5 tags pertinents pour le référencement interne.

    FORMAT DE SORTIE ATTENDU (JSON STRICT, sans markdown \`\`\`) :
    {
      "title": "Titre optimisé",
      "slug": "slug-du-produit",
      "description": "<p>Paragraphe d'introduction avec mot clé...</p><h2>Sous-titre H2</h2><ul><li>Point 1</li></ul>",
      "shortDescription": "Résumé court...",
      "metaDescription": "Description pour Google avec CTA...",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Nettoyage robuste pour éviter les erreurs de parsing JSON
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(cleanText) as GeneratedContent;
    
    // Vérification de sécurité basique
    if (!parsed.title || !parsed.description) {
        throw new Error("Format de réponse invalide");
    }

    return parsed;
    
  } catch (error) {
    console.error("Erreur Gemini:", error);
    // En cas d'erreur, on retourne un objet par défaut pour ne pas casser l'app
    throw new Error("L'IA n'a pas pu générer le contenu. Veuillez réessayer.");
  }
};
