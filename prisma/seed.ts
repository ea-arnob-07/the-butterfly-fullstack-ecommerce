import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const db = prisma as any;
const Segment = { WOMEN: 'WOMEN', MEN: 'MEN', CHILDREN: 'CHILDREN' } as const;

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61581187327217&mibextid=wwXIfr&rdid=Cz2X2rMU9AlEPwy6&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BcduGXoHy%2F#';

const categories = [
  { name: 'Saree & Blouse', slug: 'women-saree-blouse', segment: Segment.WOMEN, position: 1 },
  { name: 'Salwar Kameez & Three-Piece', slug: 'women-salwar-kameez-three-piece', segment: Segment.WOMEN, position: 2 },
  { name: 'Kurtis, Tops & Tunics', slug: 'women-kurtis-tops-tunics', segment: Segment.WOMEN, position: 3 },
  { name: 'Abaya, Hijab & Modest Wear', slug: 'women-abaya-hijab-modest-wear', segment: Segment.WOMEN, position: 4 },
  { name: 'Bags, Jewellery & Accessories', slug: 'women-bags-jewellery-accessories', segment: Segment.WOMEN, position: 5 },

  { name: 'Panjabi & Pajama', slug: 'men-panjabi-pajama', segment: Segment.MEN, position: 1 },
  { name: 'Casual & Formal Shirts', slug: 'men-casual-formal-shirts', segment: Segment.MEN, position: 2 },
  { name: 'T-Shirts & Polo Shirts', slug: 'men-tshirts-polo-shirts', segment: Segment.MEN, position: 3 },
  { name: 'Pants, Jeans & Trousers', slug: 'men-pants-jeans-trousers', segment: Segment.MEN, position: 4 },
  { name: 'Shoes, Watches & Accessories', slug: 'men-shoes-watches-accessories', segment: Segment.MEN, position: 5 },

  { name: "Girls' Frocks & Dresses", slug: 'children-girls-frocks-dresses', segment: Segment.CHILDREN, position: 1 },
  { name: "Boys' Panjabi & Shirts", slug: 'children-boys-panjabi-shirts', segment: Segment.CHILDREN, position: 2 },
  { name: 'Baby Clothing', slug: 'children-baby-clothing', segment: Segment.CHILDREN, position: 3 },
  { name: 'Kids Party & Traditional Wear', slug: 'children-party-traditional-wear', segment: Segment.CHILDREN, position: 4 },
  { name: 'Kids Footwear, Bags & Accessories', slug: 'children-footwear-bags-accessories', segment: Segment.CHILDREN, position: 5 },
];

const itemTypes = [
  { name: 'Clothing', slug: 'clothing', position: 1 },
  { name: 'Traditional Wear', slug: 'traditional-wear', position: 2 },
  { name: 'Dress', slug: 'dress', position: 3 },
  { name: 'Accessory', slug: 'accessory', position: 4 },
  { name: 'Footwear', slug: 'footwear', position: 5 },
  { name: 'Bag', slug: 'bag', position: 6 },
  { name: 'Jewellery', slug: 'jewellery', position: 7 },
  { name: 'Other', slug: 'other', position: 8 },
];

type SeedProduct = {
  name: string;
  slug: string;
  segment: keyof typeof Segment;
  categorySlug: string;
  itemTypeSlug: string;
  basePrice: number;
  salePrice: number;
  sku: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  topSale?: boolean;
};

const products: SeedProduct[] = [
  {
    name: 'Rose Heritage Saree', slug: 'rose-heritage-saree', segment: 'WOMEN', categorySlug: 'women-saree-blouse', itemTypeSlug: 'traditional-wear',
    basePrice: 3950, salePrice: 3490, sku: 'TB-W-001', topSale: true,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=88'],
    description: 'An elegant saree and matching blouse combination inspired by timeless Bangladeshi occasion wear.', sizes: ['Free Size'], colors: ['Rose', 'Maroon'],
  },
  {
    name: 'Floral Three-Piece Set', slug: 'floral-three-piece-set', segment: 'WOMEN', categorySlug: 'women-salwar-kameez-three-piece', itemTypeSlug: 'traditional-wear',
    basePrice: 2850, salePrice: 2490, sku: 'TB-W-002', topSale: true,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=88'],
    description: 'A graceful three-piece set with a polished print and comfortable tailoring for daily and festive wear.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Pink', 'Teal'],
  },
  {
    name: 'Premium Embroidered Kurti', slug: 'premium-embroidered-kurti', segment: 'WOMEN', categorySlug: 'women-kurtis-tops-tunics', itemTypeSlug: 'clothing',
    basePrice: 1750, salePrice: 1490, sku: 'TB-W-003',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=88'],
    description: 'A refined embroidered kurti designed for effortless comfort, university, office and casual outings.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Ivory', 'Rose'],
  },
  {
    name: 'Noor Modest Abaya', slug: 'noor-modest-abaya', segment: 'WOMEN', categorySlug: 'women-abaya-hijab-modest-wear', itemTypeSlug: 'dress',
    basePrice: 3250, salePrice: 2890, sku: 'TB-W-004', topSale: true,
    images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=88'],
    description: 'A flowing modest abaya with clean detailing, soft fabric and a sophisticated everyday silhouette.', sizes: ['52', '54', '56', '58'], colors: ['Black', 'Mocha'],
  },
  {
    name: 'Butterfly Occasion Accessory Set', slug: 'butterfly-occasion-accessory-set', segment: 'WOMEN', categorySlug: 'women-bags-jewellery-accessories', itemTypeSlug: 'accessory',
    basePrice: 2250, salePrice: 1890, sku: 'TB-W-005',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=88'],
    description: 'A coordinated fashion accessory set created to complete wedding, party and festive outfits.', sizes: ['Standard'], colors: ['Gold', 'Blush Pink'],
  },

  {
    name: 'Classic Eid Panjabi', slug: 'classic-eid-panjabi', segment: 'MEN', categorySlug: 'men-panjabi-pajama', itemTypeSlug: 'traditional-wear',
    basePrice: 2950, salePrice: 2590, sku: 'TB-M-001', topSale: true,
    images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=88'],
    description: 'A premium panjabi with a tailored profile and subtle detailing for Eid, weddings and family occasions.', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Navy', 'Ivory'],
  },
  {
    name: 'Executive Cotton Shirt', slug: 'executive-cotton-shirt', segment: 'MEN', categorySlug: 'men-casual-formal-shirts', itemTypeSlug: 'clothing',
    basePrice: 1950, salePrice: 1690, sku: 'TB-M-002',
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=88'],
    description: 'A crisp cotton shirt that transitions smoothly from office meetings to smart-casual evenings.', sizes: ['M', 'L', 'XL'], colors: ['White', 'Sky Blue'],
  },
  {
    name: 'Signature Cotton Polo', slug: 'signature-cotton-polo', segment: 'MEN', categorySlug: 'men-tshirts-polo-shirts', itemTypeSlug: 'clothing',
    basePrice: 1550, salePrice: 1290, sku: 'TB-M-003', topSale: true,
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=88'],
    description: 'A structured cotton polo with a soft feel, neat collar and versatile everyday styling.', sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Black', 'White'],
  },
  {
    name: 'Modern Straight-Fit Jeans', slug: 'modern-straight-fit-jeans', segment: 'MEN', categorySlug: 'men-pants-jeans-trousers', itemTypeSlug: 'clothing',
    basePrice: 2350, salePrice: 1990, sku: 'TB-M-004',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=88'],
    description: 'Durable straight-fit jeans with a clean modern profile for university, office and weekend wear.', sizes: ['30', '32', '34', '36'], colors: ['Indigo', 'Black'],
  },
  {
    name: 'Gentleman Essentials Set', slug: 'gentleman-essentials-set', segment: 'MEN', categorySlug: 'men-shoes-watches-accessories', itemTypeSlug: 'accessory',
    basePrice: 3450, salePrice: 2990, sku: 'TB-M-005', topSale: true,
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=88'],
    description: 'A polished accessories selection for men featuring timeless styling for formal and festive looks.', sizes: ['Standard'], colors: ['Black', 'Brown'],
  },

  {
    name: 'Butterfly Bloom Girls Frock', slug: 'butterfly-bloom-girls-frock', segment: 'CHILDREN', categorySlug: 'children-girls-frocks-dresses', itemTypeSlug: 'dress',
    basePrice: 2050, salePrice: 1750, sku: 'TB-C-001', topSale: true,
    images: ['https://images.unsplash.com/photo-1519238359922-989348752efb?auto=format&fit=crop&w=1200&q=88'],
    description: 'A charming girls frock with a soft silhouette and playful details for birthdays and family events.', sizes: ['2Y', '4Y', '6Y', '8Y'], colors: ['Blush Pink', 'Cream'],
  },
  {
    name: 'Junior Festive Panjabi', slug: 'junior-festive-panjabi', segment: 'CHILDREN', categorySlug: 'children-boys-panjabi-shirts', itemTypeSlug: 'traditional-wear',
    basePrice: 1850, salePrice: 1590, sku: 'TB-C-002',
    images: ['https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=88'],
    description: 'A comfortable boys panjabi with festive detailing and an easy fit for celebrations and family gatherings.', sizes: ['2Y', '4Y', '6Y', '8Y'], colors: ['Blue', 'White'],
  },
  {
    name: 'Soft Newborn Romper Set', slug: 'soft-newborn-romper-set', segment: 'CHILDREN', categorySlug: 'children-baby-clothing', itemTypeSlug: 'clothing',
    basePrice: 1250, salePrice: 1090, sku: 'TB-C-003',
    images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=88'],
    description: 'A soft and gentle romper set designed for newborn comfort, easy changes and everyday use.', sizes: ['0-3M', '3-6M', '6-12M'], colors: ['White', 'Pastel Pink'],
  },
  {
    name: 'Little Celebration Outfit', slug: 'little-celebration-outfit', segment: 'CHILDREN', categorySlug: 'children-party-traditional-wear', itemTypeSlug: 'traditional-wear',
    basePrice: 2550, salePrice: 2190, sku: 'TB-C-004', topSale: true,
    images: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=88'],
    description: 'A picture-perfect party and traditional outfit designed for comfort, movement and special moments.', sizes: ['2Y', '4Y', '6Y', '8Y'], colors: ['Ivory', 'Pink'],
  },
  {
    name: 'Kids Adventure Essentials', slug: 'kids-adventure-essentials', segment: 'CHILDREN', categorySlug: 'children-footwear-bags-accessories', itemTypeSlug: 'accessory',
    basePrice: 1750, salePrice: 1490, sku: 'TB-C-005',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=88'],
    description: 'A practical kids accessory choice for school, outings and daily adventures with cheerful styling.', sizes: ['Standard'], colors: ['Pink', 'Navy'],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'butterflythe710@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'TamannA111';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.user.upsert({
    where: { email: adminEmail },
    update: { name: 'The Butterfly Owner', role: 'SUPER_ADMIN', passwordHash, emailVerifiedAt: new Date() },
    create: { name: 'The Butterfly Owner', email: adminEmail, role: 'SUPER_ADMIN', passwordHash, emailVerifiedAt: new Date() },
  });

  const adminEmail2 = 'eaarnob178@gmail.com';
  const adminPassword2 = 'arnob1234';
  const passwordHash2 = await bcrypt.hash(adminPassword2, 12);

  await db.user.upsert({
    where: { email: adminEmail2 },
    update: { name: 'Arnob', role: 'ADMIN', passwordHash: passwordHash2, emailVerifiedAt: new Date() },
    create: { name: 'Arnob', email: adminEmail2, role: 'ADMIN', passwordHash: passwordHash2, emailVerifiedAt: new Date() },
  });

  await db.siteSettings.upsert({
    where: { id: 'main' },
    update: { heroImageUrl: '/images/butterfly-hero-4k.webp', facebookUrl: FACEBOOK_URL, deliveryText: 'Inside Dhaka delivery ৳60 · Outside Dhaka ৳120' },
    create: {
      id: 'main', siteName: 'The Butterfly', tagline: 'Your Dream Line', pageTitle: 'The Butterfly | Your Dream Line',
      metaDescription: 'Premium fashion, dresses and accessories for women, men and children.',
      logoUrl: '/images/butterfly-logo-transparent.png', faviconUrl: '/images/butterfly-logo-transparent.png', heroImageUrl: '/images/butterfly-hero-4k.webp',
      heroEyebrow: 'Luxury Fashion Destination', heroTitle: 'Style curated', heroHighlight: 'for every generation.', heroTagline: 'The Butterfly — Your Dream Line',
      heroDescription: 'Discover a refined online shopping experience where modern design, premium presentation, and confident style come together for every generation.',
      aboutDescription: 'Premium fashion and accessories for women, men, and children with a polished shopping experience that feels modern, elegant, and trustworthy.',
      contactTitle: 'We are here to help you shop with confidence.', contactDescription: 'Reach out for product enquiries, order support, collaboration discussions, or direct customer assistance.',
      phone: '+8801707845422', email: 'butterflythe710@gmail.com', whatsappNumber: '8801707845422', facebookUrl: FACEBOOK_URL, deliveryText: 'Inside Dhaka delivery ৳60 · Outside Dhaka ৳120',
    },
  });

  const legacyCategorySlugs = [
    'women-saree-traditional-wear', 'women-dresses-gowns', 'women-tops-kurtis', 'women-jeans-bottoms', 'women-bags', 'women-jewellery-accessories',
    'men-panjabi-traditional-wear', 'men-pants-jeans', 'men-shoes', 'men-watches-wallets-belts',
    'children-girls-clothing', 'children-boys-clothing', 'children-kids-footwear', 'children-bags-accessories',
    'women-dresses', 'women-accessories', 'men-panjabis', 'men-shirts', 'girls-partywear', 'kids-occasionwear',
  ];
  await db.category.updateMany({ where: { slug: { in: legacyCategorySlugs } }, data: { isActive: false } });

  for (const category of categories) {
    await db.category.upsert({ where: { slug: category.slug }, update: { ...category, isActive: true }, create: { ...category, isActive: true } });
  }

  for (const itemType of itemTypes) {
    await db.itemType.upsert({ where: { slug: itemType.slug }, update: { ...itemType, isActive: true }, create: { ...itemType, isActive: true } });
  }

  for (const [index, item] of products.entries()) {
    const category = await db.category.findUniqueOrThrow({ where: { slug: item.categorySlug } });
    const itemType = await db.itemType.findUniqueOrThrow({ where: { slug: item.itemTypeSlug } });
    const product = await db.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name, description: item.description, shortDescription: item.description.slice(0, 150), segment: Segment[item.segment], categoryId: category.id,
        itemTypeId: itemType.id, basePrice: item.basePrice, salePrice: item.salePrice, sku: item.sku, isFeatured: index < 6, isNewArrival: index < 8,
        isBestSeller: Boolean(item.topSale), isPublished: true, deletedAt: null,
        images: { deleteMany: {}, create: item.images.map((url, imageIndex) => ({ url, alt: `${item.name} image ${imageIndex + 1}`, position: imageIndex, isCover: imageIndex === 0 })) },
      },
      create: {
        name: item.name, slug: item.slug, description: item.description, shortDescription: item.description.slice(0, 150), segment: Segment[item.segment], categoryId: category.id,
        itemTypeId: itemType.id, basePrice: item.basePrice, salePrice: item.salePrice, sku: item.sku, isFeatured: index < 6, isNewArrival: index < 8,
        isBestSeller: Boolean(item.topSale), isPublished: true,
        images: { create: item.images.map((url, imageIndex) => ({ url, alt: `${item.name} image ${imageIndex + 1}`, position: imageIndex, isCover: imageIndex === 0 })) },
      },
    });

    await db.productVariant.deleteMany({ where: { productId: product.id } });
    for (const size of item.sizes) {
      for (const color of item.colors) {
        await db.productVariant.create({
          data: { productId: product.id, size, color, sku: `${item.sku}-${size}-${color}`.replace(/\s+/g, '-').toUpperCase(), stock: 15 },
        });
      }
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => { console.error(error); await db.$disconnect(); process.exit(1); });
