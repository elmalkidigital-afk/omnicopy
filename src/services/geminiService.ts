'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductInput, GeneratedContent } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("La variable d'environnement GEMINI_API_KEY est manquante.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Utilisation de Flash pour la vitesse, qui est plus fiable et rapide.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const generateProductContent = async (input: ProductInput): Promise<GeneratedContent> => {
  
  // 🚀 PROMPT SEO EXPERT AMÉLIORÉ V2 🚀
  const prompt = `
    Tu es un expert SEO E-Commerce et Rédacteur Web de niveau mondial, spécialiste de Rank Math, WooCommerce et Shopify.

    TÂCHE : Générer une fiche produit optimisée pour un score SEO maximal sur Rank Math.

    RÈGLE D'OR (NON-NÉGOCIABLE) :
    Le **Mot-Clé Principal** est : "${input.name}".
    Tu NE DOIS PAS le modifier, le reformuler ou y ajouter des mots. C'est la cible SEO absolue.

    DONNÉES D'ENTRÉE :
    - Mot-Clé Principal : "${input.name}"
    - Caractéristiques : ${input.features}
    - Catégorie : ${input.category}
    - Prix : ${input.price}
    - Ton/Rédaction : ${input.tone}

    INSTRUCTIONS SEO STRICTES (basées sur le Mot-Clé Principal) :
    1.  **Title (Titre SEO & H1)** : Doit commencer par le Mot-Clé Principal EXACT. Il doit être accrocheur, faire max 60 caractères.
    2.  **Slug (URL)** : Génère un slug court à partir du Mot-Clé Principal EXACT. En minuscules, avec des tirets. Ex: si le mot-clé est "Montre Sport Pro", le slug est "montre-sport-pro".
    3.  **Description (HTML)** :
        -   STRUCTURE : Utilise des balises HTML5 (<h2>, <ul>, <li>, <p>, <strong>).
        -   MOT-CLÉ EN DÉBUT DE CONTENU : Le Mot-Clé Principal EXACT doit apparaître dans les **100 premiers mots** du premier paragraphe.
        -   SOUS-TITRES (H2) : Utilise au moins un titre <h2> contenant le Mot-Clé Principal.
        -   LISIBILITÉ : Structure le contenu avec des listes à puces (<ul><li>) et des paragraphes courts.
        -   TON : Adopte le ton demandé : ${input.tone}.
    4.  **Short Description** : Résumé percutant de 1 à 2 phrases.
    5.  **Meta Description** : Max 160 caractères. Doit contenir le Mot-Clé Principal EXACT et un verbe d'action fort (ex: "Achetez", "Découvrez", "Profitez").
    6.  **Tags** : Génère 5 tags pertinents incluant des variations du Mot-Clé Principal.

    FORMAT DE SORTIE ATTENDU (JSON STRICT, sans markdown \`\`\`) :
    {
      "title": "Titre optimisé commençant par le mot-clé",
      "slug": "slug-base-sur-le-mot-cle",
      "description": "<p>Paragraphe d'introduction avec le <strong>Mot-Clé Principal EXACT</strong>...</p><h2>Pourquoi choisir notre <strong>Mot-Clé Principal EXACT</strong> ?</h2><ul><li>Point 1</li><li>Point 2</li></ul>",
      "shortDescription": "Résumé court et percutant.",
      "metaDescription": "Méta-description pour Google avec le Mot-Clé Principal EXACT et un CTA.",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
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
