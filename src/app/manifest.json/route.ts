import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'manifest.json');
  const content = fs.readFileSync(filePath, 'utf8');
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
