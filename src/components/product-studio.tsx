'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Sparkles, Upload } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { categories, tones, type GeneratedContent, type ProductInput, ProductTone, ProductDescription } from '@/types';
import { generateProductContentAction } from '@/app/actions';
import GeneratedContentDisplay from './generated-content-display';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import { useFirestore, useUser } from '@/firebase';

const formSchema = z.object({
  name: z.string().min(3, 'Le nom du produit doit contenir au moins 3 caractères.'),
  features: z.string().min(10, 'Veuillez décrire quelques caractéristiques (au moins 10 caractères).'),
  category: z.string().nonempty('La catégorie est requise.'),
  price: z.string().nonempty('Le prix est requis.'),
  tone: z.nativeEnum(ProductTone),
  imageUrl: z.string().optional(),
});

export default function ProductStudio() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [productInput, setProductInput] = useState<ProductInput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      features: '',
      category: 'Tech',
      price: '',
      tone: ProductTone.FRIENDLY,
      imageUrl: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('imageUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour générer du contenu.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setProductInput(values as ProductInput);

    const result = await generateProductContentAction(values as ProductInput);

    if (result.success && result.data) {
      setGeneratedContent(result.data);
      toast({
        title: 'Contenu généré avec succès!',
        description: 'Votre fiche produit est prête et sauvegardée.',
        variant: 'default',
      });

      // Save to Firestore
      try {
        const productDescriptionData: Omit<ProductDescription, 'id'> = {
          userId: user.uid,
          ...result.data,
          platform: 'shopify', // Default or from form
          createdAt: serverTimestamp(),
          inputData: values,
        };
        const descriptionsRef = collection(firestore, `users/${user.uid}/productDescriptions`);
        await addDoc(descriptionsRef, productDescriptionData);
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        toast({
          title: 'Erreur de sauvegarde',
          description: "La génération a réussi mais la sauvegarde a échoué.",
          variant: 'destructive',
        });
      }

    } else {
      toast({
        title: 'Erreur de génération',
        description: result.error || 'Une erreur inconnue est survenue.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  }
  
  const OutputPlaceholder = () => (
     <div className="flex h-full min-h-[500px] items-center justify-center rounded-xl border-2 border-dashed bg-card">
        <div className="text-center text-muted-foreground">
          <Wand2 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium">Le contenu généré apparaîtra ici</p>
          <p className="text-sm">Remplissez le formulaire et lancez la magie !</p>
        </div>
      </div>
  );

  const LoadingState = () => (
    <Card className="h-full min-h-[500px]">
        <CardHeader>
            <CardTitle>
                <Skeleton className="h-8 w-3/4" />
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            Détails du Produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Chaussures de course 'Vitesse Pro'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caractéristiques principales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Semelle en carbone, ultra-légères, design aérodynamique..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 149.99" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ton</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un ton" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du produit</FormLabel>
                    <div className="flex flex-col gap-4">
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className='w-fit'
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Télécharger une image
                        </Button>
                      </FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                    </div>
                    {imagePreview && (
                      <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border">
                         <Image src={imagePreview} alt="Aperçu du produit" fill style={{objectFit: 'cover'}} />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full !mt-8" size="lg" disabled={isLoading || isUserLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Générer le contenu
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="relative">
        {isLoading ? <LoadingState /> : (generatedContent && productInput) ? <GeneratedContentDisplay content={generatedContent} input={productInput} /> : <OutputPlaceholder />}
      </div>
    </div>
  );
}
