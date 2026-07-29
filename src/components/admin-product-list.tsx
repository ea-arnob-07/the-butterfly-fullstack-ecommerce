'use client';

import { useMemo, useState } from 'react';
import { ArchiveRestore, Pencil, Trash2, X } from 'lucide-react';
import { MultiImageUploader, type ManagedImage } from '@/components/multi-image-uploader';
import { formatBDT } from '@/lib/money';

type Category = { id: string; name: string; segment: string; isActive?: boolean };
type ItemType = { id: string; name: string; isActive?: boolean };
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  segment: string;
  categoryId: string;
  category: { name: string };
  itemTypeId: string;
  itemType: { name: string } | null;
  basePrice: number;
  salePrice: number | null;
  sku: string;
  isPublished: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  deletedAt: string | null;
  images: ManagedImage[];
  stock: number;
  sizes: string[];
  colors: string[];
};

export function AdminProductList({ products: initialProducts, categories, itemTypes }: { products: Product[]; categories: Category[]; itemTypes: ItemType[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const filteredCategories = useMemo(() => categories.filter((category) => category.segment === editing?.segment && category.isActive !== false), [categories, editing?.segment]);
  const activeItemTypes = useMemo(() => itemTypes.filter((itemType) => itemType.isActive !== false), [itemTypes]);
  const cls = 'w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-butterfly-400';

  function startEdit(product: Product) { setEditing({ ...product, images: product.images.map((image) => ({ ...image })) }); setMessage(''); setManualUrl(''); }
  function addUrl() {
    if (!editing || !manualUrl.trim()) return;
    setEditing({ ...editing, images: [...editing.images, { url: manualUrl.trim(), isCover: editing.images.length === 0 }] });
    setManualUrl('');
  }

  async function save() {
    if (!editing) return;
    if (!editing.images.length) return setMessage('At least one image is required.');
    setSaving(true); setMessage('Saving changes...');
    const response = await fetch(`/api/products/${editing.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, salePrice: editing.salePrice || null }),
    });
    const data = await response.json(); setSaving(false);
    if (!response.ok) return setMessage(data.error || 'Could not update product.');
    const categoryName = categories.find((category) => category.id === editing.categoryId)?.name || editing.category.name;
    const itemTypeName = itemTypes.find((itemType) => itemType.id === editing.itemTypeId)?.name || null;
    setProducts((old) => old.map((product) => product.id === editing.id ? { ...editing, category: { name: categoryName }, itemType: itemTypeName ? { name: itemTypeName } : null } : product));
    setEditing(null); setMessage('');
  }

  async function archive(product: Product) {
    if (!window.confirm(`Archive ${product.name}? It can be restored later.`)) return;
    setProducts((old) => old.map((item) => item.id === product.id ? { ...item, deletedAt: new Date().toISOString(), isPublished: false } : item));
    const response = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
    if (!response.ok) setProducts(initialProducts);
  }

  async function restore(product: Product) {
    setProducts((old) => old.map((item) => item.id === product.id ? { ...item, deletedAt: null, isPublished: true } : item));
    const response = await fetch(`/api/products/${product.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) });
    if (!response.ok) setProducts(initialProducts);
  }

  async function deleteForever(product: Product) {
    if (!window.confirm(`Permanently delete ${product.name}? This cannot be undone.`)) return;
    setProducts((old) => old.filter((item) => item.id !== product.id));
    const response = await fetch(`/api/products/${product.id}?permanent=true`, { method: 'DELETE' });
    if (!response.ok) setProducts(initialProducts);
  }

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (a.deletedAt && !b.deletedAt) return 1;
      if (!a.deletedAt && b.deletedAt) return -1;
      return 0;
    });
  }, [products]);

  return (
    <>
      <div className="space-y-4">
        {sortedProducts.length === 0 ? <div className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-soft text-stone-500">No products found.</div> : sortedProducts.map((product) => (
          <div key={product.id} className={`rounded-[2rem] border p-5 shadow-soft ${product.deletedAt ? 'border-stone-200 bg-stone-50 opacity-80' : 'border-pink-100 bg-white'}`}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-pink-50"><img src={product.images.find((image) => image.isCover)?.url || product.images[0]?.url} alt="" className="h-full w-full object-cover" /></div>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-butterfly-700">{product.category.name}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">{product.segment}</span>{product.itemType && <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{product.itemType.name}</span>}{product.isNewArrival && <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">New Arrival</span>}{product.isBestSeller && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Top Sale</span>}{product.deletedAt && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Archived</span>}</div>
                  <h2 className="mt-3 text-xl font-black text-stone-900">{product.name}</h2>
                  <p className="mt-2 text-sm text-stone-500">SKU: {product.sku} · {product.stock} in stock · {product.images.length} image{product.images.length === 1 ? '' : 's'}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end"><span className="mr-2 font-black text-stone-900">{formatBDT(Number(product.salePrice || product.basePrice))}</span>{product.deletedAt ? <><button onClick={() => restore(product)} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"><ArchiveRestore size={15} /> Restore</button><button onClick={() => deleteForever(product)} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700"><Trash2 size={15} /> Delete</button></> : <><button onClick={() => startEdit(product)} className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-butterfly-700"><Pencil size={15} /> Edit</button><button onClick={() => archive(product)} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700"><ArchiveRestore size={15} /> Archive</button></>}</div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-stone-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Edit Product</p><h2 className="display-font mt-2 text-3xl font-semibold">{editing.name}</h2></div><button onClick={() => setEditing(null)} className="rounded-full bg-stone-100 p-3"><X size={20} /></button></div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className={cls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Product name" />
              <input className={cls} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="Slug" />
              <select className={cls} value={editing.segment} onChange={(e) => setEditing({ ...editing, segment: e.target.value, categoryId: '' })}><option value="WOMEN">Women</option><option value="MEN">Men</option><option value="CHILDREN">Children</option></select>
              <select className={cls} value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}><option value="">Select category</option>{filteredCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
              <select className={cls} value={editing.itemTypeId} onChange={(e) => setEditing({ ...editing, itemTypeId: e.target.value })}><option value="">Select item type (optional)</option>{activeItemTypes.map((itemType) => <option key={itemType.id} value={itemType.id}>{itemType.name}</option>)}</select>
              <input className={cls} type="number" value={editing.basePrice} onChange={(e) => setEditing({ ...editing, basePrice: Number(e.target.value) })} placeholder="Regular price" />
              <input className={cls} type="number" value={editing.salePrice || ''} onChange={(e) => setEditing({ ...editing, salePrice: e.target.value ? Number(e.target.value) : null })} placeholder="Sale price" />
              <input className={cls} value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} placeholder="SKU" />
              <input className={cls} type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} placeholder="Stock per variant" />
              <input className={cls} value={editing.sizes.join(', ')} onChange={(e) => setEditing({ ...editing, sizes: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} placeholder="Sizes: S, M, L" />
              <input className={cls} value={editing.colors.join(', ')} onChange={(e) => setEditing({ ...editing, colors: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} placeholder="Colors: Pink, Black" />
              <div className="md:col-span-2"><MultiImageUploader value={editing.images} onChange={(images) => setEditing({ ...editing, images })} /><div className="mt-3 flex gap-2"><input className={cls} type="url" value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder="Paste an image URL" /><button type="button" onClick={addUrl} className="shrink-0 rounded-full bg-pink-50 px-5 text-sm font-bold text-butterfly-700">Add URL</button></div></div>
              <textarea className={`${cls} min-h-28 md:col-span-2`} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              <div className="grid gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-4 md:col-span-2 sm:grid-cols-3"><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={editing.isPublished} onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })} /> Published</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={editing.isNewArrival} onChange={(e) => setEditing({ ...editing, isNewArrival: e.target.checked })} /> New Arrival</label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={editing.isBestSeller} onChange={(e) => setEditing({ ...editing, isBestSeller: e.target.checked })} /> Top Sale</label></div>
              {message && <p className="text-sm font-semibold text-red-600 md:col-span-2">{message}</p>}
              <button onClick={save} disabled={saving} className="rounded-full bg-butterfly-600 px-5 py-3 font-bold text-white md:col-span-2 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
