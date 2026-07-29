import type { StoreProduct } from '@/lib/types';
import { ProductCard } from './product-card';

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
