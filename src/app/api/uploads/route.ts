import { NextResponse } from 'next/server';
import { getSession, isAdminRole } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select an image file.' }, { status: 400 });
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Image must be smaller than 10 MB.' }, { status: 400 });

    const uploaded = await uploadImageToCloudinary(file);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Image upload failed.' }, { status: 500 });
  }
}
