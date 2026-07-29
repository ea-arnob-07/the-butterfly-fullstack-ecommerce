'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArchiveRestore, Check, Pencil, Trash2, X } from 'lucide-react';

type Category = { id: string; name: string; slug: string; segment: string; position: number; isActive: boolean };

export function AdminCategoryForm({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const cls = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-butterfly-400';

  const grouped = useMemo(() => ['WOMEN', 'MEN', 'CHILDREN'].map((segment) => ({ segment, items: categories.filter((c) => c.segment === segment).sort((a, b) => a.position - b.position) })), [categories]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = { name: form.get('name'), slug: form.get('slug'), segment: form.get('segment'), position: Number(form.get('position') || 0) };
    const response = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Could not create category.');
    setCategories((old) => [...old, data.category]); event.currentTarget.reset(); setMessage('Category created successfully.'); router.refresh();
  }

  async function saveEdit() {
    if (!editing) return; setLoading(true); setMessage('');
    const response = await fetch(`/api/categories/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Could not update category.');
    setCategories((old) => old.map((c) => c.id === editing.id ? data.category : c)); setEditing(null); setMessage('Category updated.'); router.refresh();
  }

  async function toggle(category: Category) {
    const optimistic = { ...category, isActive: !category.isActive };
    setCategories((old) => old.map((item) => item.id === category.id ? optimistic : item));
    setMessage('');
    const response = await fetch(`/api/categories/${category.id}`, category.isActive
      ? { method: 'DELETE' }
      : { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) });
    const data = await response.json();
    if (response.ok) {
      setCategories((old) => old.map((item) => item.id === category.id ? data.category : item));
      router.refresh();
    } else {
      setCategories((old) => old.map((item) => item.id === category.id ? category : item));
      setMessage(data.error || 'Could not update category.');
    }
  }

  return (
    <div className="space-y-5 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft">
      <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Category Manager</p><h2 className="display-font mt-2 text-3xl font-semibold text-stone-900">Add, rename or remove categories</h2></div>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input className={cls} name="name" placeholder="Category name" required />
        <input className={cls} name="slug" placeholder="category-slug" pattern="[a-z0-9-]+" required />
        <select className={cls} name="segment" required><option value="WOMEN">Women</option><option value="MEN">Men</option><option value="CHILDREN">Children</option></select>
        <input className={cls} name="position" type="number" min="0" defaultValue="0" placeholder="Display position" />
        <button disabled={loading} className="rounded-full bg-stone-950 px-5 py-3 font-bold text-white transition hover:bg-stone-800 md:col-span-2">{loading ? 'Working...' : 'Create Category'}</button>
      </form>

      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.segment} className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-stone-500">{group.segment}</p>
            <div className="space-y-2">
              {group.items.map((category) => editing?.id === category.id ? (
                <div key={category.id} className="grid gap-2 rounded-xl bg-white p-3 md:grid-cols-[1fr_1fr_110px_auto]">
                  <input className={cls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  <input className={cls} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
                  <input className={cls} type="number" min="0" value={editing.position} onChange={(e) => setEditing({ ...editing, position: Number(e.target.value) })} />
                  <div className="flex gap-2"><button type="button" onClick={saveEdit} className="rounded-full bg-emerald-50 p-3 text-emerald-700"><Check size={16} /></button><button type="button" onClick={() => setEditing(null)} className="rounded-full bg-stone-100 p-3"><X size={16} /></button></div>
                </div>
              ) : (
                <div key={category.id} className={`flex items-center justify-between gap-3 rounded-xl bg-white p-3 ${category.isActive ? '' : 'opacity-55'}`}>
                  <div><p className="font-bold text-stone-800">{category.name}</p><p className="text-xs text-stone-400">/{category.slug} · position {category.position}</p></div>
                  <div className="flex gap-2"><button type="button" onClick={() => setEditing(category)} className="rounded-full bg-pink-50 p-2.5 text-butterfly-700"><Pencil size={15} /></button><button type="button" onClick={() => toggle(category)} className={`rounded-full p-2.5 ${category.isActive ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{category.isActive ? <Trash2 size={15} /> : <ArchiveRestore size={15} />}</button></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-sm font-semibold text-butterfly-700">{message}</p>}
    </div>
  );
}
