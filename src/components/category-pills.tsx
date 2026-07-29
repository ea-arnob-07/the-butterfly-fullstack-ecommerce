export function CategoryPills({ categories }: { categories: Array<{ id: string; name: string }> }) {
  if (!categories.length) return null;
  return (
    <div className="mb-10 flex flex-wrap gap-2.5">
      {categories.map((category) => (
        <span key={category.id} className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-bold text-stone-700 shadow-sm">
          {category.name}
        </span>
      ))}
    </div>
  );
}
