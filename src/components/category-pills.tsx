export function CategoryPills({ categories }: { categories: Array<{ id: string; name: string }> }) {
  if (!categories.length) return null;
  return (
    <div className="mb-8 flex flex-wrap gap-2.5">
      {categories.map((category) => (
        <span
          key={category.id}
          className="inline-flex items-center rounded-full border border-rose-100 bg-white px-4 py-2 text-[13px] font-bold text-stone-600 shadow-[0_2px_8px_rgba(212,7,90,0.06)] transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 hover:shadow-[0_4px_14px_rgba(212,7,90,0.12)] cursor-default"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}
