import ProductStudio from '@/components/product-studio';

export default function ProductStudioPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-headline">
          Studio de Création E-Commerce
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg leading-6 text-muted-foreground">
          Générez des fiches produits optimisées pour Shopify et WooCommerce en quelques secondes.
        </p>
      </div>
      <ProductStudio />
    </div>
  );
}
