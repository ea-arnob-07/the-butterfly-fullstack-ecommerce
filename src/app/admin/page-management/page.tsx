import { redirect } from 'next/navigation';
import { getSession, isAdminRole } from '@/lib/auth';
import { getSiteSettings } from '@/lib/site-settings';
import { AdminNav } from '@/components/admin-nav';
import { PageManagementForm } from '@/components/page-management-form';

export default async function PageManagementPage() {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) redirect('/auth/login?next=/admin/page-management');
  const settings = await getSiteSettings();
  return (
    <section className="container-shell py-14">
      <p className="font-bold uppercase tracking-[0.18em] text-butterfly-600">Admin</p>
      <h1 className="section-title mt-2">Page Management</h1>
      <p className="mt-3 max-w-3xl text-stone-500">Manage the logo, cover photo, site name, page title, descriptions, contact details, WhatsApp and social links without editing code.</p>
      <div className="mt-8"><AdminNav current="/admin/page-management" /></div>
      <div className="mt-8"><PageManagementForm initial={settings} /></div>
    </section>
  );
}
