import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Select a payment screenshot.' }, { status: 400 });
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'Payment screenshot must be smaller than 4 MB.' }, { status: 400 });

    const uploaded = await uploadImageToCloudinary(file, 'the-butterfly/payment-proofs');
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Payment screenshot upload failed.' }, { status: 500 });
  }
}
