'use client';

import { useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Loader2 } from "lucide-react";
import { useCollection, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { ProductDescription } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const productDescriptionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, `users/${user.uid}/productDescriptions`), 
        orderBy('createdAt', 'desc'), 
        limit(10)
    );
  }, [firestore, user]);

  const { data: generations, isLoading } = useCollection<ProductDescription>(productDescriptionsQuery);

  const renderContent = () => {
    if (isUserLoading || isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
        return (
            <div className="text-center p-12 bg-muted rounded-lg">
                <p className="text-lg font-semibold">Veuillez vous connecter</p>
                <p className="text-muted-foreground">Connectez-vous pour voir l'historique de vos générations.</p>
            </div>
        );
    }
    
    if (!generations || generations.length === 0) {
        return (
            <div className="text-center p-12 bg-muted rounded-lg">
                <p className="text-lg font-semibold">Aucune génération trouvée</p>
                <p className="text-muted-foreground">Commencez par créer votre première fiche produit !</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Plateforme</TableHead>
                <TableHead>Ton</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generations.map((gen) => (
                <TableRow key={gen.id}>
                  <TableCell className="font-medium">{gen.title}</TableCell>
                  <TableCell>
                    <Badge variant={gen.platform === 'shopify' ? 'default' : 'secondary'} className={gen.platform === 'shopify' ? 'bg-green-600' : 'bg-purple-600'}>
                      {gen.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline">{gen.inputData.tone}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(gen.createdAt), "d MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        <FileDown className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
       <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-headline">
          Tableau de bord
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg leading-6 text-muted-foreground">
          Retrouvez ici l'historique de vos générations de contenu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Générations</CardTitle>
          <CardDescription>
            Vos dernières fiches produits générées.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
