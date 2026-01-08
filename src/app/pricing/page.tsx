import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Débutant",
        price: "19€",
        credits: "50",
        target: "Pour commencer (1-2 produits/jour)",
        features: ["Génération SEO", "Exports CSV/JSON", "Tous les tons", "Support Email"],
        primary: false,
    },
    {
        name: "Pro",
        price: "49€",
        credits: "500",
        target: "Boutiques actives & Agences",
        features: ["Génération SEO", "Exports CSV/JSON", "Tous les tons", "Support Prioritaire", "Accès API (bientôt)"],
        primary: true,
    },
    {
        name: "Entreprise",
        price: "299€",
        credits: "5000",
        target: "Grandes équipes & Entreprises",
        features: ["Génération SEO", "Exports CSV/JSON", "Tous les tons", "Support Dédié", "Accès API (bientôt)", "Marque Blanche (bientôt)"],
        primary: false,
    }
]

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-headline">
          Des plans pour chaque besoin
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg leading-6 text-muted-foreground">
          Choisissez le plan qui correspond à votre volume de produits et commencez à générer du contenu de qualité.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.primary ? 'border-primary shadow-primary/20 shadow-lg' : ''}`}>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
                    <CardDescription>{plan.target}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="text-center mb-6">
                        <span className="text-4xl font-extrabold">{plan.price}</span>
                        <span className="text-muted-foreground">/mois</span>
                    </div>
                    <div className="text-center mb-8 bg-muted rounded-lg p-3">
                        <span className="font-bold text-primary">{plan.credits}</span> crédits de génération
                    </div>
                    <ul className="space-y-3">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-accent flex-shrink-0" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant={plan.primary ? 'default' : 'outline'}>
                        Choisir ce plan
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
