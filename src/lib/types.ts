export type StoreProductImage = {
  url: string;
  alt?: string;
  isCover?: boolean;
};

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  segment: 'WOMEN' | 'MEN' | 'CHILDREN' | 'UNISEX';
  categoryName: string;
  itemTypeName?: string | null;
  basePrice: number;
  salePrice?: number | null;
  sku: string;
  imageUrl: string;
  images: StoreProductImage[];
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};
