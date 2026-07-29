import { prisma } from '@/lib/prisma';
import { defaultCategories } from '@/lib/catalog-defaults';

export async function getCategories(segment: 'WOMEN' | 'MEN' | 'CHILDREN') {
  try {
    const categories = await prisma.category.findMany({
      where: { segment, isActive: true },
      select: { id: true, name: true, slug: true, position: true },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });
    if (categories.length) return categories;
  } catch {}

  return defaultCategories
    .filter((category) => category.segment === segment)
    .map((category) => ({ id: category.slug, name: category.name, slug: category.slug, position: category.position }));
}
