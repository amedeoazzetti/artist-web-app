import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  try {
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
