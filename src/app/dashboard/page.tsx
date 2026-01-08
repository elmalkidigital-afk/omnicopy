import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, MoreHorizontal } from "lucide-react";

const mockGenerations = [
  {
    id: "gen-1",
    productName: "Montre Connectée 'Futura'",
    platform: "Shopify",
    date: "24 Mai 2024",
    tone: "Technique",
  },
  {
    id: "gen-2",
    productName: "Sac à Main 'Élégance Paris'",
    platform: "WooCommerce",
    date: "23 Mai 2024",
    tone: "Luxe",
  },
  {
    id: "gen-3",
    productName: "T-shirt 'Cosmic'",
    platform: "Shopify",
    date: "21 Mai 2024",
    tone: "Convivial",
  },
  {
    id: "gen-4",
    productName: "Cafetière 'Aroma Master'",
    platform: "WooCommerce",
    date: "20 Mai 2024",
    tone: "Marketing",
  },
  {
    id: "gen-5",
    productName: "Lampe de Bureau LED 'Lumo'",
    platform: "Shopify",
    date: "18 Mai 2024",
    tone: "Technique",
  },
];

export default function DashboardPage() {
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
            Vos 5 dernières fiches produits générées.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {mockGenerations.map((gen) => (
                <TableRow key={gen.id}>
                  <TableCell className="font-medium">{gen.productName}</TableCell>
                  <TableCell>
                    <Badge variant={gen.platform === 'Shopify' ? 'default' : 'secondary'} className={gen.platform === 'Shopify' ? 'bg-green-600' : 'bg-purple-600'}>
                      {gen.platform}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline">{gen.tone}</Badge>
                  </TableCell>
                  <TableCell>{gen.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        <FileDown className="h-4 w-4"/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
