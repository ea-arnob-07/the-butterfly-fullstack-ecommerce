'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MultiImageUploader, type ManagedImage } from '@/components/multi-image-uploader';

type Category = { id: string; name: string; segment?: string; isActive?: boolean };
type ItemType = { id: string; name: string; isActive?: boolean };

export function AdminProductForm({ categories, itemTypes }: { categories: Category[]; itemTypes: ItemType[] }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [segment, setSegment] = useState('WOMEN');
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [manualUrl, setManualUrl] = useState('');

  const filteredCategories = useMemo(
    () => categories.filter((category) => (!category.segment || category.segment === segment) && category.isActive !== false),
    [categories, segment],
  );
  const activeItemTypes = useMemo(() => itemTypes.filter((itemType) => itemType.isActive !== false), [itemTypes]);

  function addUrl() {
    const url = manualUrl.trim();
    if (!url) return;
    setImages((old) => [...old, { url, isCover: old.length === 0 }]);
    setManualUrl('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('Creating product...');
    if (!images.length) {
      setLoading(false);
      setMessage('Upload at least one product image.');
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get('name'),
      slug: form.get('slug'),
      description: form.get('description'),
      segment: form.get('segment'),
      categoryId: form.get('categoryId'),
      itemTypeId: form.get('itemTypeId') || null,
      basePrice: form.get('basePrice'),
      salePrice: form.get('salePrice') || null,
      sku: form.get('sku'),
      images,
      stock: form.get('stock'),
      sizes: String(form.get('sizes')).split(',').map((value) => value.trim()).filter(Boolean),
      colors: String(form.get('colors')).split(',').map((value) => value.trim()).filter(Boolean),
      isBestSeller: form.get('isBestSeller') === 'on',
      isNewArrival: form.get('isNewArrival') === 'on',
    };

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Could not create product.');

    setMessage('Product created successfully.');
    formElement.reset();
    setImages([]);
    setSegment('WOMEN');
    router.refresh();
  }

  const cls = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-butterfly-400';

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Product Manager</p>
        <h2 className="display-font mt-2 text-3xl font-semibold text-stone-900">Add a product</h2>
      </div>
      <input className={cls} name="name" placeholder="Product name" required />
      <input className={cls} name="slug" placeholder="product-slug" pattern="[a-z0-9-]+" required />
      <select className={cls} name="segment" value={segment} onChange={(event) => setSegment(event.target.value)}>
        <option value="WOMEN">Women</option><option value="MEN">Men</option><option value="CHILDREN">Children</option>
      </select>
      <select className={cls} name="categoryId" required>
        <option value="">Select category</option>
        {filteredCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <select className={cls} name="itemTypeId">
        <option value="">Select item type (optional)</option>
        {activeItemTypes.map((itemType) => <option key={itemType.id} value={itemType.id}>{itemType.name}</option>)}
      </select>
      <input className={cls} name="sku" placeholder="SKU" required />
      <input className={cls} name="basePrice" type="number" min="1" placeholder="Regular price" required />
      <input className={cls} name="salePrice" type="number" min="1" placeholder="Sale price (optional)" />
      <input className={cls} name="stock" type="number" min="0" placeholder="Stock per variant" required />
      <input className={cls} name="sizes" placeholder="Sizes: S, M, L or Standard" required />
      <input className={cls} name="colors" placeholder="Colors: Pink, Black" required />
      <div className="md:col-span-2">
        <MultiImageUploader value={images} onChange={setImages} />
        <div className="mt-3 flex gap-2">
          <input className={cls} type="url" value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="Or paste another image URL" />
          <button type="button" onClick={addUrl} className="shrink-0 rounded-full bg-pink-50 px-5 text-sm font-bold text-butterfly-700">Add URL</button>
        </div>
      </div>
      <textarea className={`${cls} min-h-28 md:col-span-2`} name="description" placeholder="Product description" required />
      <div className="md:col-span-2 flex flex-wrap items-center gap-6 rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" name="isNewArrival" />Mark as New Arrival</label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-stone-700"><input type="checkbox" name="isBestSeller" />Mark as Top Sale</label>
      </div>
      {message && <p className="text-sm font-semibold text-butterfly-700 md:col-span-2">{message}</p>}
      <button disabled={loading} className="rounded-full bg-butterfly-600 px-5 py-3 font-bold text-white transition hover:bg-butterfly-700 md:col-span-2 disabled:opacity-60">{loading ? 'Creating...' : 'Create Product'}</button>
    </form>
  );
}
