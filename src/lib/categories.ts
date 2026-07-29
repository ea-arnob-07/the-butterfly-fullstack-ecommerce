import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { defaultCategories } from '@/lib/catalog-defaults';

const _fetchCategories = unstable_cache(
  async (segment: string) => {
    try {
      const categories = await prisma.category.findMany({
        where: { segment: segment as any, isActive: true },
        select: { id: true, name: true, slug: true, position: true },
        orderBy: [{ position: 'asc' }, { name: 'asc' }],
      });
      if (categories.length) return categories;
    } catch {}

    return defaultCategories
      .filter((category) => category.segment === segment)
      .map((category) => ({ id: category.slug, name: category.name, slug: category.slug, position: category.position }));
  },
  ['categories'],
  { revalidate: 300, tags: ['categories'] } // cache for 5 minutes
);

export async function getCategories(segment: 'WOMEN' | 'MEN' | 'CHILDREN') {
  return _fetchCategories(segment);
}
