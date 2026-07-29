import { redirect } from 'next/navigation';
import { ProductGrid } from '@/components/product-grid';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/products';

export const metadata = { title: 'My Wishlist' };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login?next=/wishlist');
  let products: ReturnType<typeof serializeProduct>[] = [];
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.userId, product: { deletedAt: null, isPublished: true } },
      include: { product: { include: { category: true, images: { orderBy: { position: 'asc' } }, variants: true } } },
      orderBy: { createdAt: 'desc' }
    });
    products = items.map((item) => serializeProduct(item.product));
  } catch {}

  return (
    <section className="container-shell py-16">
      <p className="font-bold uppercase tracking-[0.2em] text-butterfly-600">Saved for you</p>
      <h1 className="section-title mt-3">My Wishlist</h1>
      <p className="mt-4 text-stone-500">Your saved products stay connected to your account across devices.</p>
      <div className="mt-10">
        {products.length ? <ProductGrid products={products} /> : (
          <div className="rounded-[2rem] border border-pink-100 bg-white p-10 text-center shadow-soft">
            <h2 className="display-font text-3xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-3 text-stone-500">Tap the heart icon on any product to save it here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
