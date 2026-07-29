import { prisma } from '@/lib/prisma';

export const defaultCategories = [
  { name: 'Saree & Blouse', slug: 'women-saree-blouse', segment: 'WOMEN', position: 1 },
  { name: 'Salwar Kameez & Three-Piece', slug: 'women-salwar-kameez-three-piece', segment: 'WOMEN', position: 2 },
  { name: 'Kurtis, Tops & Tunics', slug: 'women-kurtis-tops-tunics', segment: 'WOMEN', position: 3 },
  { name: 'Abaya, Hijab & Modest Wear', slug: 'women-abaya-hijab-modest-wear', segment: 'WOMEN', position: 4 },
  { name: 'Bags, Jewellery & Accessories', slug: 'women-bags-jewellery-accessories', segment: 'WOMEN', position: 5 },
  { name: 'Panjabi & Pajama', slug: 'men-panjabi-pajama', segment: 'MEN', position: 1 },
  { name: 'Casual & Formal Shirts', slug: 'men-casual-formal-shirts', segment: 'MEN', position: 2 },
  { name: 'T-Shirts & Polo Shirts', slug: 'men-tshirts-polo-shirts', segment: 'MEN', position: 3 },
  { name: 'Pants, Jeans & Trousers', slug: 'men-pants-jeans-trousers', segment: 'MEN', position: 4 },
  { name: 'Shoes, Watches & Accessories', slug: 'men-shoes-watches-accessories', segment: 'MEN', position: 5 },
  { name: "Girls' Frocks & Dresses", slug: 'children-girls-frocks-dresses', segment: 'CHILDREN', position: 1 },
  { name: "Boys' Panjabi & Shirts", slug: 'children-boys-panjabi-shirts', segment: 'CHILDREN', position: 2 },
  { name: 'Baby Clothing', slug: 'children-baby-clothing', segment: 'CHILDREN', position: 3 },
  { name: 'Kids Party & Traditional Wear', slug: 'children-party-traditional-wear', segment: 'CHILDREN', position: 4 },
  { name: 'Kids Footwear, Bags & Accessories', slug: 'children-footwear-bags-accessories', segment: 'CHILDREN', position: 5 },
] as const;

export const defaultItemTypes = [
  { name: 'Clothing', slug: 'clothing', position: 1 },
  { name: 'Traditional Wear', slug: 'traditional-wear', position: 2 },
  { name: 'Dress', slug: 'dress', position: 3 },
  { name: 'Accessory', slug: 'accessory', position: 4 },
  { name: 'Footwear', slug: 'footwear', position: 5 },
  { name: 'Bag', slug: 'bag', position: 6 },
  { name: 'Jewellery', slug: 'jewellery', position: 7 },
  { name: 'Other', slug: 'other', position: 8 },
] as const;

export async function ensureDefaultCatalog() {
  const db = prisma as any;
  // Always attempt the idempotent inserts so a partially-created catalog heals itself.
  // Existing rows, including rows the admin intentionally archived, are left unchanged.
  await Promise.all([
    db.category.createMany({ data: defaultCategories.map((item) => ({ ...item, isActive: true })), skipDuplicates: true }),
    db.itemType.createMany({ data: defaultItemTypes.map((item) => ({ ...item, isActive: true })), skipDuplicates: true }),
  ]);
}
