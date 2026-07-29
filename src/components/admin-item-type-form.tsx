'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArchiveRestore, Check, Pencil, Trash2, X } from 'lucide-react';

type ItemType = { id: string; name: string; slug: string; position: number; isActive: boolean };

export function AdminItemTypeForm({ initialItemTypes }: { initialItemTypes: ItemType[] }) {
  const router = useRouter();
  const [itemTypes, setItemTypes] = useState(initialItemTypes);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ItemType | null>(null);
  const cls = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-butterfly-400';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const payload = { name: form.get('name'), slug: form.get('slug'), position: Number(form.get('position') || 0) };
    const response = await fetch('/api/item-types', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Could not create item type.');
    setItemTypes((old) => [...old, data.itemType].sort((a, b) => a.position - b.position));
    event.currentTarget.reset();
    setMessage('Item type created successfully.');
    router.refresh();
  }

  async function saveEdit() {
    if (!editing) return;
    setLoading(true);
    setMessage('');
    const response = await fetch(`/api/item-types/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setMessage(data.error || 'Could not update item type.');
    setItemTypes((old) => old.map((item) => item.id === editing.id ? data.itemType : item).sort((a, b) => a.position - b.position));
    setEditing(null);
    setMessage('Item type updated.');
    router.refresh();
  }

  async function toggle(itemType: ItemType) {
    const optimistic = { ...itemType, isActive: !itemType.isActive };
    setItemTypes((old) => old.map((item) => item.id === itemType.id ? optimistic : item));
    const response = await fetch(`/api/item-types/${itemType.id}`, itemType.isActive
      ? { method: 'DELETE' }
      : { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'restore' }) });
    const data = await response.json();
    if (response.ok) {
      setItemTypes((old) => old.map((item) => item.id === itemType.id ? data.itemType : item));
      router.refresh();
    } else {
      setItemTypes((old) => old.map((item) => item.id === itemType.id ? itemType : item));
      setMessage(data.error || 'Could not update item type.');
    }
  }

  return (
    <div className="space-y-5 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-soft">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-butterfly-600">Item Type Manager</p>
        <h2 className="display-font mt-2 text-3xl font-semibold text-stone-900">Manage dress, accessory and other types</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">Item types are separate from categories, so the admin can add Dress, Accessory, Footwear, Bag, Jewellery or any custom type.</p>
      </div>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input className={cls} name="name" placeholder="Item type name" required />
        <input className={cls} name="slug" placeholder="item-type-slug" pattern="[a-z0-9-]+" required />
        <input className={cls} name="position" type="number" min="0" defaultValue="0" placeholder="Display position" />
        <button disabled={loading} className="rounded-full bg-stone-950 px-5 py-3 font-bold text-white transition hover:bg-stone-800">{loading ? 'Working...' : 'Create Item Type'}</button>
      </form>

      <div className="space-y-2">
        {itemTypes.map((itemType) => editing?.id === itemType.id ? (
          <div key={itemType.id} className="grid gap-2 rounded-xl border border-stone-100 bg-stone-50 p-3 md:grid-cols-[1fr_1fr_110px_auto]">
            <input className={cls} value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
            <input className={cls} value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} />
            <input className={cls} type="number" min="0" value={editing.position} onChange={(event) => setEditing({ ...editing, position: Number(event.target.value) })} />
            <div className="flex gap-2">
              <button type="button" onClick={saveEdit} className="rounded-full bg-emerald-50 p-3 text-emerald-700"><Check size={16} /></button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-full bg-stone-100 p-3"><X size={16} /></button>
            </div>
          </div>
        ) : (
          <div key={itemType.id} className={`flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-stone-50/60 p-3 ${itemType.isActive ? '' : 'opacity-55'}`}>
            <div><p className="font-bold text-stone-800">{itemType.name}</p><p className="text-xs text-stone-400">/{itemType.slug} · position {itemType.position}</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(itemType)} className="rounded-full bg-pink-50 p-2.5 text-butterfly-700"><Pencil size={15} /></button>
              <button type="button" onClick={() => toggle(itemType)} className={`rounded-full p-2.5 ${itemType.isActive ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{itemType.isActive ? <Trash2 size={15} /> : <ArchiveRestore size={15} />}</button>
            </div>
          </div>
        ))}
      </div>
      {message && <p className="text-sm font-semibold text-butterfly-700">{message}</p>}
    </div>
  );
}
