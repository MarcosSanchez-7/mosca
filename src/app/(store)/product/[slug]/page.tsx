import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ImageGallery } from "@/components/product/ImageGallery";
import { InfoPanel } from "@/components/product/InfoPanel";
import { SpecsTable } from "@/components/product/SpecsTable";
import { ProductCard } from "@/components/shared/ProductCard";
import { getProductBySlug, getAllProductSlugs, getProductsByCategory } from "@/lib/supabase/queries";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const galleryImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  // Related products from same category
  const related = product.category_id
    ? (await getProductsByCategory(product.categories?.slug)).filter(
        (p) => p.id !== product.id
      ).slice(0, 3)
    : [];

  return (
    <div className="py-12">
      <Container>
        {/* Product main section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ImageGallery images={galleryImages} productName={product.name} />
          <InfoPanel product={product} />
        </div>

        {/* Specs */}
        <SpecsTable specs={product.specs ?? {}} />

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-on-surface mb-8 tracking-tight">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
