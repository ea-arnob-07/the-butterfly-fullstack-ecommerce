'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }
  return <button onClick={logout} className="rounded-full border border-pink-200 px-5 py-2.5 font-bold text-butterfly-700 hover:bg-pink-50">Log Out</button>;
}
