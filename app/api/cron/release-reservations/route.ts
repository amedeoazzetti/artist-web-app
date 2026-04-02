import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ released: 0 });
}
