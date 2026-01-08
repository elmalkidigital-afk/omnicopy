'use client';

import { CheckCircle, FileJson, FileSpreadsheet, Copy } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { exportToShopifyCSV, exportToWooCommerceJSON } from '@/services/exportService';
import type { GeneratedContent, ProductInput } from '@/types';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface GeneratedContentDisplayProps {
  content: GeneratedContent;
  input: ProductInput;
}

export default function GeneratedContentDisplay({ content, input }: GeneratedContentDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié!', description: 'Le contenu a été copié dans le presse-papiers.' });
  };
  
  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-2xl font-headline">{content.title}</CardTitle>
                <CardDescription>Aperçu du produit généré</CardDescription>
            </div>
            <Badge variant="outline" className="bg-accent/20 text-accent-foreground border-accent">
                <CheckCircle className="mr-2 h-4 w-4" />
                Terminé
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {input.imageUrl && (
            <div className="w-full h-64 relative rounded-lg overflow-hidden border">
                <Image src={input.imageUrl} alt={content.title} fill style={{objectFit: 'cover'}} data-ai-hint="product image" />
            </div>
        )}
        <div>
            <h3 className="font-semibold text-lg mb-2">Description Courte</h3>
            <p className="text-muted-foreground">{content.shortDescription}</p>
        </div>
        <Separator/>
        <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                Description Complète (HTML)
                <Button variant="ghost" size="icon" onClick={() => handleCopy(content.description)}>
                    <Copy className="h-4 w-4" />
                </Button>
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted/50"
                dangerouslySetInnerHTML={{ __html: content.description }}
            />
        </div>
        <Separator/>
        <div className="space-y-3">
             <h3 className="font-semibold text-lg">Informations SEO</h3>
            <div className='p-4 border rounded-md bg-muted/50 space-y-3'>
                 <div>
                    <h4 className="font-medium">Meta Description</h4>
                    <p className="text-sm text-muted-foreground">{content.metaDescription}</p>
                </div>
                <div>
                    <h4 className="font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {content.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <p className="text-sm font-medium text-center text-muted-foreground">Télécharger pour :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            onClick={() => exportToShopifyCSV(content, input)}
            className="bg-green-600 hover:bg-green-700 text-white py-6"
            >
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Shopify (CSV)
          </Button>
          <Button 
            onClick={() => exportToWooCommerceJSON(content, input)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-6"
            >
            <FileJson className="mr-2 h-5 w-5" />
            WooCommerce (JSON)
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
